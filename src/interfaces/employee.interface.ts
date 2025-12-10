export default interface EmployeeInterface {
  id?: string;
  admin_id: string;
  emp_id: string;
  name: string;
  email: string;
  password?: string;
  phone_number?: string;
  dept?: string;
  job_role?: string;
  salary?: number;
  profile_photo?: string;
  created_on?: number;
  updated_on?: number;
}
