import { Context, Markup } from 'telegraf'
import { User } from '../models/user.model.js'

export async function selectLanguage(ctx: Context) {
  return await ctx.reply(`<b>Tilni tanlang / Выберите язык:</b>`, {
    parse_mode: 'HTML',
    ...Markup.keyboard([["🇺🇿 O'zbek tili", '🇷🇺 Русский язык']])
      .oneTime()
      .resize(),
  })
}

export async function saveLanguage(ctx: Context, lang: string) {
  const user_id = ctx?.from?.id
  await User.findOne({ where: { user_id: `${user_id}` } }).then(async (user) => {
    if (!user) {
      await selectLanguage(ctx)
    } else {
      await user.update({ user_lang: lang })
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
      } else if (lang === 'RUS') {
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
}

export async function getLanguage(user_id: string) {
  let lang = 'UZB'
  await User.findOne({ where: { user_id: `${user_id}` } }).then((user) => {
    if (user) {
      lang = user?.dataValues.user_lang
    }
  })
  return lang
}
