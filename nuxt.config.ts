// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: [process.env.NUXT_UI_PRO_PATH || '@nuxt/ui-pro'],

  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/fonts',
    '@vueuse/nuxt',
    'nuxt-og-image',
    '@nuxthub/core',
    'nuxt-auth-utils',
    '@vite-pwa/nuxt'
  ],

  $development: {
    hub: {
      remote: false
    }
  },

  devtools: {
    enabled: true
  },
  colorMode: {
    disableTransition: true
  },

  ui: {
    icons: ['heroicons', 'simple-icons']
  },

  runtimeConfig: {
    oauth: {
      google: {
        clientId: process.env.NUXT_OAUTH_GOOGLE_CLIENT_ID,
        clientSecret: process.env.NUXT_OAUTH_GOOGLE_CLIENT_SECRET
      }
    }
  },
  future: {
    compatibilityVersion: 4
  },

  compatibilityDate: '2024-11-05',

  nitro: {
    experimental: {
      openAPI: true
    }
  },

  hub: {
    database: true,
    blob: true
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  image: {
    cloudflare: {
      baseURL: 'https://nuxt3-saas.nuxt.dev/'
    }
  },
  pwa: {
    manifest: {
      name: '123',
      short_name: '123',
      theme_color: '#8a8a5e',
      description: '123',
      icons: [
        {
          src: 'logo.webp',
          sizes: '150x150',
          type: 'image/png'
        }
      ]

    },
    workbox: {
      navigateFallback: '/'

    },
    devOptions: {
      enabled: true,
      type: 'module'
    }

  }
})
