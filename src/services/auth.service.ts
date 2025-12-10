import AdminRepository from "../repositories/admin.repo";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import EmployeeRepository from "../repositories/employee.repo";
import { generateAccessToken, generateRefreshToken } from "../utils/auth.utils";
import managerRepo from "../repositories/manager.repo";
dotenv.config();

class AuthService {

  employeeRepo: any;
  managerrepo: any;
  adminRepo: any;

  constructor() {
    this.employeeRepo = new EmployeeRepository();
    this.managerrepo = new managerRepo();
    this.adminRepo = new AdminRepository();
  }

  async signup(payload: any) {
    const existing = await this.adminRepo.findByEmail(payload.email);
    if (existing) throw new Error("Email already exists");

    const hashed = await bcrypt.hash(payload.password, 10);
    const created = await this.adminRepo.create({
      ...payload,
      password: hashed,
    });

    return {
      id: created.id,
      email: created.email,
      name: created.name,
    };
  }

  async login(email: string, password: string) {
    if (!email || !password) {
      throw new Error("Email & password required");
    }

    let user: any = await this.adminRepo.findByEmail(email);
    let role = "admin";

    if (!user) {
      user = await this.employeeRepo.findByEmail(email);
      role = "employee";
    }

    if (!user) {
      user = await this.managerrepo.findByEmail(email);
      role = "manager";
    }
    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Incorrect password");

    const tokenPayload: any = {
      id: user.id,
      email: user.email,
      name: user.name,
      role,
      admin_id: role === "admin" ? user.id : undefined,
      employee_id: role === "employee" ? user.id : undefined,
      manager_id: role === "manager" ? user.id : undefined,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role,
      },
    };
  }

  async getAdminById(id: string) {
    return this.adminRepo.findById(id);
  }
}

export default AuthService;
