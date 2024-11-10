import { expenses } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const db = useDrizzle()
  const session = await requireUserSession(event)
  const body = await readBody(event)
  const [newExpense] = await db.insert(expenses).values({
    userId: session.user.id,
    amount: body.amount,
    description: body.description,
    categoryId: body.categoryId,
    createdAt: new Date()
  }).returning()

  return { success: true, expense: newExpense }
})
