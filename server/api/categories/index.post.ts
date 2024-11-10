import { categories } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const db = useDrizzle()

  const { name } = await readBody(event)

  if (!name) {
    return { error: 'Category name is required' }
  }

  const [result] = await db.insert(categories).values({
    name,
    createdAt: new Date()
  }).returning()

  return { result }
})
