import { DataTypes } from 'sequelize'
import { sequelize } from '../core/db.js'

export const Region = sequelize.define(
  'region',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    name: { type: DataTypes.STRING },
  },
  {
    timestamps: false,
  },
)
