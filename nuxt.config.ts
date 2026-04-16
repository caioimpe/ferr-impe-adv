// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',

  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
  ],

  // Permite usar <SiteHeader>, <HeroSection>, etc. sem prefixo de pasta
  components: {
    dirs: [
      {
        path: '~/components',
        pathPrefix: false,
      },
    ],
  },

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config',
  },

  typescript: {
    strict: true,
  },

  // Redireciona a rota legada /editorial para o novo painel /admin
  routeRules: {
    '/editorial': { redirect: '/admin' },
  },

  // Nitro storage — filesystem local; troque o driver para Vercel KV / Upstash em produção
  nitro: {
    storage: {
      db: {
        driver: 'fs',
        base: './.data/db',
      },
    },
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Ferrigato & Imperato Advogados',
      meta: [
        {
          name: 'description',
          content: 'Escritório de advocacia especializado em soluções jurídicas.',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        // Google Fonts — Marcellus, Raleway, Montserrat
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Marcellus&family=Raleway:wght@300;400;500;600&family=Montserrat:wght@300;400;500;600&display=swap',
        },
      ],
    },
  },
})
