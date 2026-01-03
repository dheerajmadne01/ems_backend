import { DataTypes, Model } from "sequelize";
import { sequelize } from "../plugins/sequelize";

/**
 * UserDeviceTokenModel - Stores FCM tokens for push notifications
 * Each user can have multiple devices (multiple tokens)
 */
class UserDeviceTokenModel extends Model {
  id!: string;
  user_id!: string;
  fcm_token!: string;
  platform!: string;
  created_at!: Date;
  updated_at!: Date;
}

UserDeviceTokenModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: "UUID of user (employee or admin)",
    },
    fcm_token: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      comment: "Firebase Cloud Messaging token",
    },
    platform: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "android",
      comment: "Platform: android, ios, web",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "user_device_tokens",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        fields: ["user_id"],
      },
      {
        fields: ["fcm_token"],
        unique: true,
      },
    ],
  }
);

export default UserDeviceTokenModel;


