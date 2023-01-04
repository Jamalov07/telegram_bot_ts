import { Context, Markup } from 'telegraf'

export async function selectCategoryRefuelingUZB(ctx: Context) {
  return ctx.reply('Izlash uchun toifani tanlang 👇', {
    ...Markup.keyboard([
      ["Manzil bo'yicha", "Yoqilg'i turi bo'yicha"],
      ["Yaqinligi bo'yicha", 'Barchasini'],
    ])
      .oneTime()
      .resize(),
  })
}

export async function selectCategoryRefuelingRUS(ctx: Context) {
  return ctx.reply('Выберите категорию для поиска 👇', {
    ...Markup.keyboard([['По адресу', 'По какому впрыску топлива']])
      .oneTime()
      .resize(),
  })
}
