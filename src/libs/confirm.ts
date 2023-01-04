import { Context, Markup } from 'telegraf'
import { asosiyMenuUZB } from './menu_elon_berish.js'
import { City } from '../models/city.model.js'
import { District } from '../models/district.model.js'
import { Region } from '../models/region.model.js'
import { StationFuel } from '../models/station_fuel.mode.js'
import { User } from '../models/user.model.js'
import { Fuel } from '../models/yoqilgi.mode.js'
import { Station } from '../models/zapravka.model.js'

export async function StationniAdmingaYuborish(ctx: Context) {
  let stText = ''
  const station = await Station.findOne({
    where: { user_id: `${ctx?.from?.id}` },
    order: [['createdAt', 'DESC']],
  })
  const user = await User.findOne({ where: { user_id: `${ctx?.from?.id}` } })
  const region = await Region.findOne({ where: { id: station?.dataValues.region_id } })
  const city = await City.findOne({ where: { id: station?.dataValues.city_id } })
  const district = await District.findOne({ where: { id: station?.dataValues.district_id } })
  if (!station) {
    asosiyMenuUZB(ctx)
  } else {
    const stationfuels = await StationFuel.findAll({ where: { station_id: station?.dataValues.id } })
    let str = ''
    for (const stfuel of stationfuels) {
      if (stfuel.dataValues.isBor === true) {
        const fuel = await Fuel.findOne({ where: { id: stfuel?.dataValues.fuel_id } })
        str = str + `${fuel?.dataValues.name}: ${stfuel.dataValues.price} so'm\n`
      }
    }
    stText = `Station name: ${station.dataValues.main_name}\n Station branch_name: ${station.dataValues.branch_name} \n Station region: ${region?.dataValues.name}\n Station city: ${city?.dataValues.name}\n Station district: ${district?.dataValues.name}\n Station address: ${station.dataValues.address}\n Station phone: ${station.dataValues.phone_number}\n`
    if (str != '') {
      console.log('hello')
      stText += `Mavjud yoqilg'ilar: \n ${str}\n`
    }
    stText += `OWNER: ${user?.dataValues.first_name}\n phone: ${user?.dataValues.phone_number}\n telegram_link: @${user?.dataValues.username}`
    await ctx.reply(`${stText}\n\n<b>Ma'qul kelgan bo'lsa "✅ Adminga yuborish" tugmasini bosing</b>`, {
      parse_mode: 'HTML',
      ...Markup.keyboard([['✅ Adminga yuborish', '❌ Bekor qilish'], ['🏠 Bosh sahifa']])
        .oneTime()
        .resize(),
    })
  }
}
