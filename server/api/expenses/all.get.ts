import { and, desc, gte, lte } from 'drizzle-orm'
import { expenses } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  const db = useDrizzle()

  // Get query parameters for filtering by date
  const { startDate, endDate } = getQuery(event)

  // If no dates are provided, set defaults to the first and last days of the current month
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const defaultStartDate = new Date(year, month, 1)
  const defaultEndDate = new Date(year, month + 1, 0, 23, 59, 59, 999)

  // Parse startDate and endDate or use defaults
  const filterStartDate = startDate ? new Date(startDate) : defaultStartDate
  const filterEndDate = endDate ? new Date(endDate) : defaultEndDate

  // Query the database with date filtering
  const result = await db
    .select()
    .from(expenses)
    .where(
      and(
        gte(expenses.createdAt, filterStartDate),
        lte(expenses.createdAt, filterEndDate)
      )
    )
    .orderBy(desc(expenses.createdAt))

  return result
})
