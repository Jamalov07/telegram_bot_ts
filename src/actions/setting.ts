import { Composer } from 'telegraf'
import { saveLanguage, selectLanguage } from '../libs/lang.js'
import { bot } from '../core/bot.js'
import { selectCategoryRefuelingRUS, selectCategoryRefuelingUZB } from '../libs/see_refueling.js'
import { getByFuelRUS, getByFuelUZB, getRegionsRUS, getRegionsUZB } from '../libs/get.region.js'
import { asosiyMenuRUS, asosiyMenuUZB } from './menu_elon_berish.js'

const composer = new Composer()
//===================
composer.hears('🏠 Bosh sahifa', async (ctx) => {
  await asosiyMenuUZB(ctx)
})
composer.hears('🏠 Домашняя страница', async (ctx) => {
  await asosiyMenuRUS(ctx)
})
//==========================
composer.hears('Tilni tanlash / Выбор языка', async (ctx) => {
  await selectLanguage(ctx)
})
composer.hears("🇺🇿 O'zbek tili", async (ctx) => {
  await saveLanguage(ctx, 'UZB')
})
composer.hears('🇷🇺 Русский язык', async (ctx) => {
  await saveLanguage(ctx, 'RUS')
})
//===========================
//===========================
composer.hears("⛽️ Zapravkalarni ko'rish", async (ctx) => {
  await selectCategoryRefuelingUZB(ctx)
})
composer.hears('⛽️ Просмотр заправок', async (ctx) => {
  await selectCategoryRefuelingRUS(ctx)
})
composer.hears("Manzil bo'yicha", async (ctx) => {
  await getRegionsUZB(ctx)
})
composer.hears('По адресу', async (ctx) => {
  await getRegionsRUS(ctx)
})
composer.hears("Qaysi yoqilg'i quyishi bo'yicha", async (ctx) => {
  await getByFuelUZB(ctx)
})
composer.hears('По какому впрыску топлива', async (ctx) => {
  await getByFuelRUS(ctx)
})
//===========================
composer.hears("👮‍♂️ Adminga so'rov yuborish", async (ctx) => {
  
})

bot.use(composer.middleware())
