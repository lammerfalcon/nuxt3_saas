import { randomUUID } from 'node:crypto'
import { Bot } from 'grammy'

export const startPaymentStatusCheck = (paymentId: string) => {
  const url = 'https://api.yookassa.ru/v3/payments'
  const shopId = '408678'
  const secretKey = 'test_XHJ_oZMbjJfqUM_lWBEmPKb8JCcPepYUrQ4NMjQQbGM'
  const idempotenceKey = randomUUID()

  const bot = new Bot('7194686957:AAEca_chIh_MKyQEyzjcQn6DRhGwCJtzXpY') // <-- put your bot token between the "" (https://t.me/BotFather)
  bot.start()

  async function checkStatus() {
    try {
      const paymentStatus: any = await $fetch(url + `/${paymentId}`, {
        method: 'get',
        headers: {
          'Authorization': `Basic ${btoa(`${shopId}:${secretKey}`)}`,
          'Idempotence-Key': idempotenceKey,
          'Content-Type': 'application/json'
        }
      })

      if (paymentStatus.status && paymentStatus.status !== 'pending') {
        await bot.api.sendMessage(952881284, `Payment status: ${paymentStatus.status}`, {
          reply_markup: {
            inline_keyboard: [
              [{ text: 'Confirm', callback_data: 'confirm' }],
              [{ text: 'Decline', callback_data: 'decline' }]
            ]
          }
        })
      } else {
        setTimeout(checkStatus, 10000)
      }
    } catch (error: any) {
      console.error(`Failed to check payment status: ${error.message}`)
    }
  }

  checkStatus()
}
