import bcrypt from "bcryptjs";
import crypto from "crypto";
import managerRepo from "../repositories/manager.repo";
import { sendMail } from "../utils/sendMail";

class managerservice {
  repo = new managerRepo();

  async createManager(payload: any) {
    const existing = await this.repo.findByEmail(payload.email);
    if (existing) throw new Error("Manager email already exists");
    const rawPassword = crypto.randomBytes(4).toString("hex");
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const created = await this.repo.create({
      ...payload,
      password: hashedPassword,
    });

    const html = `
      <p>Hello <b>${created.name}</b>,</p>
      <p>Your Manager account has been created.</p>
      <p><b>Login Details:</b></p>
      <ul>
        <li style="margin-top:10px"><b>Email:</b> ${created.email}</li>
        <li><b>Password:</b> <b>${rawPassword}</b></li>
      </ul>
      <p>Please change your password after first login.</p>
    `;

    await sendMail(created.email, "Your Manager Account Login Details", html);

    return {
      manger: created,
      tempPassword: rawPassword,
    };
  }
}
export default managerservice;
