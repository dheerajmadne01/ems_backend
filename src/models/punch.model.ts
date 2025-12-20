import { DataTypes, Model } from "sequelize";
import { sequelize } from "../plugins/sequelize";

class PunchModel extends Model {
  id!: string;
  employee_id!: string;
  admin_id?: string;
  type!: string;
  lat?: number;
  lng?: number;
  punch_in_time?: Date;
  punch_out_time?: Date;
  geofence_passed!: boolean;
  created_at!: Date;
  updated_at!: Date;
  distance_from_office?: number;
}

PunchModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    employee_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    admin_id: { 
      type: DataTypes.UUID,
       allowNull: true 
      },
    type: { 
      type: DataTypes.STRING,
       allowNull: false 
      },
    lat: { 
      type: DataTypes.DOUBLE,
       allowNull: true 
      },
    lng: { 
      type: DataTypes.DOUBLE,
       allowNull: true 
      },
    punch_in_time: {
       type: DataTypes.DATE,
        allowNull: true 
      },
    punch_out_time: { 
      type: DataTypes.DATE, 
      allowNull: true 
    },
    break_start_time: { 
      type: DataTypes.DATE, 
      allowNull: true 
    },
    break_end_time: { 
      type: DataTypes.DATE, 
      allowNull: true 
    },
    geofence_passed: {
       type: DataTypes.BOOLEAN, 
       defaultValue: false 
      },
    created_at: { 
      type: DataTypes.DATE,
       defaultValue: DataTypes.NOW 
      },
    updated_at: { 
      type: DataTypes.DATE,
       defaultValue: DataTypes.NOW
       },
    distance_from_office: {
       type: DataTypes.DOUBLE, 
       allowNull: true 
      },
  },
  { sequelize, tableName: "punches", timestamps: false }
);

export default PunchModel;
