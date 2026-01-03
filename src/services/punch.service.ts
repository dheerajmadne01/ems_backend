import PunchRepository from "../repositories/punch.repo";
import EmployeeRepository from "../repositories/employee.repo";
import AdminRepository from "../repositories/admin.repo";
import NotificationService from "./notification.service";
import { metersBetween } from "../utils/distance";
import PunchInterface from "../interfaces/punch.interface";

class PunchService {
  private punchRepo = new PunchRepository();
  private empRepo = new EmployeeRepository();
  private adminRepo = new AdminRepository();
  private notificationService = new NotificationService();

  async punch(payload: PunchInterface) {
    const emp = await this.empRepo.findById(payload.employee_id);
    if (!emp) throw new Error("Employee not found");

    const adminId = emp.admin_id;
    const admin = await this.adminRepo.findById(adminId);
    if (!admin) throw new Error("Company location not found");

    const lat = Number(payload.lat);
    const lng = Number(payload.lng);
    const companyLat = admin.company_lat;
    const companyLng = admin.company_lng;
    const radius = admin.range_in_meter || 200;
    let distance = 0;
    let within = false;

    if (
      companyLat != null &&
      companyLng != null &&
      !isNaN(lat) &&
      !isNaN(lng)
    ) {
      distance = metersBetween(
        Number(companyLat),
        Number(companyLng),
        lat,
        lng
      );
      const radius = Math.max(admin.range_in_meter || 200, 200);
      within = distance <= radius;
    }

    if (!within) {
      return { warning: "Outside geofence" };
    }

    const punchData: any = {
      employee_id: payload.employee_id,
      admin_id: adminId,
      type: payload.type.toUpperCase(),
      lat,
      lng,
      distance_from_office: Math.round(distance),
      geofence_passed: within,
      source: payload.source || "mobile",
      note: payload.note || null,
    };

    if (payload.type.toUpperCase() === "IN") {
      punchData.punch_in_time = new Date();
    } else if (payload.type.toUpperCase() === "OUT") {
      punchData.punch_out_time = new Date();
    }
    else if (payload.type.toUpperCase() === "BREAK_START") {
      punchData.break_start_time = new Date();
    } else if (payload.type.toUpperCase() === "BREAK_END") {
      punchData.break_end_time = new Date();
    }

    const created = await this.punchRepo.create(punchData);

    // Send notification to ADMIN when employee punches IN
    if (payload.type.toUpperCase() === "IN") {
      try {
        const employee = await this.empRepo.findById(payload.employee_id);
        if (employee && adminId) {
          await this.notificationService.createAndSendNotification(
            {
              title: "New Punch In",
              message: `${employee.name} has punched in`,
              type: "PUNCH_IN",
              sender_user_id: payload.employee_id,
              receiver_user_id: adminId,
            },
            "New Punch In",
            `${employee.name} has punched in`,
            {
              type: "PUNCH_IN",
              employee_id: payload.employee_id,
              employee_name: employee.name,
              punch_id: created.id,
            }
          );
        }
      } catch (error: any) {
        // Log error but don't break the punch operation
        console.error("Error sending punch-in notification:", error.message);
      }
    }

    return { created };
  }

  async listPunch(employee_id: string) {
    return this.punchRepo.findLastPunch(employee_id);
  }

  async listAllPunch(employee_id: string) {
    return this.punchRepo.listByEmployee(employee_id);
  }
}

export default PunchService;
