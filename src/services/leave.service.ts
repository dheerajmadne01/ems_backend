import LeaveRepository from "../repositories/leave.repo";
import EmployeeRepository from "../repositories/employee.repo";
import { sendMail } from "../utils/sendMail";

class LeaveService {
   repo = new LeaveRepository();
   employeeRepo = new EmployeeRepository();

  async applyLeave(payload: any) {
    const start = new Date(payload.start_date);
    const end = new Date(payload.end_date);
    const msPerDay = 24 * 60 * 60 * 1000;
    const diff = Math.round((end.getTime() - start.getTime()) / msPerDay) + 1;
    const created = await this.repo.create({
      ...payload,
      days: diff,
      status: "pending",
      applied_at: Date.now(),
    });
    return created;
  }

  async decideLeave(leaveId: string, approverId: string, action: "approve" | "reject") {
    const status = action === "approve" ? "approved" : "rejected";
    const leave = await this.repo.findById(leaveId);
    
    if (!leave) {
      throw new Error("Leave not found");
    }

    await this.repo.updateStatus(leaveId, status, approverId);
    
    const employee = await this.employeeRepo.findById(leave.employee_id);
    
    if (employee) {
      const subject = action === "approve" ? "Leave Approved" : "Leave Rejected";
      const html = `
        <p>Hello <b>${employee.name}</b>,</p>
        <p>Your leave request has been <b>${status}</b>.</p>
        <p><b>Leave Details:</b></p>
        <ul>
          <li><b>Start Date:</b> ${new Date(leave.start_date).toLocaleDateString()}</li>
          <li><b>End Date:</b> ${new Date(leave.end_date).toLocaleDateString()}</li>
          <li><b>Days:</b> ${leave.days}</li>
          <li><b>Reason:</b> ${leave.reason}</li>
        </ul>
        <p>Status: <b>${status.toUpperCase()}</b></p>
      `;

      await sendMail(employee.email, subject, html);
    }

    return this.repo.findById(leaveId);
  }

  async listByEmployee(employee_id: string) {
    return this.repo.listByEmployee(employee_id);
  }
}

export default LeaveService;
