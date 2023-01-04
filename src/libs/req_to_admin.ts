import { Context, Markup } from 'telegraf'
import { User } from '../models/user.model.js'

export async function reqToAdmin(ctx: Context) {
  await User.findOne({ where: { user_id: `${ctx?.from?.id}` } }).then(async (user) => {
    let userText = ''
    if (!user) {
      await ctx.reply('Qaytadan start tugmasini bosing 👉 /start')
    } else if (user) {
      userText += `user_id: ${user.dataValues.user_id}\n`
      if (user.dataValues.first_name) {
        userText += `<b>Ismi</b>: ${user.dataValues.first_name}\n`
      }
      if (user.dataValues.last_name) {
        userText += `<b>Familiyasi</b>: ${user.dataValues.last_name}\n`
      }
      if (user.dataValues.phone_number) {
        userText += `<b>Telefon raqami</b>: ${user.dataValues.phone_number}\n`
      }
      if (user.dataValues.username) {
        userText += `<b>Telegram manzili</b>: @${user.dataValues.username}\n`
      }
      if (user.dataValues.user_lang) {
        userText += `<b>Tili</b>: ${user.dataValues.user_lang}\n`
      }
    }
    await ctx.telegram.sendMessage(String(process.env.ADMIN), userText, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✅ Ruhsat berish', callback_data: `ok=${user?.dataValues.id}` },
            { text: '❌ Inkor qilish', callback_data: `no=${user?.dataValues.id}` },
          ],
        ],
      },
    })
  })
  await ctx.reply(
    "So'rov adminga yuborildi.\n Admin sizni tasdiqlasagina yangi zapravka qo'shishingiz mumkin bo'ladi",
    {
      parse_mode: 'HTML',
      ...Markup.keyboard([
        ["⛽️ Zapravkalarni ko'rish"],
        ['👀 Mening zapravkalarim', "➕ Zapravka qo'shish"],
        ['Tilni tanlash / Выбор языка'],
      ])
        .oneTime()
        .resize(),
    },
  )
}
