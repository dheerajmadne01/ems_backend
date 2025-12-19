import UserInterface from "../interfaces/auth.interface";
import AdminModel from "../models/admin.model";

class UserRepository {
  private userModel: any;

  constructor() {
    this.userModel = AdminModel;
  }

  async createUser(data: UserInterface) {
    return await this.userModel.create(data);
  };
}

export default UserRepository;
