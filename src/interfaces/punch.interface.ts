export default interface PunchInterface {
  employee_id: string;
  type: "IN" | "OUT"; 
  lat: number;
  lng: number;
  source?: string;
  note?: string;
}