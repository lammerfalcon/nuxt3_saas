// server/database/seed.ts

import { faker } from '@faker-js/faker'
import { users, expenses } from '~~/server/database/schema'

export async function seedDatabase() {
  const db = useDrizzle()
  console.log('Seeding the database...')

  console.log('Cleared existing data')
  const userIds = await Promise.all(
    Array.from({ length: 3 }, async () => {
      const [insertedUser] = await db.insert(users).values({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        avatar: faker.image.avatar(),
        createdAt: new Date()
      }).returning({ id: users.id })
      return insertedUser.id
    })
  )

  // Create expenses for each day in 2024
  const startDate = new Date('2024-01-01')
  const endDate = new Date('2024-12-31')
  const currentDate = startDate

  while (currentDate <= endDate) {
    // Generate random expenses for each user on this date
    for (const userId of userIds) {
      const expenseCount = Math.floor(Math.random() * 3) + 1 // 1-3 expenses per day

      for (let i = 0; i < expenseCount; i++) {
        const amount = faker.finance.amount({
          min: 10,
          max: 1000,
          dec: 2,
          symbol: '',
          autoFormat: false
        })
        const description = faker.commerce.productDescription()

        await db.insert(expenses).values({
          userId,
          amount,
          createdAt: new Date(currentDate),
          description
        })
      }
    }

    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1)
  }

  console.log('Database seeding completed!')
}
