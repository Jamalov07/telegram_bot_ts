import { Composer } from 'telegraf'
import {
  replyBenzilUZB,
  replyBranchNameUZB,
  replyGazUZB,
  replyLocationUZB,
  replyMetanUZB,
  replyPhoneUZB,
  replyRegionUZB,
} from '../libs/adding.station.js'
import { StationniAdmingaYuborish } from '../libs/confirm.js'
import { bot } from '../main.js'
import { StationFuel } from '../models/station_fuel.mode.js'
import { User } from '../models/user.model.js'
import { Fuel } from '../models/yoqilgi.mode.js'
import { Station } from '../models/zapravka.model.js'

const composer = new Composer()

composer.on('message', async (ctx) => {
  console.log(ctx.message)
  console.log('keldi')

  const user = await User.findOne({ where: { user_id: `${ctx?.from?.id}` } })
  if (!user) {
    await ctx.reply(`👉 "/start" `)
  }
  let st_state
  const station = await Station.findOne({
    where: { user_id: `${ctx?.from?.id}` },
    order: [['createdAt', 'DESC']],
  })
  if (station) {
    st_state = station.dataValues.last_state

    if (st_state === 'main_name') {
      if ('text' in ctx.message) {
        await station.update({ main_name: ctx.message.text, last_state: 'branch_name' })
        await station.save()
        console.log(station.dataValues)
      }
      return await replyBranchNameUZB(ctx)
    }
    if (st_state === 'branch_name') {
      if ('text' in ctx.message) {
        await station.update({ branch_name: ctx.message.text, last_state: 'region_id' })
        await station.save()
        console.log(station.dataValues)
      }
      await replyRegionUZB(ctx)
    }
    if (st_state === 'address') {
      if ('text' in ctx.message) {
        await station.update({ address: ctx.message.text, last_state: 'location' })
        await station.save()
        console.log(station.dataValues)
      }
      await replyLocationUZB(ctx)
    }
    if (st_state === 'phone_number') {
      if ('text' in ctx.message) {
        if (isNaN(Number(ctx.message.text)) || parseInt(ctx.message.text) == 0) {
          await ctx.reply('Namunadangidek raqam  kiriting')
          await replyPhoneUZB(ctx)
        } else {
          if (ctx.message.text.length === 9 && station.dataValues.last_state === 'phone_number') {
            await station.update({ phone_number: ctx.message.text, last_state: 'gas' })
            await station.save()
            await replyGazUZB(ctx)
          } else {
            await ctx.reply('Namunadangidek raqam  kiriting')
            await replyPhoneUZB(ctx)
          }
        }
      }
    }
    if (st_state === 'gas') {
      if ('text' in ctx.message) {
        if (isNaN(Number(ctx.message.text)) || parseInt(ctx.message.text) == 0) {
          await ctx.reply('Notogri javob.Qaytadan kiriting')
          return await replyGazUZB(ctx)
        } else {
          if (ctx.message.text.length && station.dataValues.last_state === 'gas') {
            const fuel = await Fuel.findOne({ where: { name: 'gas' } })
            await StationFuel.create({
              station_id: station.dataValues.id,
              fuel_id: fuel?.dataValues.id,
              price: +ctx.message.text,
              isBor: true,
            })
            await station.update({ last_state: 'benzin' })
            await replyBenzilUZB(ctx)
          }
        }
      }
    }
    if (st_state === 'benzin') {
      console.log('bu yerga keldi')
      if ('text' in ctx.message) {
        if (isNaN(Number(ctx.message.text)) || parseInt(ctx.message.text) == 0) {
          await ctx.reply('Notogri javob.Qaytadan kiriting')
          await replyBenzilUZB(ctx)
        } else {
          if (ctx.message.text.length && station.dataValues.last_state === 'benzin') {
            const fuel = await Fuel.findOne({ where: { name: 'benzin' } })
            await StationFuel.create({
              station_id: station.dataValues.id,
              fuel_id: fuel?.dataValues.id,
              price: +ctx.message.text,
              isBor: true,
            })
            await station.update({ last_state: 'metan' })
            await replyMetanUZB(ctx)
          }
        }
      }
    }
    if (st_state === 'metan') {
      if ('text' in ctx.message) {
        if (isNaN(Number(ctx.message.text)) || parseInt(ctx.message.text) == 0) {
          await ctx.reply('Notogri javob.Qaytadan kiriting')
          await replyMetanUZB(ctx)
        } else {
          if (ctx.message.text.length && station.dataValues.last_state === 'metan') {
            const fuel = await Fuel.findOne({ where: { name: 'metan' } })
            await StationFuel.create({
              station_id: station.dataValues.id,
              fuel_id: fuel?.dataValues.id,
              price: +ctx.message.text,
              isBor: true,
            })
            await station.update({ last_state: 'finish' })
            await ctx.reply("Ma'lumotlarni to'ldirish qismi yakunlandi!")
            await StationniAdmingaYuborish(ctx)
          }
        }
      }
    }
  }
})

bot.use(composer.middleware())
