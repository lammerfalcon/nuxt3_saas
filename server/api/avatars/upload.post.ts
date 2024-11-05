import { users } from '@@/server/database/schema'

export default eventHandler(async (event) => {
  const session = await requireUserSession(event)
  const db = useDrizzle()

  const avatarData = await hubBlob().handleUpload(event, {
    multiple: false,
    put: {
      addRandomSuffix: true,
      prefix: 'avatars/'
    },
    ensure: {
      maxSize: '8MB',
      types: ['image/jpeg', 'image/png', 'image/gif', 'image/heic', 'image/webp']
    }
  })
  const [updatedUser] = await db.update(users).set({ avatar: avatarData[0].pathname }).where(eq(users.email, session.user.email)).returning()
  console.log('updatedUser', updatedUser)
  await replaceUserSession(event, {
    user: updatedUser
  })

  return avatarData
})
