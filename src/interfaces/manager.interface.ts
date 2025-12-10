class ManagerInterface {
  id?: string;
  admin_id!: string;
  name!: string;
  email!: string;
  password?: string;
  created_at?: Date;
  updated_at?: Date;
}
export default ManagerInterface;
