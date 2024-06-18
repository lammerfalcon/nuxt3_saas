export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  const { pathname } = new URL(url)
  const protectedRoutes = ['/api/users']
  for (let i = 0; i < protectedRoutes.length; i++) {
    const r = protectedRoutes[i]
    if (pathname === r) {
      await requireUserSession(event)
    }
  }
})
