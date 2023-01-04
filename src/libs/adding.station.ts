import { Context, Markup } from 'telegraf'
import { City } from '../models/city.model.js'
import { District } from '../models/district.model.js'
import { Region } from '../models/region.model.js'
import { StationFuel } from '../models/station_fuel.mode.js'
import { User } from '../models/user.model.js'
import { Fuel } from '../models/yoqilgi.mode.js'
import { Station } from '../models/zapravka.model.js'
import { asosiyMenuRUS, asosiyMenuUZB } from './menu_elon_berish.js'

export async function replyMainNameUZB(ctx: Context) {
  return await ctx.reply('Stationning asosiy nomini kiriting')
}

export async function replyBranchNameUZB(ctx: Context) {
  return await ctx.reply('Stationning branch nomini kiriting')
}

export async function replyRegionUZB(ctx: Context) {
  const regions = await Region.findAll()
  const inkeyboard = []
  for (let index = 0; index < regions.length; index++) {
    inkeyboard.push([Markup.button.callback(regions[index].dataValues.name, `rg=${regions[index].dataValues.id}`)])
  }
  console.log(inkeyboard)
  return await ctx.reply('Station qaysi regionda joylashgan?', {
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard([...inkeyboard]),
  })
}

export async function replyCityUZB(ctx: Context) {
  const user_id = ctx?.from?.id
  const station = await Station.findOne({
    where: { user_id: `${user_id}` },
    order: [['createdAt', 'DESC']],
  })
  const region = await Region.findOne({ where: { id: station?.dataValues.region_id } })
  const cities = await City.findAll({ where: { region_id: `${station?.dataValues.region_id}` } })

  const inkeyboard = []
  for (let index = 0; index < cities.length; index++) {
    inkeyboard.push([Markup.button.callback(cities[index].dataValues.name, `ct=${cities[index].dataValues.id}`)])
  }
  console.log(inkeyboard)
  return await ctx.reply(`Station ${region?.dataValues.name} mintaqsining qaysi shaharida joylashgan?`, {
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard([...inkeyboard]),
  })
}

export async function replyDistrictUZB(ctx: Context) {
  const user_id = ctx?.from?.id
  const station = await Station.findOne({
    where: { user_id: `${user_id}` },
    order: [['createdAt', 'DESC']],
  })
  const districts = await District.findAll({ where: { city_id: `${station?.dataValues.city_id}` } })
  const city = await City.findOne({ where: { id: station?.dataValues.city_id } })
  const inkeyboard = []
  for (let index = 0; index < districts.length; index++) {
    inkeyboard.push([Markup.button.callback(districts[index].dataValues.name, `ds=${districts[index].dataValues.id}`)])
  }
  return await ctx.reply(`Station ${city?.dataValues.name} shaharining qaysi tumanida joylashgan?`, {
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard([...inkeyboard]),
  })
}

export async function replyAddressUZB(ctx: Context) {
  return await ctx.reply("Stationning addressini to'liq satr ko'rinishida jo'nating")
}

export async function replyLocationUZB(ctx: Context) {
  await ctx.reply(`Iltimos, <b>Location yuborish</b> tugmasini bosing! 👇`, {
    parse_mode: 'HTML',
    ...Markup.keyboard([[Markup.button.locationRequest('Location yuborish'), '🏠 Bosh sahifa']])
      .oneTime()
      .resize(),
  })
}
export async function replyPhoneUZB(ctx: Context) {
  return await ctx.reply('Stationga ulangan telefon raqam yuboring.(namuna => 949174127')
}

export async function replyGazUZB(ctx: Context) {
  const fuel = await Fuel.findOne({ where: { name: 'gas' } })
  return await ctx.reply('Sizning stationingizda gaz bormi?', {
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard([
      [Markup.button.callback('Bor', `ys=${fuel?.dataValues.id}`)],
      [Markup.button.callback("Yo'q", `ne=${fuel?.dataValues.id}`)],
    ]),
  })
}

export async function replyBenzilUZB(ctx: Context) {
  const fuel = await Fuel.findOne({ where: { name: 'benzin' } })
  return await ctx.reply('Sizning stationingizda benzin bormi?', {
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard([
      [Markup.button.callback('Bor', `ys=${fuel?.dataValues.id}`)],
      [Markup.button.callback("Yo'q", `ne=${fuel?.dataValues.id}`)],
    ]),
  })
}

export async function replyMetanUZB(ctx: Context) {
  const fuel = await Fuel.findOne({ where: { name: 'metan' } })

  return await ctx.reply('Sizning stationingizda metan bormi?', {
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard([
      [Markup.button.callback('Bor', `ys=${fuel?.dataValues.id}`)],
      [Markup.button.callback("Yo'q", `ne=${fuel?.dataValues.id}`)],
    ]),
  })
}

export async function ZapravkaQoshishUZB(ctx: Context) {
  const user_id = ctx?.from?.id
  console.log(1234)
  await User.findOne({ where: { user_id: `${user_id}` } }).then(async (user) => {
    if (!user) {
      await ctx.reply(`Botga "/start" tugmasi orqali qayta kiring`)
    } else {
      if (user.dataValues.phone_number == '' || user.dataValues.phone_number == null) {
        await ctx.reply(`Iltimos, <b>Telefon raqam yuborish</b> tugmasini bosing! 👇`, {
          parse_mode: 'HTML',
          ...Markup.keyboard([[Markup.button.contactRequest('📱 Telefon raqamni yuborish'), '🏠 Bosh sahifa']])
            .oneTime()
            .resize(),
        })
      } else if (user.dataValues.is_owner === false) {
        // await asosiyMenuUZB(ctx)
        await ctx.reply("Zapravka qo'shishingiz uchun admin sizni tasqilashi kerak! 👇", {
          ...Markup.keyboard([["👮‍♂️ Adminga so'rov yuborish"], ['🏠 Bosh sahifa']])
            .oneTime()
            .resize(),
        })
      } else {
        const refueling = await Station.findOne({ where: { user_id: `${user_id}` }, order: [['createdAt', 'DESC']] })
        if (refueling) {
          const state = refueling.dataValues.last_state
          if (state != 'finish' || state === null) {
            await ctx.reply("Siz avvalgi zapravkaning ma'lumotlarini hali to'liq qo'shmagansiz!\n Davom ettiring")
            if (state == 'main_name') {
              await replyMainNameUZB(ctx)
            } else if (state == 'branch_name') {
              await replyBranchNameUZB(ctx)
            } else if (state == 'region_id') {
              await replyRegionUZB(ctx)
            } else if (state == 'city_id') {
              await replyCityUZB(ctx)
            } else if (state == 'district_id') {
              await replyDistrictUZB(ctx)
            } else if (state == 'address') {
              await replyAddressUZB(ctx)
            } else if (state == 'location') {
              await replyLocationUZB(ctx)
            } else if (state == 'phone_number') {
              await replyPhoneUZB(ctx)
            } else if (state === 'gas') {
              await replyGazUZB(ctx)
            } else if (state === 'benzin') {
              await replyBenzilUZB(ctx)
            } else if (state === 'metan') {
              await replyMetanUZB(ctx)
            }
          } else {
            await Station.create({
              user_id: `${user_id}`,
              last_state: 'main_name',
            })
            await ctx.reply("Yangi zapravka qo'shish jarayoni boshlandi!")
            await replyMainNameUZB(ctx)
          }
        } else {
          await Station.create({
            user_id: `${user_id}`,
            last_state: 'main_name',
          })
          await ctx.reply("Yangi zapravka qo'shish jarayoni boshlandi!")
          await replyMainNameUZB(ctx)
        }
      }
    }
  })
}

export async function ZapravkaQoshishRUS(ctx: Context) {
  const user_id = ctx?.from?.id
  await User.findOne({ where: { user_id: `${user_id}` } }).then(async (user) => {
    if (!user) {
      await ctx.reply(`Снова зайти в бота через кнопку "/start"`)
    } else {
      if (user.dataValues.phone_number == '' || user.dataValues.phone_number == null) {
        await ctx.reply(`Пожалуйста, нажмите <b>Отправить номер телефона</b>! 👇`, {
          parse_mode: 'HTML',
          ...Markup.keyboard([[Markup.button.contactRequest('📱 Отправить номер телефона'), '🏠 Домашняя страница']])
            .oneTime()
            .resize(),
        })
      } else {
        await asosiyMenuRUS(ctx)
      }
    }
  })
}

export async function AdmingaYuborishUZB(ctx: Context) {
  let stText = ''
  const station = await Station.findOne({
    where: { user_id: `${ctx?.from?.id}` },
    order: [['createdAt', 'DESC']],
  })
  const user = await User.findOne({
    where: { user_id: `${ctx?.from?.id}` },
  })
  const region = await Region.findOne({ where: { id: station?.dataValues.region_id } })
  const city = await City.findOne({ where: { id: station?.dataValues.city_id } })
  const district = await District.findOne({ where: { id: station?.dataValues.district_id } })
  const stationfuels = await StationFuel.findAll({ where: { station_id: station?.dataValues.id } })
  if (!station) {
    asosiyMenuUZB(ctx)
  } else {
    let str = ''
    for (const stfuel of stationfuels) {
      if (stfuel.dataValues.isBor === true) {
        const fuel = await Fuel.findOne({ where: { id: stfuel?.dataValues.fuel_id } })
        str = str + `${fuel?.dataValues.name}: ${stfuel.dataValues.price} so'm\n`
      }
    }
    stText = `Station name: ${station.dataValues.main_name}\n Station branch_name: ${station.dataValues.branch_name} \n Station region: ${region?.dataValues.name}\n Station city: ${city?.dataValues.name}\n Station district: ${district?.dataValues.name}\n Station address: ${station.dataValues.address}\n Station phone: ${station.dataValues.phone_number}\n`

    stText += `${str}\n`
    stText += `OWNER: ${user?.dataValues.first_name}\n phone: ${user?.dataValues.phone_number}\n telegram_link: @${user?.dataValues.username}`
    await ctx.telegram.sendMessage(String(process.env.ADMIN), stText, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '✅ Tasdiqlansin',
              callback_data: `OK=${station.dataValues.id}`,
              // hide: false,
            },
            {
              text: '❌ Inkor qilinsin',
              callback_data: `NO=${station.dataValues.id}`,
              // hide: false,
            },
          ],
        ],
      },
    })
    await asosiyMenuUZB(ctx)
  }
}
