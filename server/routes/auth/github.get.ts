import { users } from '@@/server/database/schema'

export default defineOAuthGitHubEventHandler({
  config: {
    emailRequired: true
  },
  async onSuccess(event, { user, tokens }) {
    const db = useDrizzle()

    const [upsertedUser] = await db.insert(users)
      .values({
        email: user.email,
        name: user.name,
        avatar: user.avatar_url,
        createdAt: new Date()
      })
      .onConflictDoUpdate({
        target: users.email,
        set: {
          name: user.name,
          avatar: user.avatar_url
        }
      })
      .returning()
    await setUserSession(event, {
      user: upsertedUser
    }, {
      maxAge: 60 * 60 * 24 * 30
    })

    return sendRedirect(event, '/app/ai')
  },
  onError(event, error) {
    console.error('GitHub OAuth error:', error)
    return sendRedirect(event, '/')
  }
})
