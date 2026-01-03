import EmployeeRepository from "../repositories/employee.repo";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendMail } from "../utils/sendMail";
import LeaveRepository from "../repositories/leave.repo";
import PunchRepository from "../repositories/punch.repo";

class EmployeeService {
  public repo = new EmployeeRepository();
  public punchRepo = new PunchRepository();
  public leaveRepo = new LeaveRepository();
  constructor() {
    this.repo = new EmployeeRepository();
    this.punchRepo = new PunchRepository();
    this.leaveRepo = new LeaveRepository();
  }

  async createEmployee(payload: any) {
    const existing = await this.repo.findByEmail(payload.email);
    if (existing) throw new Error("Employee email already exists");
    const rawPassword = crypto.randomBytes(4).toString("hex");
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const created = await this.repo.create({
      ...payload,
      password: hashedPassword,
    });

    const html = `
      <p>Hello <b>${created.get("name")}</b>,</p>
      <p>Your employee account has been created.</p>
      <p><b>Login Details:</b></p>
      <ul>
        <li><b>Email:</b> ${created.get("email")}</li>
        <li><b>Password:</b> <b>${rawPassword}</b></li>
      </ul>
      <p>Please change your password after first login.</p>
    `;

    // await sendMail(
    //   created.get("email"),
    //   "Your Employee Account Login Details",
    //   html
    // );
    const mailSent = await sendMail(
      created.get("email"),
      "Your Employee Account Login Details",
      html
    );
    return {
      employee: created,
      tempPassword: rawPassword,
    };
  }

  async listEmployeesByAdmin(admin_id: string) {
    return this.repo.listByAdmin(admin_id);
  }

  async findById(id: string) {
    return this.repo.findById(id);
  }
  async listEmployeesLeaves(admin_id: string) {
    const employees = await this.repo.listByAdmin(admin_id);
    const employeesDetailed = await Promise.all(
      employees.map(async (emp) => {
        const leaves = await this.leaveRepo.listByEmployee(emp?.id);
        return {
          ...emp?.dataValues,
          leaves,
        };
      })
    );

    return employeesDetailed;
  }

async listEmployeespunches(admin_id: string, date?: string) {
  const employees = await this.repo.listByAdmin(admin_id);
  const expectedStartTime = 12;

  const selectedDate = date;

  const employeesDetailed = await Promise.all(
    employees.map(async (emp) => {
      let punches = await this.punchRepo.listAllByEmployee(emp?.id);

      if (selectedDate) {
        punches = punches.filter((punch: any) => {
          const punchData = punch.dataValues || punch;
          const punchDate = new Date(
            punchData.punch_in_time || punchData.created_at
          );

          const punchDateKey = punchDate.toISOString().split("T")[0];
          return punchDateKey === selectedDate;
        });
      }

      const dateStatusMap = new Map<
        string,
        { status: string; isLate: boolean }
      >();

      punches.forEach((punch: any) => {
        const punchData = punch.dataValues || punch;
        const punchDate = new Date(
          punchData.punch_in_time || punchData.created_at
        );
        const dateKey = punchDate.toISOString().split("T")[0];

        if (punchData.type === "IN") {
          const hour = punchDate.getHours();
          const minutes = punchDate.getMinutes();

          const isLate =
            hour > expectedStartTime ||
            (hour === expectedStartTime && minutes > 0);

          dateStatusMap.set(dateKey, {
            status: "present",
            isLate,
          });
        }
      });

      const punchesWithStatus = punches.map((punch: any) => {
        const punchData = punch.dataValues || punch;
        const punchDate = new Date(
          punchData.punch_in_time || punchData.created_at
        );
        const dateKey = punchDate.toISOString().split("T")[0];
        const dateStatus = dateStatusMap.get(dateKey);

        return {
          ...punchData,
          status: dateStatus?.status || "absent",
          isLate: dateStatus?.isLate || false,
        };
      });

      return {
        ...emp?.dataValues,
        punches: punchesWithStatus,
      };
    })
  );

  return employeesDetailed;
}

  async updateEmployee(employeeId: string, adminId: string, payload: any) {
    const employee = await this.repo.findById(employeeId);
    if (!employee || employee.admin_id !== adminId) {
      throw new Error("Employee not found or unauthorized");
    }

    if (payload.email && payload.email !== employee.email) {
      const existing = await this.repo.findByEmail(payload.email);
      if (existing) throw new Error("Email already exists");
    }

    return await this.repo.update(employeeId, payload);
  }

  async deleteEmployee(employeeId: string, adminId: string) {
    const employee = await this.repo.findById(employeeId);
    if (!employee || employee.admin_id !== adminId) {
      throw new Error("Employee not found or unauthorized");
    }

    await this.repo.delete(employeeId);
  }

  async getDashboardData(adminId: string) {
    const employees = await this.repo.listByAdmin(adminId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dashboardData = await Promise.all(
      employees.map(async (emp) => {
        const punches = await this.punchRepo.listByEmployee(emp.id);
        const leaves = await this.leaveRepo.listByEmployee(emp.id);

        const todayPunches = punches.filter((p) => {
          const punchDate = new Date(p.created_at);
          return punchDate >= today;
        });

        const activeLeaves = leaves.filter(
          (l) =>
            l.status === "approved" &&
            new Date(l.start_date) <= today &&
            new Date(l.end_date) >= today
        );

        const pendingLeaves = leaves.filter((l) => l.status === "pending");

        const isPresent = todayPunches.some((p) => p.type === "IN");
        const hasPunchedOut = todayPunches.some((p) => p.type === "OUT");

        return {
          id: emp.id,
          name: emp.name,
          email: emp.email,
          emp_id: emp.emp_id,
          department: emp.dept,
          job_role: emp.job_role,
          status:
            activeLeaves.length > 0
              ? "On Leave"
              : isPresent
              ? "Present"
              : "Absent",
          attendance: {
            punchedIn: isPresent,
            punchedOut: hasPunchedOut,
            punchInTime: todayPunches.find((p) => p.type === "IN")?.created_at,
            punchOutTime: todayPunches.find((p) => p.type === "OUT")
              ?.created_at,
          },
          leaves: {
            active: activeLeaves.length,
            pending: pendingLeaves.length,
            total: leaves.length,
          },
        };
      })
    );

    const summary = {
      totalEmployees: employees.length,
      present: dashboardData.filter((d) => d.status === "Present").length,
      absent: dashboardData.filter((d) => d.status === "Absent").length,
      onLeave: dashboardData.filter((d) => d.status === "On Leave").length,
      pendingLeaves: dashboardData.reduce(
        (sum, d) => sum + d.leaves.pending,
        0
      ),
    };

    return {
      summary,
      employees: dashboardData,
    };
  }

  async updateEmployeeProfile(employeeId: string, payload: any) {
    const employee = await this.repo.findById(employeeId);
    if (!employee) {
      throw new Error("Employee not found");
    }

    const allowedFields = ["name", "phone_number", "profile_photo"];
    const updateData: any = {};

    allowedFields.forEach((field) => {
      if (payload[field] !== undefined) {
        updateData[field] = payload[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      throw new Error("No valid fields to update");
    }

    return await this.repo.update(employeeId, updateData);
  }
}

export default EmployeeService;
