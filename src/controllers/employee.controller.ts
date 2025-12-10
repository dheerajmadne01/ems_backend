import { FastifyReply, FastifyRequest } from "fastify";
import PunchService from "../services/punch.service";
import LeaveService from "../services/leave.service";
import PunchInterface from "../interfaces/punch.interface";
import EmployeeService from "../services/employee.service";
import LeaveInterface from "../interfaces/leave.interface";

//  const employeservice = new EmployeeService();

class EmployeeController {
  punchService = new PunchService();
  leaveService = new LeaveService();
  employeservice = new EmployeeService();
  constructor() {
    this.punchService = new PunchService();
    this.leaveService = new LeaveService();
    this.employeservice = new EmployeeService();
  }
  punch = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = req.body as PunchInterface;
      console.log("body", body);
      const res = await this.punchService.punch(body);
      if ((res as any).warning) {
        return reply.status(400).send({
          status_code: 400,
          message: "Yor are outside of company location ",
          data: null,
        });
      }
      return reply.send({
        status_code: 200,
        message:
          body.type.toUpperCase() === "OUT"
            ? "Punch out recorded"
            : "Punch in recorded",
        data: res.created,
      });
    } catch (err: any) {
      return reply.status(400).send({ status_code: 400, message: err.message });
    }
  };

  applyLeave = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = req.body as LeaveInterface;
      const res = await this.leaveService.applyLeave(body);
      return reply
        .status(201)
        .send({ status_code: 201, message: "Leave applied", data: res });
    } catch (err: any) {
      return reply.status(400).send({ status_code: 400, message: err.message });
    }
  };

  listPunch = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const employee_id = (req.params as any).employee_id;
      // if (!employee_id) {
      //   return reply.status(401).send({
      //     status_code: 401,
      //     message: "Unauthorized - invalid token",
      //   });
      // }
      const list = await this.punchService.listPunch(employee_id);
      return reply.send({ status_code: 200, data: list });
    } catch (err: any) {
      return reply.status(500).send({ status_code: 500, message: err.message });
    }
  };

  allEmpPunches = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const adminid = (req.user as any).id as string;
      if (!adminid) {
        return reply.status(401).send({
          status_code: 401,
          message: "Unauthorized - invalid token",
        });
      }
      const data = await this.employeservice.listEmployeespunches(adminid);
      reply.send({ status_code: 200, data });
    } catch (err: any) {
      reply.status(500).send({ status_code: 500, message: err.message });
    }
  };

  listofpunches = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const employee_id = (req.user as any).employee_id;
      const list = await this.punchService.listAllPunch(employee_id);
      return reply.send({ status_code: 200, data: list });
    } catch (err: any) {
      return reply.status(500).send({ status_code: 500, message: err.message });
    }
  };
  listLeaves = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const employee_id = (req.user as any).id;
      if (!employee_id) {
        return reply.status(401).send({
          status_code: 401,
          message: "Unauthorized - invalid token",
        });
      }
      const list = await this.leaveService.listByEmployee(employee_id);
      return reply.send({ status_code: 200, data: list });
    } catch (err: any) {
      return reply.status(500).send({ status_code: 500, message: err.message });
    }
  };

  listEmployeesLeaves = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const adminid = (req.user as any).id as string;
      if (!adminid) {
        return reply.status(401).send({
          status_code: 401,
          message: "Unauthorized - invalid token",
        });
      }
      const data = await this.employeservice.listEmployeesLeaves(adminid);
      reply.send({ status_code: 200, data });
    } catch (err: any) {
      reply.status(500).send({ status_code: 500, message: err.message });
    }
  };

  getProfile = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const employeeId = (req.user as any).id;
      if (!employeeId) {
        return reply.status(401).send({
          status_code: 401,
          message: "Unauthorized - invalid token",
        });
      }
      const employee = await this.employeservice.findById(employeeId);
      return reply.send({ status_code: 200, data: employee });
    } catch (err: any) {
      reply.status(500).send({ status_code: 500, message: err.message });
    }
  };

  updateProfile = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const employeeId = (req.user as any).id;
      const body = req.body as any;

      if (!employeeId) {
        return reply.status(401).send({
          status_code: 401,
          message: "Unauthorized - invalid token",
        });
      }

      const updated = await this.employeservice.updateEmployeeProfile(
        employeeId,
        body
      );
      return reply.send({
        status_code: 200,
        message: "Profile updated successfully",
        data: updated,
      });
    } catch (err: any) {
      reply.status(400).send({ status_code: 400, message: err.message });
    }
  };
}

export default new EmployeeController();
