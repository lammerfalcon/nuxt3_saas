import { users } from '~~/server/database/schema'

export default defineEventHandler(async (event) => {
  return useDrizzle().select().from(users).all()
})
