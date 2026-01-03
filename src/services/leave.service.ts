import LeaveRepository from "../repositories/leave.repo";
import EmployeeRepository from "../repositories/employee.repo";
import NotificationService from "./notification.service";
import { sendMail } from "../utils/sendMail";

class LeaveService {
   repo = new LeaveRepository();
   employeeRepo = new EmployeeRepository();
   notificationService = new NotificationService();

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

    // Send notification to ADMIN when leave is requested
    try {
      const employee = await this.employeeRepo.findById(payload.employee_id);
      if (employee && employee.admin_id) {
        await this.notificationService.createAndSendNotification(
          {
            title: "New Leave Request",
            message: `${employee.name} has requested leave for ${diff} day(s)`,
            type: "LEAVE_REQUEST",
            sender_user_id: payload.employee_id,
            receiver_user_id: employee.admin_id,
          },
          "New Leave Request",
          `${employee.name} has requested leave for ${diff} day(s)`,
          {
            type: "LEAVE_REQUEST",
            employee_id: payload.employee_id,
            employee_name: employee.name,
            leave_id: created.id,
            days: diff.toString(),
            start_date: payload.start_date,
            end_date: payload.end_date,
          }
        );
      }
    } catch (error: any) {
      // Log error but don't break the leave application
      console.error("Error sending leave request notification:", error.message);
    }

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

      // Send push notification to EMPLOYEE when leave is approved/rejected
      try {
        const notificationType = action === "approve" ? "LEAVE_APPROVED" : "LEAVE_REJECTED";
        const notificationTitle = action === "approve" ? "Leave Approved" : "Leave Rejected";
        const notificationMessage = `Your leave request for ${leave.days} day(s) has been ${status}`;

        await this.notificationService.createAndSendNotification(
          {
            title: notificationTitle,
            message: notificationMessage,
            type: notificationType,
            sender_user_id: approverId,
            receiver_user_id: leave.employee_id,
          },
          notificationTitle,
          notificationMessage,
          {
            type: notificationType,
            leave_id: leaveId,
            days: leave.days.toString(),
            start_date: leave.start_date,
            end_date: leave.end_date,
            status: status,
          }
        );
      } catch (error: any) {
        // Log error but don't break the leave decision
        console.error("Error sending leave decision notification:", error.message);
      }
    }

    return this.repo.findById(leaveId);
  }

  async listByEmployee(employee_id: string) {
    return this.repo.listByEmployee(employee_id);
  }
}

export default LeaveService;
