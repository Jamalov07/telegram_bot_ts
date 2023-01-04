import { Op } from 'sequelize'
import { Context, Markup } from 'telegraf'
import { City } from '../models/city.model.js'
import { District } from '../models/district.model.js'
import { Region } from '../models/region.model.js'
import { StationFuel } from '../models/station_fuel.mode.js'
import { User } from '../models/user.model.js'
import { Fuel } from '../models/yoqilgi.mode.js'
import { Station } from '../models/zapravka.model.js'
import { distance } from './distance.js'

export async function SeeStation(ctx: Context, message: string, offset: number) {
  const station = await Station.findAll({
    where: { district_id: `${message}` },
    order: [['id', 'ASC']],
    offset: offset,
    limit: 1,
  })
  if (!station.length) {
    return await ctx.reply("Tanlangan bo`limda boshqa zapravka yo'q")
  } else {
    const user = await User.findOne({ where: { user_id: `${ctx?.from?.id}` } })
    const region = await Region.findOne({ where: { id: station[0]?.dataValues.region_id } })
    const city = await City.findOne({ where: { id: station[0]?.dataValues.city_id } })
    const district = await District.findOne({ where: { id: station[0]?.dataValues.district_id } })
    const stationfuels = await StationFuel.findAll({ where: { station_id: station[0]?.dataValues.id } })
    let str = ''
    for (const stfuel of stationfuels) {
      if (stfuel.dataValues.isBor === true) {
        const fuel = await Fuel.findOne({ where: { id: stfuel?.dataValues.fuel_id } })
        str = str + `${fuel?.dataValues.name}: ${stfuel.dataValues.price} so'm\n`
      }
    }
    let stText = `Station name: ${station[0].dataValues.main_name}\n Station branch_name: ${station[0].dataValues.branch_name} \n Station region: ${region?.dataValues.name}\n Station city: ${city?.dataValues.name}\n Station district: ${district?.dataValues.name}\n Station address: ${station[0].dataValues.address}\n Station phone: ${station[0].dataValues.phone_number}\n`
    stText += ` OWNER: ${user?.dataValues.first_name}\n phone: ${user?.dataValues.phone_number}\n telegram_link: @${user?.dataValues.username}`
    stText += str
    await ctx.reply(stText, {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([Markup.button.callback("Keyingisini ko'rish", `offset${message}=${offset + 1}`)]),
    })
  }
}

export async function getFuelBYNameUZB(ctx: Context, message: string, offset: number) {
  const stationFuel = await StationFuel.findAll({
    where: {
      fuel_id: +message,
      price: {
        [Op.ne]: null,
      },
    },
    order: [['id', 'ASC']],
    offset: offset,
    limit: 1,
  })
  if (stationFuel.length) {
    const station = await Station.findOne({ where: { id: stationFuel[0].dataValues.station_id } })
    console.log(station)

    if (station) {
      const user = await User.findOne({ where: { user_id: `${ctx?.from?.id}` } })
      const region = await Region.findOne({ where: { id: station?.dataValues.region_id } })
      const city = await City.findOne({ where: { id: station?.dataValues.city_id } })
      const district = await District.findOne({ where: { id: station?.dataValues.district_id } })
      const stationfuels = await StationFuel.findAll({ where: { station_id: station?.dataValues.id } })
      let str = ''
      for (const stfuel of stationfuels) {
        if (stfuel.dataValues.isBor === true) {
          const fuel = await Fuel.findOne({ where: { id: stfuel?.dataValues.fuel_id } })
          str = str + `${fuel?.dataValues.name}: ${stfuel.dataValues.price} so'm\n`
        }
      }
      let stText = `Station name: ${station.dataValues.main_name}\n Station branch_name: ${station.dataValues.branch_name} \n Station region: ${region?.dataValues.name}\n Station city: ${city?.dataValues.name}\n Station district: ${district?.dataValues.name}\n Station address: ${station.dataValues.address}\n Station phone: ${station.dataValues.phone_number}\n`
      stText += `${str}\n\n`
      stText += ` OWNER: ${user?.dataValues.first_name}\n phone: ${user?.dataValues.phone_number}\n telegram_link: @${user?.dataValues.username}`
      await ctx.reply(stText, {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([Markup.button.callback("Keyingisini ko'rish", `off${message}=${offset + 1}`)]),
      })
    } else {
      await getFuelBYNameUZB(ctx, message, offset + 1)
    }
  } else {
    await ctx.reply('Boshqa zapravka qolmadi')
  }
}

export async function getByLocation(ctx: Context, lat: number, lon: number, offset: number) {
  const stArr: any[] = []
  const stations = await Station.findAll()
  for (const station of stations) {
    const lat2 = JSON.parse(station.dataValues.location).latitude
    const lon2 = JSON.parse(station.dataValues.location).longitude
    const masofa = await distance(lat, lon, lat2, lon2, 'K')
    const statCopy = station
    statCopy.dataValues.distance = masofa
    stArr.push(statCopy)
  }
  let temp
  for (let i = 0; i < stArr.length - 1; i++) {
    for (let e = i + 1; e < stArr.length; e++) {
      if (stArr[i].dataValues.distance > stArr[e].dataValues.distance) {
        temp = stArr[i]
        stArr[i] = stArr[e]
        stArr[e] = temp
      }
    }
  }
  if (stArr[offset]) {
    const user = await User.findOne({ where: { user_id: `${ctx?.from?.id}` } })
    const region = await Region.findOne({ where: { id: stArr[offset]?.dataValues.region_id } })
    const city = await City.findOne({ where: { id: stArr[offset]?.dataValues.city_id } })
    const district = await District.findOne({ where: { id: stArr[offset]?.dataValues.district_id } })
    const stationfuels = await StationFuel.findAll({ where: { station_id: stArr[offset]?.dataValues.id } })
    let str = ''
    for (const stfuel of stationfuels) {
      if (stfuel.dataValues.isBor === true) {
        const fuel = await Fuel.findOne({ where: { id: stfuel?.dataValues.fuel_id } })
        str = str + `${fuel?.dataValues.name}: ${stfuel.dataValues.price} so'm\n`
      }
    }
    let stText = `Station name: ${stArr[offset].dataValues.main_name}\n Station branch_name: ${stArr[offset].dataValues.branch_name} \n Station region: ${region?.dataValues.name}\n Station city: ${city?.dataValues.name}\n Station district: ${district?.dataValues.name}\n Station address: ${stArr[offset].dataValues.address}\n Station phone: ${stArr[offset].dataValues.phone_number}\n`
    stText += `${str}`
    stText += `Zapravka sizdan ${stArr[offset].dataValues.distance.toFixed(4)} km uzoqlikda joylashgan \n\n`
    stText += ` OWNER: ${user?.dataValues.first_name}\n phone: ${user?.dataValues.phone_number}\n telegram_link: @${user?.dataValues.username}`
    // console.log(stText)
    await ctx.reply(stText, {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([Markup.button.callback("Keyingisini ko'rish", `next=${lat}=${lon}=${offset + 1}`)]),
    })
  } else {
    await ctx.reply('Boshqa zapravka qolmadi')
  }

  // console.log(stArr)
}
