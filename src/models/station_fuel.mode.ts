import { DataTypes } from 'sequelize'
import { sequelize } from '../core/db.js'

export const StationFuel = sequelize.define('stationfuels', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  station_id: { type: DataTypes.INTEGER },
  fuel_id: { type: DataTypes.INTEGER },
  price: { type: DataTypes.INTEGER },
  marka: { type: DataTypes.STRING },
  isBor: { type: DataTypes.BOOLEAN, defaultValue: false },
})
