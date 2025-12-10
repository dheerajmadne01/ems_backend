import AdminModel from "../models/admin.model";
import AdminInterface from "../interfaces/admin.interface";
import EmployeeModel from "../models/employee.model";

class AdminRepository {
   model = AdminModel;
  empmodel = EmployeeModel;

  async create(data: Partial<AdminInterface>) {
    return this.model.create(data as any);
  }


  findByEmail(email: string) {
    return this.model.findOne({ where: { email } });
  }

  async findById(id: string) {
    return this.model.findByPk(id);
  }

  async updateLocation(
    adminId: string,
    lat: number,
    lng: number,
  ) {
    return this.model.update(
      {
        company_lat: lat,
        company_lng: lng,
        updated_on: Date.now(),
      },
      { where: { id: adminId } }
    );
  }
}

export default AdminRepository;
