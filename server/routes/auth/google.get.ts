import { users } from '~/server/database/schema'

export default oauth.googleEventHandler({

  async onSuccess(event, { user, tokens }) {
    const db = useDrizzle()
    console.log(user)
    // Upsert (insert or update on conflict) user data
    const [upsertedUser] = await db.insert(users)
      .values({
        email: user.email,
        name: user.name,
        avatar: user.picture,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .onConflictDoUpdate({
        target: users.email,
        set: {
          name: user.name,
          avatar: user.picture,
          updatedAt: new Date()
        }
      })
      .returning()
    console.log(upsertedUser)
    // Set the user session with the up-to-date user information
    await setUserSession(event, {
      user: upsertedUser
    })

    return sendRedirect(event, '/app')
  },
  // Optional, will return a json error and 401 status code by default
  onError(event, error) {
    console.error('GitHub OAuth error:', error)
    return sendRedirect(event, '/')
  }
})
