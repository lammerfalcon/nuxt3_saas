import { orders } from '~/server/database/schema'

export default defineEventHandler(async (event) => {
  const db = useDrizzle()
  await db.insert(orders).values({
    amount: 1000,
    createdAt: new Date()
  }).returning()

  async function createPayment() {
    const shopId = '408678'
    // const shopId = '395948'
    // const secretKey = 'live_acjDFIOoZkk3ZI-xm9FNSYUYMFDW3JxlMyRMQYxFPLU'
    const secretKey = 'test_XHJ_oZMbjJfqUM_lWBEmPKb8JCcPepYUrQ4NMjQQbGM'
    // const idempotenceKey = '1212315756187561926598'
    const idempotenceKey = '1212315756187561926598'

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
      capture: true,
      description: 'Order No. 37',
      metadata: {
        order_id: '37'
      }
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
    console.log('Payment created:', payment)

    return payment
  }
  const response = await createPayment()
  return {
    data: response
  }
})
