import AdminRepository from "../repositories/admin.repo";

class AdminService {
  private repo = new AdminRepository();

  async setLocation(adminId: string, lat: number, lng: number) {
    const updated = await this.repo.updateLocation(adminId, lat, lng);

    if (!updated) {
      throw new Error("Failed to update location");
    }

    return await this.repo.findById(adminId);
  }
  async getAdminById(id: string) {
    return this.repo.findById(id);
  }
}

export default AdminService;
