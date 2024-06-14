export default defineNuxtRouteMiddleware((to) => {
  // Set the layout on the route you are navigating _to_
  console.log(to)
  if (to.path.startsWith('/app')) {
    setPageLayout('app')
  }
})
