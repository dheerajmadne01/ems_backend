export default interface LeaveInterface {
  id?: string;
  employee_id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  days: number;
  status?: "pending" | "approved" | "rejected";
  applied_at?: number;
  decided_by?: string | null;
  decided_at?: number | null;
  reason?: string;
}
