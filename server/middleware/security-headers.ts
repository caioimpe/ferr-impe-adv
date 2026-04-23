// server/middleware/security-headers.ts
// Aplica headers de segurança em todas as respostas do servidor.
//
// Headers não-CSP: sempre ativos (desenvolvimento e produção).
// Content-Security-Policy: apenas em produção para não bloquear o Nuxt DevTools.
//
// COMPATIBILIDADE:
// – Google Fonts: fonts.googleapis.com + fonts.gstatic.com
// – Vercel Blob:  *.public.blob.vercel-storage.com
// – Nuxt 3:       unsafe-inline necessário para scripts de hidratação
//
// FUTURO (Etapa 11+): substituir 'unsafe-inline' por nonces via Nuxt hooks.

export default defineEventHandler((event) => {
  // X-Content-Type-Options — impede MIME sniffing em todos os responses
  setResponseHeader(event, 'X-Content-Type-Options', 'nosniff')

  // X-Frame-Options — impede clickjacking em browsers sem suporte a CSP frame-ancestors
  setResponseHeader(event, 'X-Frame-Options', 'DENY')

  // Referrer-Policy — envia apenas a origem, nunca path/query para domínios externos
  setResponseHeader(event, 'Referrer-Policy', 'strict-origin-when-cross-origin')

  // Permissions-Policy — desabilita APIs de sensor/câmera que o site não usa
  setResponseHeader(event, 'Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()')

  // Content-Security-Policy — apenas em produção para não interferir no DevTools
  if (process.env.NODE_ENV === 'production') {
    const csp = [
      "default-src 'self'",
      // Nuxt 3 injeta scripts inline para hidratação — unsafe-inline necessário
      // GA4: googletagmanager.com serve o gtag/js
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
      // Tailwind em produção = CSS extraído; unsafe-inline cobre estilos dinâmicos do Vue
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Google Fonts
      "font-src 'self' https://fonts.gstatic.com",
      // Imagens: próprio domínio + data URIs + Vercel Blob + GA4 beacon fallback
      "img-src 'self' data: blob: https://*.public.blob.vercel-storage.com https://www.google-analytics.com",
      // Fetch/XHR: same-origin + GA4 coleta de dados
      "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com",
      // Bloqueia objetos embarcados (Flash, PDF embutido etc.)
      "object-src 'none'",
      // Bloqueia iframes desta página em qualquer site
      "frame-ancestors 'none'",
      // Impede injeção de base URL
      "base-uri 'self'",
      // Restringe destinos de formulários ao próprio site
      "form-action 'self'",
    ].join('; ')

    setResponseHeader(event, 'Content-Security-Policy', csp)
  }
})
