import { Context, Markup } from 'telegraf'

export async function asosiyMenuUZB(ctx: Context) {
  return await ctx.reply(`<b>Bosh sahifa!</b>`, {
    parse_mode: 'HTML',
    ...Markup.keyboard([
      ["⛽️ Zapravkalarni ko'rish"],
      ['👀 Mening zapravkalarim', "➕ Zapravka qo'shish"],
      ['Tilni tanlash / Выбор языка'],
    ])
      .oneTime()
      .resize(),
  })
}

export async function asosiyMenuRUS(ctx: Context) {
  return await ctx.reply(`<b>Главная страница!</b>`, {
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
