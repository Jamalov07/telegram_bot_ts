import { Op } from 'sequelize'
import { Composer, Context, Markup } from 'telegraf'
import {
  replyAddressUZB,
  replyBenzilUZB,
  replyCityUZB,
  replyDistrictUZB,
  replyMetanUZB,
  replyRegionUZB,
} from '../libs/adding.station.js'
import { StationniAdmingaYuborish } from '../libs/confirm.js'
import { getLanguage } from '../libs/lang.js'
import { asosiyMenuRUS, asosiyMenuUZB } from '../libs/menu_elon_berish.js'
import { getByLocation, getFuelBYNameUZB, SeeStation } from '../libs/see_stations.js'
import { bot } from '../main.js'
import { City } from '../models/city.model.js'
import { District } from '../models/district.model.js'
import { Region } from '../models/region.model.js'
import { StationFuel } from '../models/station_fuel.mode.js'
import { User } from '../models/user.model.js'
import { Fuel } from '../models/yoqilgi.mode.js'
import { Station } from '../models/zapravka.model.js'

const composer = new Composer()

composer.action(/^o([k]=)\d+/g, async (ctx) => {
  const message = ctx.match[0]
  console.log(message)
  if (message.slice(0, 2) == 'ok') {
    const user = await User.findOne({ where: { id: `${message.slice(3, message.length)}` } })
    if (!user) {
      const lang = await getLanguage(message.slice(3, message.length))
      if (lang === 'UZB') {
        asosiyMenuUZB(ctx)
      } else {
        asosiyMenuRUS(ctx)
      }
    } else {
      await user.update({ is_owner: true })
      await ctx.telegram.sendMessage(
        String(user.dataValues.user_id),
        `${user.dataValues.first_name} sizning so'rov admin tomonidan qabul qilindi.\n Endi siz bemalol o'z zapravkalaringizni qo'shishingiz mumkin`,
      )
    }
  }
})

composer.action(/^n([o]=)\d+/g, async (ctx) => {
  const message = ctx.match[0]
  console.log(message)
  if (message.slice(0, 2) == 'no') {
    const user = await User.findOne({ where: { id: `${message.slice(3, message.length)}` } })
    if (!user) {
      const lang = await getLanguage(message.slice(3, message.length))
      if (lang === 'UZB') {
        asosiyMenuUZB(ctx)
      } else {
        asosiyMenuRUS(ctx)
      }
    } else {
      await ctx.telegram.sendMessage(
        String(user.dataValues.user_id),
        `${user.dataValues.first_name} sizning so'rov admin tomonidan qabul qilinmadi`,
      )
    }
  }
})

composer.action(/^r([g]=)\d+/g, async (ctx) => {
  const user_id = ctx?.from?.id
  const message = ctx.match[0]
  console.log(message)
  if (message.slice(0, 2) == 'rg') {
    const region = await Region.findOne({ where: { id: message.slice(3, message.length) } })
    if (!region) {
      return await replyRegionUZB(ctx)
    } else {
      const station = await Station.findOne({
        where: { user_id: `${user_id}` },
        order: [['createdAt', 'DESC']],
      })
      if (!station) {
        return await asosiyMenuUZB(ctx)
      } else {
        await station.update({ region_id: region.dataValues.id, last_state: 'city_id' })
        await station.save()
        return await replyCityUZB(ctx)
      }
    }
  }
})

composer.action(/^c([t]=)\d+/g, async (ctx) => {
  const user_id = ctx?.from?.id
  const message = ctx.match[0]
  console.log(message)
  if (message.slice(0, 2) == 'ct') {
    const city = await City.findOne({ where: { id: message.slice(3, message.length) } })
    if (!city) {
      return await replyCityUZB(ctx)
    } else {
      const station = await Station.findOne({
        where: { user_id: `${user_id}` },
        order: [['createdAt', 'DESC']],
      })
      if (!station) {
        return await asosiyMenuUZB(ctx)
      } else {
        await station.update({ city_id: city.dataValues.id, last_state: 'district_id' })
        await station.save()
        return await replyDistrictUZB(ctx)
      }
    }
  }
})

composer.action(/^d([s]=)\d+/g, async (ctx) => {
  const user_id = ctx?.from?.id
  const message = ctx.match[0]
  console.log(message)
  if (message.slice(0, 2) == 'ds') {
    const district = await District.findOne({ where: { id: message.slice(3, message.length) } })
    if (!district) {
      return await replyDistrictUZB(ctx)
    } else {
      const station = await Station.findOne({
        where: { user_id: `${user_id}` },
        order: [['createdAt', 'DESC']],
      })
      if (!station) {
        return await asosiyMenuUZB(ctx)
      } else {
        await station.update({ district_id: district.dataValues.id, last_state: 'address' })
        await station.save()
        return await replyAddressUZB(ctx)
      }
    }
  }
})

composer.action(/^s([r]=)\d+/g, async (ctx) => {
  //   const user_id = ctx?.from?.id
  const message = ctx.match[0]
  console.log(message, 'region uchun')
  if (message.slice(0, 2) == 'sr') {
    const cities = await City.findAll({ where: { region_id: `${message.slice(3, message.length)}` } })
    if (cities) {
      const cityNames: any[] = []
      cities.forEach((city) => {
        cityNames.push([Markup.button.callback(city.dataValues.name, `sc=${city.dataValues.id}`)])
      })
      await ctx.reply('Shaharlardan birini tanlang', {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([...cityNames]),
      })
    }
  }
})

composer.action(/^s([c]=)\d+/g, async (ctx) => {
  //   const user_id = ctx?.from?.id
  const message = ctx.match[0]
  console.log(message, 'city uchun')
  if (message.slice(0, 2) == 'sc') {
    const districts = await District.findAll({ where: { city_id: `${message.slice(3, message.length)}` } })
    if (districts) {
      const districtNames: any[] = []
      districts.forEach((district) => {
        districtNames.push([Markup.button.callback(district.dataValues.name, `sd=${district.dataValues.id}`)])
      })
      await ctx.reply('Tumanlardan birini tanlang', {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([...districtNames]),
      })
    }
  }
})

composer.action(/^s([d]=)\d+/g, async (ctx) => {
  const message = ctx.match[0]
  const stations = await Station.findAll({ where: { district_id: `${message.slice(3, message.length)}` } })
  if (stations.length) {
    await SeeStation(ctx, message.slice(3, message.length), 0)
  } else {
    await ctx.reply("Bu tumanda zapravka hali yo'q")
  }
})

composer.action(/^(offse)([t]\d=)\d+/g, async (ctx) => {
  const message = ctx.match[0]
  const text = message.split('=')
  await SeeStation(ctx, text[0].slice(6, text[0].length), +text[1])
})

composer.action(/^O([K]=)\d+/g, async (ctx) => {
  const message = ctx.match[0]
  console.log(message)
  if (message.slice(0, 2) == 'OK') {
    const station = await Station.findOne({ where: { id: `${message.slice(3, message.length)}` } })
    if (station) {
      let stText = ''
      const user = await User.findOne({
        where: { user_id: `${ctx?.from?.id}` },
      })
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
      console.log(str, 'bu string edi')
      stText = `Station name: ${station.dataValues.main_name}\n Station branch_name: ${station.dataValues.branch_name} \n Station region: ${region?.dataValues.name}\n Station city: ${city?.dataValues.name}\n Station district: ${district?.dataValues.name}\n Station address: ${station.dataValues.address}\n Station phone: ${station.dataValues.phone_number}\n`
      stText += `${str}\n`
      stText += `OWNER: ${user?.dataValues.first_name}\n phone: ${user?.dataValues.phone_number}\n telegram_link: @${user?.dataValues.username}`
      stText += `\n\n@jamalov_blog`
      stText += `\n@fuel_uz_bot`
      const post = await ctx.telegram.sendMessage(String(process.env.CHANNEL), stText, {
        parse_mode: 'HTML',
      })
      ctx.editMessageText('Tasdiqlandi')
      await ctx.telegram.sendMessage(
        `${station.dataValues.user_id}`,
        `${stText} https://t.me/jamalov_blog/${post.message_id}`,
        {
          parse_mode: 'HTML',
        },
      )
      // station.post_id = post.message_id menda bunday column yo'q
      await asosiyMenuUZB(ctx)
    }
  } else {
    await asosiyMenuUZB(ctx)
  }
})

composer.action(/^y([s]=)\d+/g, async (ctx) => {
  const user_id = ctx?.from?.id
  const message = ctx.match[0]
  console.log(message)
  if (message.slice(0, 2) == 'ys') {
    const station = await Station.findOne({ where: { user_id: `${user_id}` }, order: [['createdAt', 'DESC']] })
    if (!station) {
      await asosiyMenuUZB(ctx)
    } else if (station && station.dataValues.last_state != 'finish') {
      if (station.dataValues.last_state === 'gas') {
        await ctx.reply('Gaz narxini kiriting')
      } else if (station.dataValues.last_state === 'benzin') {
        await ctx.reply('benzin narxini kiriting')
      } else if (station.dataValues.last_state === 'metan') {
        await ctx.reply('metan narxini kiriting')
      }
    }
  }
})

composer.action(/^f([u]=)\d+/g, async (ctx) => {
  const message = ctx.match[0]
  console.log('keldi')
  const fuel = await Fuel.findOne({ where: { id: message.slice(3, message.length) } })

  const stationFuel = await StationFuel.findAll({
    where: {
      fuel_id: message.slice(3, message.length),
      price: { [Op.ne]: null },
    },
  })
  console.log(stationFuel.length)
  if (!stationFuel.length) {
    await ctx.reply('Bunday zapravkalar topilmadi')
  } else {
    await getFuelBYNameUZB(ctx, message.slice(3, message.length), 0)
  }
})

composer.action(/^(of)([f]\d=)\d+/g, async (ctx) => {
  const message = ctx.match[0]
  const text = message.split('=')
  console.log(message, text)
  await getFuelBYNameUZB(ctx, text[0].slice(3, text[0].length), +text[1])
})

composer.action(/^n([e]=)\d+/g, async (ctx) => {
  const user_id = ctx?.from?.id
  const message = ctx.match[0]
  console.log(message)
  if (message.slice(0, 2) == 'ne') {
    const station = await Station.findOne({ where: { user_id: `${user_id}` }, order: [['createdAt', 'DESC']] })
    if (!station) {
      await asosiyMenuUZB(ctx)
    } else if (station && station.dataValues.last_state != 'finish') {
      if (station.dataValues.last_state === 'gas') {
        const fuel = await Fuel.findOne({ where: { id: `${message.slice(3, message.length)}` } })

        await StationFuel.create({
          station_id: station.dataValues.id,
          fuel_id: fuel?.dataValues.id,
          isBor: false,
        })
        await station.update({ last_state: 'benzin' })
        await replyBenzilUZB(ctx)
      } else if (station.dataValues.last_state === 'benzin') {
        const fuel = await Fuel.findOne({ where: { id: `${message.slice(3, message.length)}` } })

        await StationFuel.create({
          station_id: station.dataValues.id,
          fuel_id: fuel?.dataValues.id,
          isBor: false,
        })
        await station.update({ last_state: 'metan' })
        await replyMetanUZB(ctx)
      } else if (station.dataValues.last_state === 'metan') {
        const fuel = await Fuel.findOne({ where: { id: `${message.slice(3, message.length)}` } })

        await StationFuel.create({
          station_id: station.dataValues.id,
          fuel_id: fuel?.dataValues.id,
          isBor: false,
        })
        await station.update({ last_state: 'finish' })
        await StationniAdmingaYuborish(ctx)
      }
    }
  }
})

composer.action(/^(next=\d+(.))([\=\d]+(.)+)\d+/g, async (ctx) => {
  const message = ctx.match[0]
  console.log(message)
  const [next, lat, lon, offset] = message.split('=')
  await getByLocation(ctx, +lat, +lon, +offset)
})
bot.use(composer.middleware())
