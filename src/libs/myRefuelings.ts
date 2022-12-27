import { Context } from 'telegraf'
import { Refueling } from '../models/zapravka.model.js'

export async function getMyRefuelings(ctx: Context, lang: string, offset: number) {
  const user_id = ctx?.from?.id
  const refuelings = await Refueling.findAll({
    where: { user_id: `${user_id}` },
    order: [['id', 'ASC']],
    offset: offset,
    limit: 1,
  })
  if (!refuelings || refuelings.length == 0) {
    if (lang == 'UZB') await ctx.reply("Sizda boshqa zapravka yo'q")
    else await ctx.reply('У вас нет другой заправки')
  } else {
    refuelings.forEach(async (element) => {
      try {
        let txt = ''
        if (lang === 'UZB') txt = `Keyingi zapravkani ko'rish ➡️`
        else txt = `Смотрите следующую Заправку ➡️`
        // await ctx.telegram.copyMessage(String(ctx?.from?.id), String(process.env.CHANNEL), Number(element.post_id))
      } catch (error) {}
    })
  }
}
