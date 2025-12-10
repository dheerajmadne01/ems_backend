import { FastifyInstance } from "fastify";
import EmployeeController from "../controllers/employee.controller";
import { decodeToken } from "../middleware/authMiddleware";
export async function empRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/employee/punch",
    { preHandler: decodeToken },
    EmployeeController.punch
  );
  fastify.post(
    "/employee/leave",
    { preHandler: decodeToken },
    EmployeeController.applyLeave
  );
  fastify.get(
    "/employee/punches/:employee_id",
    { preHandler: decodeToken },
    EmployeeController.listPunch
  );
  fastify.get(
    "/employee/punches",
    { preHandler: decodeToken },
    EmployeeController.listofpunches
  );
  fastify.get(
    "/employee/leaves",
    { preHandler: decodeToken },
    EmployeeController.listLeaves
  );
  fastify.get(
    "/employee/all-emp-leaves",
    { preHandler: decodeToken },
    EmployeeController.listEmployeesLeaves
  );
  fastify.get(
    "/employee/all-emp-punches",
    { preHandler: decodeToken },
    EmployeeController.allEmpPunches
  );
  fastify.get(
    "/employee/profile",
    { preHandler: decodeToken },
    EmployeeController.getProfile
  );
  fastify.put(
    "/employee/profile",
    { preHandler: decodeToken },
    EmployeeController.updateProfile
  );
}
