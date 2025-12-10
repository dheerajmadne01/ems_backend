import LeaveModel from "../models/leave.model";
import LeaveInterface from "../interfaces/leave.interface";

class LeaveRepository {
  private model = LeaveModel;

  async create(data: Partial<LeaveInterface>) {
    return this.model.create(data as any);
  }

  async findById(id: string) {
    return this.model.findByPk(id);
  }

  async listByEmployee(employee_id: string) {
    return this.model.findAll({ where: { employee_id }, order: [["applied_at", "DESC"]] });
  }

  async updateStatus(id: string, status: string, decided_by: string) {
    return this.model.update({ status, decided_by, decided_at: Date.now() }, { where: { id } });
  }
}

export default LeaveRepository;
