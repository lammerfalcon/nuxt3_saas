import { budgets } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const db = useDrizzle()
  const body = await readBody(event)

  const [newBudget] = await db.insert(budgets).values({
    name: body.name,
    createdAt: new Date()
  }).returning()

  return newBudget
})
