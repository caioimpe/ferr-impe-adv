// plugins/analytics.ts
// Google Analytics 4 via Google tag (gtag.js)
//
// – Injeta os scripts no <head> apenas se NUXT_PUBLIC_GA_ID estiver definido.
// – send_page_view:false evita o page_view automático do gtag (que duplicaria no SSR).
// – router.afterEach dispara page_view manualmente em cada navegação, excluindo /admin/*.
// – nextTick garante que document.title já foi atualizado pelo Nuxt antes do envio.

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

export default defineNuxtPlugin(() => {
  const { public: { gaId } } = useRuntimeConfig()

  if (!gaId) return

  useHead({
    script: [
      {
        key: 'gtag-js',
        src: `https://www.googletagmanager.com/gtag/js?id=${gaId}`,
        async: true,
      },
      {
        key: 'gtag-config',
        // Inicializa dataLayer + configura GA4 sem disparar page_view automático
        innerHTML: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaId}',{send_page_view:false});`,
      },
    ],
  })

  if (import.meta.client) {
    const router = useRouter()

    router.afterEach((to) => {
      // Exclui todo o painel admin do rastreamento
      if (to.path.startsWith('/admin')) return

      // Aguarda o Nuxt atualizar o <title> da página antes de enviar o evento
      nextTick(() => {
        window.gtag('event', 'page_view', {
          page_title: document.title,
          page_location: window.location.href,
          page_path: to.fullPath,
        })
      })
    })
  }
})
