import { sequelize } from '../core/db.js'
import { DataTypes } from 'sequelize'
export const FuelStation = sequelize.define(
  'fuel_station',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    name: { type: DataTypes.STRING },
    location: { type: DataTypes.STRING },
  },
  {
    timestamps: false,
  },
)
