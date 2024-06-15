import { users } from '~/server/database/schema'

export default oauth.githubEventHandler({
  config: {
    emailRequired: true
  },
  async onSuccess(event, { user, tokens }) {
    await setUserSession(event, {
      user: {
        githubId: user.id
      }
    })
    const usersList = await useDrizzle().select().from(users).all()
    console.log(usersList)
    console.log(user)
    await useDrizzle().insert(users).values({
      email: user.email,
      name: user.name,
      avatar: user.avatar_url,
      createdAt: new Date()
    }).onConflictDoNothing().run()

    return sendRedirect(event, '/app')
  },
  // Optional, will return a json error and 401 status code by default
  onError(event, error) {
    console.error('GitHub OAuth error:', error)
    return sendRedirect(event, '/')
  }
})
