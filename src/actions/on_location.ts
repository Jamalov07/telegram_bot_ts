import { bot } from '../core/bot.js'
import { Composer } from 'telegraf'

import { Op } from 'sequelize'
import { distance } from '../libs/distance.js'
import { FuelStation } from '../models/fuel_station.model.js'
const composer = new Composer()

composer.on('location', async (ctx) => {
  const location = ctx.message.location
  const user_lat = location.latitude
  const user_lon = location.longitude
  console.log(user_lat, user_lon)

  const fuel_stations = await FuelStation.findAll({
    where: { location: { [Op.not]: '' } },
  })

  if (fuel_stations) {
    fuel_stations.forEach(async (fuel_station) => {
      try {
        const [fs_lat, fs_lon] = fuel_station.dataValues.location.split(',')
        console.log(fs_lat, fs_lon)

        console.log(distance(user_lat, user_lon, Number(fs_lat), Number(fs_lon), 'K'))
        console.log(distance(user_lat, user_lon, Number(fs_lat), Number(fs_lon), 'N'))
      } catch (error) {
        console.log(error)
        console.log('xatolik')
      }
    })
  }
})

bot.use(composer.middleware())
