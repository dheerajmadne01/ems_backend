import { FastifyReply, FastifyRequest } from "fastify";
import AuthService from "../services/auth.service";
import jwt from "jsonwebtoken";

const authService = new AuthService();

class AuthController {
  async signup(req: FastifyRequest, reply: FastifyReply) {
    try {
      const body = req.body as any;
      const created = await authService.signup(body);
      return reply
        .status(201)
        .send({ status_code: 201, message: "Admin created", data: created });
    } catch (err: any) {
      return reply.status(400).send({ status_code: 400, message: err.message });
    }
  }

  login = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const { email, password } = req.body as any;

      const data = await authService.login(email, password);

      return reply.send({
        status_code: 200,
        message: "Login successful",
        ...data,
      });
    } catch (err: any) {
      return reply.status(401).send({
        status_code: 401,
        message: err.message,
      });
    }
  };

 refreshtoken = async (req: FastifyRequest, reply: FastifyReply) => {
  const { refreshToken } = req.body as any;

  if (!refreshToken)
    return reply.status(401).send({ message: "Refresh token required" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET!) as jwt.JwtPayload;

    const newAccessToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      process.env.ACCESS_SECRET!,
      { expiresIn: "15m" }
    );

    return reply.send({ accessToken: newAccessToken });

  } catch (err) {
    return reply.status(401).send({ message: "Invalid refresh token" });
  }
};

}

export default new AuthController();
