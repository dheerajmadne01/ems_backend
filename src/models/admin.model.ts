import { DataTypes, Model } from "sequelize";
import { sequelize } from "../plugins/sequelize";

class AdminModel extends Model {
  id!: string;
  name!: string;
  email!: string;
  password!: string;
  company_lat?: number;
  company_lng?: number;
  range_in_meter?: number;
}

AdminModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    phone_number: { type: DataTypes.STRING, allowNull: true },
    company_lat: { type: DataTypes.DOUBLE, allowNull: true },
    company_lng: { type: DataTypes.DOUBLE, allowNull: true },
    range_in_meter: { type: DataTypes.INTEGER, defaultValue: 200 },
    created_on: {
      type: DataTypes.BIGINT.UNSIGNED,
      defaultValue: () => Date.now(),
    },
    updated_on: {
      type: DataTypes.BIGINT.UNSIGNED,
      defaultValue: () => Date.now(),
    },
  },
  { sequelize, tableName: "admins", timestamps: false }
);

export default AdminModel;
