import { Composer, Markup } from 'telegraf'
import { replyPhoneUZB } from '../libs/adding.station.js'
import { getLanguage } from '../libs/lang.js'
import { bot } from '../main.js'
import { User } from '../models/user.model.js'
import { Station } from '../models/zapravka.model.js'
import { asosiyMenuRUS, asosiyMenuUZB } from '../libs/menu_elon_berish.js'
import { distance } from '../libs/distance.js'
import { getByLocation } from '../libs/see_stations.js'

const composer = new Composer()

composer.on('contact', async (ctx) => {
  const contact = ctx.message.contact.phone_number
  const lang = await getLanguage(String(ctx.from.id))
  if (lang === 'UZB') {
    if (ctx.message.contact.user_id !== ctx.from.id) {
      await ctx.reply("O'zingizni telefon raqamingizni kiriting", { parse_mode: 'HTML' })
      await ctx.reply(`Iltimos, <b>"Telefon raqamni yuborish"</b> tugmasini bosing! `, {
        parse_mode: 'HTML',
        ...Markup.keyboard([[Markup.button.contactRequest('📱 Telefon raqamni yuborish'), '🏠 Bosh sahifa']])
          .oneTime()
          .resize(),
      })
    } else {
      const user_id = ctx.from.id
      const user = await User.findOne({ where: { user_id: `${user_id}` } })
      if (!user) await ctx.reply(`👉 /start`)
      else {
        await user.update({ phone_number: contact })
        asosiyMenuUZB(ctx)
      }
    }
  } else {
    if (ctx.message.contact.user_id !== ctx.from.id) {
      await ctx.reply('Введите свой номер телефона', { parse_mode: 'HTML' })
      await ctx.reply(`Нажмите кнопку <b>Отправить номер телефона</b> 👇`, {
        parse_mode: 'HTML',
        ...Markup.keyboard([[Markup.button.contactRequest('📱 Отправить номер телефона'), '🏠 Главная страница']])
          .oneTime()
          .resize(),
      })
    } else {
      const user_id = ctx.from.id
      const user = await User.findOne({ where: { user_id: `${user_id}` } })
      if (!user) await ctx.reply(`👉 /start`)
      else {
        await user.update({ phone_number: contact })
        asosiyMenuRUS(ctx)
      }
    }
  }
})

composer.on('location', async (ctx) => {
  // console.log(ctx.message)
  const user_id = ctx?.from?.id
  const station = await Station.findOne({
    where: { user_id: `${user_id}` },
    order: [['createdAt', 'DESC']],
  })
  if (station && station.dataValues.last_state != 'finish') {
    await station.update({ location: JSON.stringify(ctx.message.location), last_state: 'phone_number' })
    await station.save()
    return await replyPhoneUZB(ctx)
  } else {
    console.log(ctx.message.location)
    console.log('bu yerda')
    const { latitude, longitude } = ctx.message.location

    // const stArr: any[] = []
    // const stations = await Station.findAll()
    // for (const station of stations) {
    //   const lat2 = JSON.parse(station.dataValues.location).latitude
    //   const lon2 = JSON.parse(station.dataValues.location).longitude
    //   const masofa = await distance(latitude, longitude, lat2, lon2, 'K')
    //   const statCopy = station
    //   statCopy.dataValues.distance = masofa
    //   stArr.push(statCopy)
    // }
    await getByLocation(ctx, latitude, longitude, 0)
  }
})

bot.use(composer.middleware())
