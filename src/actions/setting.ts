import { Composer } from 'telegraf'
import { saveLanguage, selectLanguage } from '../libs/lang.js'
import { bot } from '../core/bot.js'
import { selectCategoryRefuelingRUS, selectCategoryRefuelingUZB } from '../libs/see_refueling.js'
import { getByFuelRUS, getByFuelUZB, getRegionsRUS, getRegionsUZB } from '../libs/get.region.js'
import { asosiyMenuRUS, asosiyMenuUZB } from '../libs/menu_elon_berish.js'
import { reqToAdmin } from '../libs/req_to_admin.js'
import { saveFuel } from '../libs/fuel.js'
import { Station } from '../models/zapravka.model.js'
import { AdmingaYuborishUZB, ZapravkaQoshishRUS, ZapravkaQoshishUZB } from '../libs/adding.station.js'
import { replyLocationUZB } from '../libs/adding.station.js'
const composer = new Composer()
//================== BOSH SAHIFA ni eshituvchi
composer.hears('🏠 Bosh sahifa', async (ctx) => {
  await asosiyMenuUZB(ctx)
})
composer.hears('🏠 Домашняя страница', async (ctx) => {
  await asosiyMenuRUS(ctx)
})
//========================== Til bo'limi
composer.hears('Tilni tanlash / Выбор языка', async (ctx) => {
  await selectLanguage(ctx)
})
composer.hears("🇺🇿 O'zbek tili", async (ctx) => {
  await saveLanguage(ctx, 'UZB')
})
composer.hears('🇷🇺 Русский язык', async (ctx) => {
  await saveLanguage(ctx, 'RUS')
})
//=========================== Bosh sahifadagi komandalarni eshituvchi
composer.hears("⛽️ Zapravkalarni ko'rish", async (ctx) => {
  await selectCategoryRefuelingUZB(ctx)
})
composer.hears('⛽️ Просмотр заправок', async (ctx) => {
  await selectCategoryRefuelingRUS(ctx)
})

composer.hears("➕ Zapravka qo'shish", async (ctx) => {
  await ZapravkaQoshishUZB(ctx)
})

composer.hears('➕ Добавить Заправку', async (ctx) => {
  await ZapravkaQoshishRUS(ctx)
})

//======================== ZAPRAVKALARNI KO'RISH BO'LIMINING BUYRUQLARINI ESHITUVCHI
composer.hears("Manzil bo'yicha", async (ctx) => {
  await getRegionsUZB(ctx)
})
composer.hears("Siz turgan joyga eng yaqini bo'yicha", async (ctx) => {
  // await toSendLocation(ctx)
})
composer.hears('По адресу', async (ctx) => {
  await getRegionsRUS(ctx)
})
composer.hears("Yoqilg'i turi bo'yicha", async (ctx) => {
  await getByFuelUZB(ctx)
})
composer.hears('По какому впрыску топлива', async (ctx) => {
  await getByFuelRUS(ctx)
})
composer.hears("Yaqinligi bo'yicha", async (ctx) => {
  await replyLocationUZB(ctx)
})
//=========================== YANGI ZAPRAVKA QOSHISH BOLIMININING BUYRUQLARINI ESHITUVCHI
composer.hears("👮‍♂️ Adminga so'rov yuborish", async (ctx) => {
  await reqToAdmin(ctx)
})
///====================== YOQILGI YOQ BUYRUGINI ESHITUVCHI
composer.hears('not', async (ctx) => {
  await saveFuel(ctx)
})
//======================= TAYYORLANGAN ZAPRAVKANI OHIRGI BOSQICHINING BUYRUQLARINI ESHITUVCHI
composer.hears('❌ Bekor qilish', async (ctx) => {
  const user_id = ctx?.from?.id
  const station = await Station.findOne({
    where: { user_id: `${user_id}` },
    order: [['createdAt', 'DESC']],
  })
  if (!station) {
    asosiyMenuUZB(ctx)
  } else {
    await station.destroy()
    await ctx.reply("Station o'chirildi")
    await asosiyMenuUZB(ctx)
  }
})
composer.hears('✅ Adminga yuborish', async (ctx) => {
  await AdmingaYuborishUZB(ctx)
})

bot.use(composer.middleware())
