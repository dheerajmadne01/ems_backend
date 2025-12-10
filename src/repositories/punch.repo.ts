import PunchModel from "../models/punch.model";
import PunchInterface from "../interfaces/punch.interface";

class PunchRepository {
  private model = PunchModel;

  async create(data: Partial<PunchInterface>) {
    return this.model.create(data as any);
  }

  async listByEmployee(employee_id: string) {
    return this.model.findAll({
      where: { employee_id },
      order: [["created_at", "DESC"]],
      attributes: { exclude: ["employee_id","created_at","updated_at"] },
    });
  }

  async findLastPunch(employee_id: string) {
    return this.model.findOne({
      where: {
        employee_id,
      },
      order: [["created_at", "DESC"]],
    });
  }

  async updatePunchOut(punchId: string, data: any) {
    return this.model.update(data, {
      where: { id: punchId },
    });
  }
}

export default PunchRepository;
