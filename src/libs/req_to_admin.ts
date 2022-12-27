import { Context } from 'telegraf'
import { User } from '../models/user.model.js'

export async function reqToAdmin(ctx: Context) {
  await User.findOne({ where: { user_id: `${ctx?.from?.id}` } }).then(async (user) => {
    let userText = ''
    if (!user) {
      await ctx.reply('Qaytadan start tugmasini bosing 👉 /start')
    } else if (user) {
      userText = `Id: ${user.dataValues.user_id}`
      if (user.dataValues.first_name) {
        userText += `<b>Ismi</b>:${user.dataValues.first_name}`
      } else if (user.dataValues.last_name) {
        userText += `<b>Familiyasi</b>:${user.dataValues.last_name}`
      } else if (user.dataValues.phone_number) {
        userText += `<b>Telefon raqami</b>:${user.dataValues.phone_number}`
      } else if (user.dataValues.username) {
        userText += `<b>Telegram manzili</b>:${user.dataValues.username}`
      } else if (user.dataValues.user_lang) {
        userText += `<b>Tili</b>:${user.dataValues.user_lang}`
      }
    }
    await ctx.telegram.sendMessage(String(process.env.ADMIN), {
      caption: userText,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [[{ text: '✅ Tasdiqlash', callback_data: `ok=${user.id}` }]],
      },
    })
  })
}
