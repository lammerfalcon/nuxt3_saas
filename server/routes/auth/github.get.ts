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
    await useDrizzle().insert(users).values({
      email: user.email
    }).run()

    return sendRedirect(event, '/')
  },
  // Optional, will return a json error and 401 status code by default
  onError(event, error) {
    console.error('GitHub OAuth error:', error)
    return sendRedirect(event, '/')
  }
})
