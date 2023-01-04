import { DataTypes } from 'sequelize'
import { sequelize } from '../core/db.js'

export const Station = sequelize.define('stations', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  user_id: { type: DataTypes.INTEGER },
  main_name: { type: DataTypes.STRING },
  branch_name: { type: DataTypes.STRING },
  region_id: { type: DataTypes.INTEGER },
  city_id: { type: DataTypes.INTEGER },
  district_id: { type: DataTypes.INTEGER },
  address: { type: DataTypes.STRING },
  location: { type: DataTypes.STRING },
  phone_number: { type: DataTypes.STRING },
  last_state: { type: DataTypes.STRING },
})
