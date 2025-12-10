import { FastifyInstance } from "fastify";
import AuthController from "../controllers/auth.controller";
import authController from "../controllers/auth.controller";
export async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/auth/signup", AuthController.signup);
  fastify.post("/auth/login", AuthController.login);
  fastify.post("/auth/refresh-token", authController.refreshtoken);
}
