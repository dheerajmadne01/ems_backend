import { FastifyInstance } from "fastify";
import { decodeToken } from "../middleware/authMiddleware";
import LeaveController from "../controllers/leave.controller";

export async function leaveRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/leave/:id/decide",
    { preHandler: decodeToken },
    LeaveController.decide
  );
}
