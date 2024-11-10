import { defineEventHandler } from 'h3'
import { sql } from 'drizzle-orm'
import { format, setDate, getDaysInMonth } from 'date-fns'

export default defineEventHandler(async (event) => {
  const db = useDrizzle()

  // Get current date, year, and month
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()

  // Define the start and end timestamps for the current month
  const firstDayTimestamp = Math.floor(new Date(year, month, 1).getTime() / 1000) // in seconds
  const lastDayTimestamp = Math.floor(new Date(year, month + 1, 0, 23, 59, 59, 999).getTime() / 1000) // in seconds

  // Use a raw SQL query to get the data structured as needed
  const result = await db.all(
    sql`
      SELECT
        DATE(expenses.created_at, 'unixepoch') AS date,
        expenses.user_id AS userId,
        users.name AS userName,
        json_group_array(
        json_object(
        'createdAt', expenses.created_at,
        'amount', expenses.amount,
        'description', expenses.description
        )
        ) AS userExpenses
      FROM
        expenses
        JOIN
        users ON expenses.user_id = users.id
      WHERE
        expenses.created_at >= ${firstDayTimestamp} AND expenses.created_at <= ${lastDayTimestamp}
      GROUP BY
        DATE(expenses.created_at, 'unixepoch'),
        expenses.user_id
      ORDER BY
        expenses.created_at
    `
  )

  // Process the result into the required format
  const expensesByDate: { [key: string]: any } = {}
  result.forEach((row: any) => {
    const { date, userId, userName, userExpenses } = row

    if (!expensesByDate[date]) {
      expensesByDate[date] = []
    }

    expensesByDate[date].push({
      userId,
      userName,
      expenses: JSON.parse(userExpenses)
    })
  })

  // Determine the number of days in the current month
  const daysInMonth = getDaysInMonth(new Date(year, month))

  // Fill in missing dates up to the last day of the month with empty expenses
  const completeExpenses = []
  for (let day = 1; day <= daysInMonth; day++) {
    const date = format(setDate(new Date(year, month), day), 'yyyy-MM-dd')
    completeExpenses.push({
      date,
      expensesByUser: expensesByDate[date] || []
    })
  }

  // Calculate the total of all expenses
  const totalExpenses = result.reduce((total: number, row: any) => {
    const userExpenses = JSON.parse(row.userExpenses)
    return total + userExpenses.reduce((userTotal: number, expense: any) => userTotal + expense.amount, 0)
  }, 0).toFixed(0)

  return { expenses: completeExpenses, total: totalExpenses }
})
