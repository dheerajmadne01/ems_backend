export default interface NotificationInterface {
  id?: string;
  title: string;
  message: string;
  type: "PUNCH_IN" | "LEAVE_REQUEST" | "LEAVE_APPROVED" | "LEAVE_REJECTED";
  sender_user_id: string;
  receiver_user_id: string;
  is_read?: boolean;
  created_at?: Date;
}

export interface UserDeviceTokenInterface {
  id?: string;
  user_id: string;
  fcm_token: string;
  platform?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateNotificationData {
  title: string;
  message: string;
  type: "PUNCH_IN" | "LEAVE_REQUEST" | "LEAVE_APPROVED" | "LEAVE_REJECTED";
  sender_user_id: string;
  receiver_user_id: string;
}


