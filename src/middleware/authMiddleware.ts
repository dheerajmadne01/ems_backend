import jwt, { JwtPayload } from "jsonwebtoken";
import { FastifyReply, FastifyRequest } from "fastify";

export const decodeToken = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const auth = request.headers.authorization;

    if (!auth || !auth.startsWith("Bearer ")) {
      return reply.status(401).send({ message: "Token missing" });
    }

    const token = auth.split(" ")[1];
    const secretKey = process.env.ACCESS_SECRET!;

    try {
      const decoded = jwt.verify(token, secretKey) as JwtPayload;
      request.user = decoded;
      return; 
    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        return reply.status(401).send({
          message: "ACCESS_TOKEN_EXPIRED",
        });
      }

      return reply.status(401).send({
        message: "INVALID_ACCESS_TOKEN",
      });
    }

  } catch {
    return reply.status(401).send({ message: "Unauthorized" });
  }
};
