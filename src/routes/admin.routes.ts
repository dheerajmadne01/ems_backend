import { decodeToken } from "../middleware/authMiddleware";
import { FastifyInstance } from "fastify";
import AdminController from "../controllers/admin.controller";
export async function adminRoutes(fastify: FastifyInstance) {

  fastify.put(
    "/admin/location",
    { preHandler: decodeToken },
    AdminController.setLocation
  );
  fastify.get(
    "/admin/me",
    { preHandler: decodeToken },
    AdminController.getadminbyid
  );
  fastify.post(
    "/admin/employee",
    { preHandler: decodeToken },
    AdminController.createEmployee
  );
  fastify.post(
    "/admin/manager",
    { preHandler: decodeToken },
    AdminController.createmanager
  );
  fastify.get(
    "/admin/employees",
    { preHandler: decodeToken },
    AdminController.listEmployees
  );
  fastify.put(
    "/admin/employee/:id",
    { preHandler: decodeToken },
    AdminController.updateEmployee
  );
  fastify.delete(
    "/admin/employee/:id",
    { preHandler: decodeToken },
    AdminController.deleteEmployee
  );
  fastify.get(
    "/admin/dashboard",
    { preHandler: decodeToken },
    AdminController.getDashboard
  );
  
}
