import { Composer, Markup } from 'telegraf'
import { bot } from '../core/bot.js'
import { selectLanguage } from '../libs/lang.js'
import { User } from '../models/user.model.js'

const composer = new Composer()

composer.start(async (ctx) => {
  console.log(ctx.from.id)
  const new_user_id = ctx.from.id
  const username = ctx.from.username ? ctx.from.username : ''
  const first_name = ctx.from.first_name ? ctx.from.first_name : ''
  const last_name = ctx.from.last_name ? ctx.from.last_name : ''
  const user = await User.findOne({ where: { user_id: `${new_user_id}` } })
  if (!user) {
    console.log('yangi user')
    await User.create({
      user_id: new_user_id,
      username,
      first_name,
      last_name,
    })
    await selectLanguage(ctx)
  } else if (user.dataValues.user_lang == '' || user.dataValues.user_lang == null) {
    await selectLanguage(ctx)
  } else {
    const lang = user.dataValues.user_lang

    if (lang === 'UZB') {
      await ctx.reply(`<b>Bosh sahifa!</b>`, {
        parse_mode: 'HTML',
        ...Markup.keyboard([
          ["⛽️ Zapravkalarni ko'rish"],
          ['👀 Mening zapravkalarim', "➕ Zapravka qo'shish"],
          ['Tilni tanlash / Выбор языка'],
        ])
          .oneTime()
          .resize(),
      })
    } else {
      await ctx.reply(`<b>Главная страница!</b>`, {
        parse_mode: 'HTML',
        ...Markup.keyboard([
          ['⛽️ Просмотр заправок'],
          ['👀 Мои заправки', '➕ Добавить Заправку'],
          ['Tilni tanlash / Выбор языка'],
        ])
          .oneTime()
          .resize(),
      })
    }
  }
})

bot.use(composer.middleware())
