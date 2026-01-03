import { DataTypes, Model } from "sequelize";
import { sequelize } from "../plugins/sequelize";

/**
 * NotificationModel - Stores notification records
 * Tracks all notifications sent to users
 */
class NotificationModel extends Model {
  id!: string;
  title!: string;
  message!: string;
  type!: "PUNCH_IN" | "LEAVE_REQUEST" | "LEAVE_APPROVED" | "LEAVE_REJECTED";
  sender_user_id!: string;
  receiver_user_id!: string;
  is_read!: boolean;
  created_at!: Date;
}

NotificationModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "Notification title",
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "Notification message body",
    },
    type: {
      type: DataTypes.ENUM("PUNCH_IN", "LEAVE_REQUEST", "LEAVE_APPROVED", "LEAVE_REJECTED"),
      allowNull: false,
      comment: "Type of notification",
    },
    sender_user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: "UUID of user who triggered the notification",
    },
    receiver_user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: "UUID of user who receives the notification",
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Whether the notification has been read",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "notifications",
    timestamps: false,
    indexes: [
      {
        fields: ["receiver_user_id"],
      },
      {
        fields: ["type"],
      },
      {
        fields: ["is_read"],
      },
      {
        fields: ["created_at"],
      },
    ],
  }
);

export default NotificationModel;


