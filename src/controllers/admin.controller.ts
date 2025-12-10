import { FastifyReply, FastifyRequest } from "fastify";
import AdminService from "../services/admin.service";
import EmployeeService from "../services/employee.service";
import managerservice from "../services/manager.service";
import { Console } from "console";

const adminService = new AdminService();
const employeeService = new EmployeeService();
const managerService = new managerservice();
class AdminController {
  async setLocation(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { lat, lng } = req.body as any;
      console.log("latlng", lat, lng);
      const adminId = (req as any).user?.id;
      if (!adminId) {
        return reply.status(401).send({
          status_code: 401,
          message: "Unauthorized",
        });
      }

      if (!lat || !lng) {
        return reply.status(400).send({
          status_code: 400,
          message: "Latitude & Longitude required",
        });
      }

      const data = await adminService.setLocation(
        adminId,
        Number(lat),
        Number(lng)
      );

      return reply.send({
        status_code: 200,
        message: "Location updated successfully",
        data,
      });
    } catch (err: any) {
      return reply.status(400).send({
        status_code: 400,
        message: err.message,
      });
    }
  }

  async getadminbyid(req: FastifyRequest, reply: FastifyReply) {
    try {
      const adminId = (req as any).user?.id;
      if (!adminId) {
        return reply.status(401).send({
          status_code: 401,
          message: "Unauthorized",
        });
      }

      const data = await adminService.getAdminById(adminId);

      return reply.send({
        status_code: 200,
        data,
      });
    } catch (err: any) {
      return reply.status(400).send({
        status_code: 400,
        message: err.message,
      });
    }
  }
  async createEmployee(req: FastifyRequest, reply: FastifyReply) {
    try {
      const adminId = (req as any).user?.id;
      const body = req.body as any;

      body.admin_id = adminId;
      const response = await employeeService.createEmployee(body);

      return reply.status(201).send({
        status_code: 201,
        message: "Employee created and login credentials sent via email",
        data: response,
      });
    } catch (err: any) {
      return reply.status(400).send({ status_code: 400, message: err.message });
    }
  }

  async createmanager(req: FastifyRequest, reply: FastifyReply) {
    try {
      const adminId = (req as any).user?.id;
      const body = req.body as any;

      body.admin_id = adminId;
      const response = await managerService.createManager(body);

      return reply.status(201).send({
        status_code: 201,
        message: "Manager created and login credentials sent via email",
        data: response,
      });
    } catch (err: any) {
      return reply.status(400).send({ status_code: 400, message: err.message });
    }
  }

  async listEmployees(req: FastifyRequest, reply: FastifyReply) {
    try {
      const adminId = (req as any).user?.id;
      const list = await employeeService.listEmployeesByAdmin(adminId);
      return reply.send({ status_code: 200, data: list });
    } catch (err: any) {
      return reply.status(500).send({ status_code: 500, message: err.message });
    }
  }

  async updateEmployee(req: FastifyRequest, reply: FastifyReply) {
    try {
      const adminId = (req as any).user?.id;
      const employeeId = (req.params as any).id;
      const body = req.body as any;

      const updated = await employeeService.updateEmployee(
        employeeId,
        adminId,
        body
      );
      return reply.send({
        status_code: 200,
        message: "Employee updated successfully",
        data: updated,
      });
    } catch (err: any) {
      return reply.status(400).send({ status_code: 400, message: err.message });
    }
  }

  async deleteEmployee(req: FastifyRequest, reply: FastifyReply) {
    try {
      const adminId = (req as any).user?.id;
      const employeeId = (req.params as any).id;

      await employeeService.deleteEmployee(employeeId, adminId);
      return reply.send({
        status_code: 200,
        message: "Employee deleted successfully",
      });
    } catch (err: any) {
      return reply.status(400).send({ status_code: 400, message: err.message });
    }
  }

  async getDashboard(req: FastifyRequest, reply: FastifyReply) {
    try {
      const adminId = (req as any).user?.id;
      const dashboard = await employeeService.getDashboardData(adminId);
      return reply.send({ status_code: 200, data: dashboard });
    } catch (err: any) {
      return reply.status(500).send({ status_code: 500, message: err.message });
    }
  }
}

export default new AdminController();
