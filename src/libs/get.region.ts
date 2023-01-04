import { Context, Markup } from 'telegraf'
import { Region } from '../models/region.model.js'
import { Fuel } from '../models/yoqilgi.mode.js'

export async function getRegionsUZB(ctx: Context) {
  const regions = await Region.findAll()
  const regionNames: any[] = []
  regions.forEach((region) => {
    regionNames.push([Markup.button.callback(region.dataValues.name, `sr=${region.dataValues.id}`)])
    // console.log(region.dataValues.name, `sr=${region.dataValues.id}`)
  })
  // console.log(regionNames)
  return await ctx.reply('Regionni tanlang', {
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard([...regionNames]),
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
  const fuels = await Fuel.findAll()
  const fuelNames: any[] = []
  fuels.forEach(async (fuel) => {
    fuelNames.push([Markup.button.callback(fuel.dataValues.name, `fu=${fuel.dataValues.id}`)])
  })
  return ctx.reply("Yoqilg'i turini tanlang 👇", {
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard([...fuelNames]),
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
