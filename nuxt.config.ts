// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  typescript: {
    strict: true,
    typeCheck: true
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE || 'http://localhost:3001/api'
    }
  },
  modules: ['@nuxtjs/tailwindcss'],
})
