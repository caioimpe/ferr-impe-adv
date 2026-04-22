// server/routes/robots.txt.ts
// Gera /robots.txt dinamicamente, usando NUXT_PUBLIC_SITE_URL como base.

export default defineEventHandler((event) => {
  const siteUrl = process.env.NUXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? ''

  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /admin/',
    'Disallow: /api/admin',
    'Disallow: /api/admin/',
    '',
    `Sitemap: ${siteUrl}/sitemap.xml`,
  ].join('\n')

  setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600')
  return body
})
