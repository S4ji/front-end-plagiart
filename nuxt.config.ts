// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: { enabled: true },
    modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
    css: ['@/assets/css/main.css'],

    runtimeConfig: {
        public: {
            API_BASE_URL:
                process.env.NUXT_API_BASE_URL || 'http://localhost:3300',
        },
    },
})
