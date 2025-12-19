import { DataTypes, Model } from "sequelize";
import AdminModel from "./admin.model";
import { sequelize } from "../plugins/sequelize";

class EmployeeModel extends Model {
  id!: string;
  admin_id!: string;
  emp_id!: string;
  name!: string;
  email!: string;
  password?: string;
  phone_number?: string;
  dept?: string;
  job_role?: string;
  role!: string;
  salary!: number;
  profile_photo?: string;
  created_on!: number;
  updated_on!: number;
}

EmployeeModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    admin_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    emp_id: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: true },
    phone_number: { type: DataTypes.STRING, allowNull: true },
    dept: { type: DataTypes.STRING, allowNull: true },
    job_role: { type: DataTypes.STRING, allowNull: true },
    role: { type: DataTypes.STRING, defaultValue: "employee" },
    salary: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: 0.0,
    },
    profile_photo: { type: DataTypes.STRING, allowNull: true },
    created_on: {
      type: DataTypes.BIGINT.UNSIGNED,
      defaultValue: () => Date.now(),
    },
    updated_on: {
      type: DataTypes.BIGINT.UNSIGNED,
      defaultValue: () => Date.now(),
    },
  },
  { sequelize, tableName: "employees", timestamps: false }
);

EmployeeModel.belongsTo(AdminModel, { foreignKey: "admin_id" });

export default EmployeeModel;
