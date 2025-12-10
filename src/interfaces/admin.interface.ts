export default interface AdminInterface {
  id?: string;
  name: string;
  email: string;
  password?: string;
  phone_number?: string;
  company_lat?: number | null;
  company_lng?: number | null;
  range_in_meter?: number;
  created_on?: number;
  updated_on?: number;
}