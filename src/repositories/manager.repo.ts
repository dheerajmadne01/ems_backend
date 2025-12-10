import ManagerModel from "../models/manager.model";

class managerRepo {
  model= ManagerModel;


  async create(data: any) {
    return this.model.create(data);
  }

  async findByEmail(email: string) {
    return this.model.findOne({ where: { email } });
  }

  async findById(id: string) {
    return this.model.findByPk(id);
  }
}

export default managerRepo;