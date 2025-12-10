
export default interface UserInterface {
  id?: string;
  name: string;
  user_name: string;
  password: string;
  phone_number: string;
  email: string;
  firebase_token: string;
  language: string[];
  cover_photo?: string;
  created_on?: number;
  updated_on?: number;
  created_by?: string;
  updated_by?: string;
}
