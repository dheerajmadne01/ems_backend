import EmployeeModel from "../models/employee.model";
import EmployeeInterface from "../interfaces/employee.interface";

class EmployeeRepository {
  model = EmployeeModel;

  async create(data: Partial<EmployeeInterface>) {
    return this.model.create(data as any);
  }

  async findByEmail(email: string) {
    return this.model.findOne({ where: { email } });
  }

  async findById(id: string) {
    return this.model.findByPk(id);
  }

  async listByAdmin(admin_id: string) {
    return this.model.findAll({ where: { admin_id } ,
      attributes: { exclude: ["password","created_on","updated_on"] }
    });
  }

  async update(id: string, data: Partial<EmployeeInterface>) {
    await this.model.update(data, { where: { id } });
    return this.model.findByPk(id);
  }

  async delete(id: string) {
    return this.model.destroy({ where: { id } });
  }
}

export default EmployeeRepository;
