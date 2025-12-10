import fastify, { FastifyInstance } from "fastify";
import { authRoutes } from "./auth.routes";
import { adminRoutes } from "./admin.routes";
import { empRoutes } from "./employee.routes";
import { leaveRoutes } from "./leave.routes";
const basePrefix = '/api';
const server = fastify({ logger: true });



export default async function (fastify: FastifyInstance) {
fastify.register(authRoutes, { prefix: `${basePrefix}` });
fastify.register(adminRoutes, { prefix: `${basePrefix}` });
fastify.register(empRoutes, { prefix: `${basePrefix}` });
fastify.register(leaveRoutes, { prefix: `${basePrefix}` });

}