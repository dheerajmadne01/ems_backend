import { DataTypes, Model } from "sequelize";
import { sequelize } from "../plugins/sequelize";

class LeaveModel extends Model {
  id!: string;
  employee_id!: string;
  leave_type!: string;
  start_date!: Date;
  end_date!: Date;
  days!: number;
  status!: string;
  applied_at!: number;
  decided_by?: string;
  decided_at?: number;
  reason?: string;
}

LeaveModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    employee_id: { type: DataTypes.UUID, allowNull: false },
    leave_type: { type: DataTypes.STRING, allowNull: false },
    start_date: { type: DataTypes.DATEONLY, allowNull: false },
    end_date: { type: DataTypes.DATEONLY, allowNull: false },
    days: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: "pending" },
    applied_at: {
      type: DataTypes.BIGINT.UNSIGNED,
      defaultValue: () => Date.now(),
    },
    decided_by: { type: DataTypes.UUID, allowNull: true },
    decided_at: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    reason: { type: DataTypes.TEXT, allowNull: true },
  },
  { sequelize, tableName: "leaves", timestamps: false }
);

export default LeaveModel;
