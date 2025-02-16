export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession()
  if (loggedIn.value && to.path.startsWith('/login')) {
    return navigateTo('/app/ai')
  }
  if (loggedIn.value && to.path === '/') {
    return navigateTo('/app/ai')
  }
  if (!loggedIn.value && to.path === '/') {
    return navigateTo('/login')
  }
  if (to.path.startsWith('/app')) {
    setPageLayout('app')
    if (!loggedIn.value) {
      return navigateTo('/login')
    }
  }
})
