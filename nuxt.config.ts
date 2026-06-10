// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',

  devtools: { enabled: true },

  // Variáveis públicas — acessíveis no cliente e no servidor
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
      gaId: process.env.NUXT_PUBLIC_GA_ID ?? '',
    },
  },

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
    // Prisma Client — não deve ser bundlado pelo Nitro/esbuild.
    // O @prisma/client carrega um binário nativo (.so.node) em runtime;
    // se o Nitro tentar bundlar o pacote, o binário não é encontrado e
    // a conexão falha com erro de módulo nativo.
    //
    // `external` → Nitro não inclui esses pacotes no bundle; usa require() em runtime
    // `traceInclude` → garante que os arquivos físicos sejam copiados para .output/
    externals: {
      external: ['@prisma/client', '.prisma/client'],
      traceInclude: [
        './node_modules/@prisma/client/index.js',
        './node_modules/@prisma/client/package.json',
        './node_modules/.prisma/client/index.js',
        './node_modules/.prisma/client/package.json',
        './node_modules/.prisma/client/libquery_engine-rhel-openssl-3.0.x.so.node',
      ],
    },
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: { lang: 'pt-BR' },
      title: 'Ferrigato & Imperato Advogados',
      templateParams: { separator: '|' },
      meta: [
        {
          name: 'description',
          content: 'Escritório de advocacia em Salto/SP. Assessoria jurídica técnica, ética e comprometida com os resultados dos nossos clientes.',
        },
        { name: 'theme-color', content: '#1a2e1a' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:site_name', content: 'Ferrigato & Imperato Advogados' },
        { property: 'og:locale', content: 'pt_BR' },
        { name: 'twitter:card', content: 'summary_large_image' },
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
