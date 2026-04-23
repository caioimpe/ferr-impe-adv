// plugins/analytics.ts
// Google Analytics 4 via Google tag (gtag.js)
//
// Snippet padrão do Google: gtag('config', ID) dispara page_view automaticamente
// no carregamento inicial da página (SSR → hidratação do cliente).
//
// Para navegações SPA do Nuxt (Vue Router), router.afterEach dispara page_view
// manualmente em cada transição subsequente, excluindo /admin/*.
// A flag isFirstNavigation evita contagem dupla no carregamento inicial.

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

export default defineNuxtPlugin(() => {
  const { public: { gaId } } = useRuntimeConfig()

  if (!gaId) return

  // Snippet exato recomendado pelo Google Analytics
  useHead({
    script: [
      {
        key: 'gtag-js',
        src: `https://www.googletagmanager.com/gtag/js?id=${gaId}`,
        async: true,
      },
      {
        key: 'gtag-config',
        innerHTML: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaId}');`,
      },
    ],
  })

  if (import.meta.client) {
    const router = useRouter()
    // O page_view do carregamento inicial já foi enviado pelo gtag('config', ...)
    // acima; ignoramos a primeira chamada do afterEach para evitar duplicata.
    let isFirstNavigation = true

    router.afterEach((to) => {
      // Exclui todo o painel admin do rastreamento
      if (to.path.startsWith('/admin')) return

      if (isFirstNavigation) {
        isFirstNavigation = false
        return
      }

      // Navegações SPA subsequentes: dispara page_view manualmente
      // nextTick garante que document.title já foi atualizado pelo Nuxt
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

