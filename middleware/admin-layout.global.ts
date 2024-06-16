export default defineNuxtRouteMiddleware((to) => {
  // Set the layout on the route you are navigating _to_
  const { loggedIn } = useUserSession()
  if (to.path.startsWith('/app')) {
    setPageLayout('app')
    if (!loggedIn.value) {
      return navigateTo('/login')
    }
  }
})
