export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession()
  if (loggedIn.value && to.path.startsWith('/login')) {
    return navigateTo('/app')
  }
  if (to.path.startsWith('/app')) {
    setPageLayout('app')
    if (!loggedIn.value) {
      return navigateTo('/login')
    }
  }
})
