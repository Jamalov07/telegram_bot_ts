import { Context, Markup } from 'telegraf'
// import { Feul } from '../models/yoqilgi.mode.js'
// import { Region } from '../models/region.model.js'

export async function getRegionsUZB(ctx: Context) {
  //   const regions = await Region.findAll()
  return ctx.reply('Hududlardan birini tanlang 👇', {
    ...Markup.keyboard([
      ['Toshkent', 'Sirdaryo', 'Samarqand'],
      ['Andijon', "Farg'ona", 'Namangan'],
      ['Qashqadaryo', 'Surhandaryo', 'Navoiy'],
      ['Buxoro', 'Jizzax', 'Xorazm'],
      ["Qoraqalpog'iston"],
    ])
      .oneTime()
      .resize(),
  })
}

export async function getRegionsRUS(ctx: Context) {
  //   const regions = await Region.findAll()
  return ctx.reply('Выберите одну из областей 👇', {
    ...Markup.keyboard([
      ['Toshkent', 'Sirdaryo', 'Samarqand'],
      ['Andijon', "Farg'ona", 'Namangan'],
      ['Qashqadaryo', 'Surhandaryo', 'Navoiy'],
      ['Buxoro', 'Jizzax', 'Xorazm'],
      ["Qoraqalpog'iston"],
    ])
      .oneTime()
      .resize(),
  })
}

export async function getByFuelUZB(ctx: Context) {
  // const fuels = await Feul.findAll();
  return ctx.reply("Yoqilg'i turini tanlang 👇", {
    ...Markup.keyboard([['Gaz', 'Benzin', 'Metan']])
      .oneTime()
      .resize(),
  })
}

export async function getByFuelRUS(ctx: Context) {
  // const fuels = await Feul.findAll();
  return ctx.reply('Выберите тип топлива 👇', {
    ...Markup.keyboard([['Gaz', 'Benzin', 'Metan']])
      .oneTime()
      .resize(),
  })
}
