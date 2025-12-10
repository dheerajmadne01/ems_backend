import { FastifyReply, FastifyRequest } from "fastify";
import LeaveService from "../services/leave.service";

const leaveService = new LeaveService();

class LeaveController {
  async decide(req: FastifyRequest, reply: FastifyReply) {
    try {
      const leaveId = (req.params as any).id;
      const action = (req.body as any).action as "approve" | "reject";
      const approver = (req.user as any)?.id;
      if (!approver)
        return reply
          .status(401)
          .send({ status_code: 401, message: "Unauthorized" });
      const res = await leaveService.decideLeave(leaveId, approver, action);
      return reply.send({ status_code: 200, data: res });
    } catch (err: any) {
      return reply.status(400).send({ status_code: 400, message: err.message });
    }
  }
}

export default new LeaveController();
