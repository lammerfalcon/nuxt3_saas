export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession()
  console.log('Route middleware', to.path)
  if (loggedIn.value && to.path.startsWith('/login')) {
    return navigateTo('/app')
  }
  if (loggedIn.value && to.path === '/') {
    return navigateTo('/app')
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
