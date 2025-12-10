import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import dotenv from "dotenv";
dotenv.config();

export default fp(async (fastify, opts) => {
  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || "secret",
  });

  fastify.decorate("authenticate", async (request: any, reply: any) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      return reply.send(err);
    }
  });
});
