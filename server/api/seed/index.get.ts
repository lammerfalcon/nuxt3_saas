import { seedDatabase } from '~~/server/database/seeders/seed'

export default defineEventHandler(async (event) => {
  const response = await seedDatabase()

  return { response }
})
