import { Composer, Markup } from 'telegraf'
import { bot } from '../main.js'
import { User } from '../models/user.model.js'
import { Refueling } from '../models/zapravka.model.js'
import { asosiyMenuRUS, asosiyMenuUZB } from './menu_elon_berish.js'

const composer = new Composer()

composer.hears("➕ Zapravka qo'shish", async (ctx) => {
  const user_id = ctx.from.id
  // await Refueling.findOne({ where: { user_id: `${user_id}` }, order: [['createdAt', 'DESC']] }).then(
  //   async (refueling) => {},
  // )
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
        return ctx.reply("Zapravka qo'shishingiz uchun admin sizni tasqilashi kerak! 👇", {
          ...Markup.keyboard([["👮‍♂️ Adminga so'rov yuborish"], ['🏠 Bosh sahifa']])
            .oneTime()
            .resize(),
        })
      } else {
      
      }
    }
  })
})

composer.hears('➕ Добавить Заправку', async (ctx) => {
  const user_id = ctx.from.id
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
})

bot.use(composer.middleware())
