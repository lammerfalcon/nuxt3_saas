import { defineEventHandler } from 'h3'
import { sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const db = useDrizzle()

  // Get current date, year, and month
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()

  // Define the start and end timestamps for the current month
  const firstDayTimestamp = Math.floor(new Date(year, month, 1).getTime() / 1000) // in seconds
  const lastDayTimestamp = Math.floor(new Date(year, month + 1, 0, 23, 59, 59, 999).getTime() / 1000) // in seconds

  // Use a raw SQL query to get the total amount per category
  const result = await db.all(
    sql`
      SELECT
        expenses.category_id AS categoryId,
        COALESCE(categories.name, 'Uncategorized') AS categoryName,
        SUM(expenses.amount) AS totalAmount
      FROM
        expenses
          LEFT JOIN categories ON expenses.category_id = categories.id
      WHERE
        expenses.created_at >= ${firstDayTimestamp} AND expenses.created_at <= ${lastDayTimestamp}
      GROUP BY
        expenses.category_id
      ORDER BY
        totalAmount DESC
    `
  )

  // Process the result into the required format
  const expensesByCategory = result.map((row) => {
    const { categoryId, categoryName, totalAmount } = row
    return {
      categoryId,
      categoryName,
      totalAmount: totalAmount !== null ? parseFloat(totalAmount) : 0
    }
  })

  // Calculate the total of all expenses
  const totalExpenses = expensesByCategory
    .reduce((total, row) => total + row.totalAmount, 0)
    .toFixed(0)

  return { expenses: expensesByCategory, total: totalExpenses }
})
