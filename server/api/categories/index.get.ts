import { categories } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const db = useDrizzle()
  // Fetch all categories
  const result = await db.select().from(categories)
  return result
})
