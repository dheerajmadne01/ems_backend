import UserInterface from "../interfaces/auth.interface";
import UserModel from "../models/auth.model";

class UserRepository {
  private userModel: any;

  constructor() {
    this.userModel = UserModel;
  }

  async createUser(data: UserInterface) {
    return await this.userModel.create(data);
  };
}

export default UserRepository;
