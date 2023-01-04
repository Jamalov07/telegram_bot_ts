import { DataTypes } from 'sequelize'
import { sequelize } from '../core/db.js'

export const City = sequelize.define(
  'city',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    name: { type: DataTypes.STRING },
    region_id: { type: DataTypes.STRING },
  },
  {
    timestamps: false,
  },
)
