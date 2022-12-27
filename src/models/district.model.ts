import { DataTypes } from 'sequelize'
import { sequelize } from '../core/db.js'

export const District = sequelize.define('district', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  name: { type: DataTypes.STRING },
  city_id: { type: DataTypes.STRING },
})
