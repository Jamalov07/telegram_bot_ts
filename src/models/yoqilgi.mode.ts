import { DataTypes } from 'sequelize'
import { sequelize } from '../core/db.js'

export const Feul = sequelize.define('fuels', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  refueling_id: { type: DataTypes.INTEGER },
  name: { type: DataTypes.STRING },
  price: { type: DataTypes.INTEGER },
  last_state: { type: DataTypes.STRING },
})
