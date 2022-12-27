import { DataTypes } from 'sequelize'
import { sequelize } from '../core/db.js'

export const Refueling = sequelize.define('refuelings', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  user_id: { type: DataTypes.INTEGER },
  name: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
  location: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  region_id: { type: DataTypes.INTEGER },
  city_id: { type: DataTypes.INTEGER },
  district_id: { type: DataTypes.INTEGER },
  last_state: { type: DataTypes.STRING },
})

