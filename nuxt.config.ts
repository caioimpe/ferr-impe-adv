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
    // Garante que o Prisma Client gerado (node_modules/.prisma) seja incluído
    // no trace do bundle Vercel. Sem isso, o Nitro pode omitir os arquivos do
    // Prisma ao montar o output serverless, quebrando a conexão em produção.
    externals: {
      traceInclude: [
        // JS client (queries, tipos, runtime)
        './node_modules/.prisma/client/index.js',
        // Engine nativo para Vercel Serverless Functions (Amazon Linux / RHEL)
        './node_modules/.prisma/client/libquery_engine-rhel-openssl-3.0.x.so.node',
      ],
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
