import { Context } from 'telegraf'
import { asosiyMenuUZB } from './menu_elon_berish.js'
import { StationFuel } from '../models/station_fuel.mode.js'
import { Fuel } from '../models/yoqilgi.mode.js'
import { Station } from '../models/zapravka.model.js'
import { replyBenzilUZB, replyMetanUZB } from './adding.station.js'
import { StationniAdmingaYuborish } from './confirm.js'

export async function saveFuel(ctx: Context) {
  const user_id = ctx?.from?.id
  const station = await Station.findOne({
    where: { user_id: `${user_id}` },
    order: [['createdAt', 'DESC']],
  })
  if (!station) {
    return await asosiyMenuUZB(ctx)
  } else if (station && station.dataValues.last_state != 'finish') {
    if (station.dataValues.last_state === 'gas') {
      const fuel = await Fuel.findOne({ where: { name: 'gas' } })
      await StationFuel.create({
        station_id: station.dataValues.id,
        fuel_id: fuel?.dataValues.id,
        isBor: false,
      })
      station.update({ last_state: 'benzin' })
      await replyBenzilUZB(ctx)
    } else if (station.dataValues.last_state === 'benzin') {
      const fuel = await Fuel.findOne({ where: { name: 'benzin' } })
      await StationFuel.create({
        station_id: station.dataValues.id,
        fuel_id: fuel?.dataValues.id,
        isBor: false,
      })
      station.update({ last_state: 'metan' })
      await replyMetanUZB(ctx)
    } else if (station.dataValues.last_state === 'metan') {
      const fuel = await Fuel.findOne({ where: { name: 'metan' } })
      await StationFuel.create({
        station_id: station.dataValues.id,
        fuel_id: fuel?.dataValues.id,
        isBor: false,
      })
      station.update({ last_state: 'finish' })
      ctx.reply('yetdik')
      /// tasdiqlash uchun korsatish
      await ctx.reply("Ma'lumotlarni to'ldirish qismi yakunlandi!")
      await StationniAdmingaYuborish(ctx)
    }
  }
}
