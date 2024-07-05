import { randomUUID } from 'node:crypto'
import { defineEventHandler } from 'h3'
import { orders, payments } from '~/server/database/schema'
import { startPaymentStatusCheck } from '~/server/utils/checkPaymentStatus'

export default defineEventHandler(async (event) => {
  const db = useDrizzle()
  const newOrder = await db.insert(orders).values({
    user_id: 1,
    amount: 1000,
    createdAt: new Date()
  }).returning()

  async function createPayment() {
    const shopId = '408678'
    const secretKey = 'test_XHJ_oZMbjJfqUM_lWBEmPKb8JCcPepYUrQ4NMjQQbGM'
    const idempotenceKey = randomUUID()

    const url = 'https://api.yookassa.ru/v3/payments'

    const paymentData = {
      amount: {
        value: '100.00',
        currency: 'RUB'
      },
      confirmation: {
        type: 'redirect',
        return_url: 'http://localhost:3000/'
      },
      capture: true
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${shopId}:${secretKey}`)}`,
        'Idempotence-Key': idempotenceKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`)
    }

    const payment = await response.json()
    await db.insert(payments).values({
      order_id: 2323,
      payment_id: payment.id,
      status: payment.status,
      createdAt: new Date()
    }).returning()

    return payment
  }

  const paymentResponse = await createPayment()

  // Запуск проверки статуса асинхронно
  startPaymentStatusCheck(paymentResponse.id)

  return {
    data: paymentResponse
  }
})
