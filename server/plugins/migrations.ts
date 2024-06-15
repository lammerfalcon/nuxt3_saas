// import { consola } from 'consola'
// import { migrate } from 'drizzle-orm/d1/migrator'

export default defineNitroPlugin(async () => {
  if (!import.meta.dev) return

  onHubReady(() => {
    console.log('Migrating database', e)
    // await migrate(useDrizzle(), { migrationsFolder: 'server/database/migrations' })
    //   .then(() => {
    //     consola.log('Database migrations done')
    //   })
    //   .catch((err) => {
    //     consola.error('Database migrations failed', err)
    //   })
  })
})
