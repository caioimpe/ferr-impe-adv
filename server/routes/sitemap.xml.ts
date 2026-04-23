// server/routes/sitemap.xml.ts
// Gera /sitemap.xml dinamicamente.
// Inclui páginas estáticas + todos os artigos publicados do banco.

import { getAllArticles } from '../repositories/articlesRepository'

const STATIC_PAGES = [
  { loc: '/',                  changefreq: 'weekly',  priority: '1.0' },
  { loc: '/quem-somos',        changefreq: 'monthly', priority: '0.7' },
  { loc: '/sobre',             changefreq: 'monthly', priority: '0.7' },
  { loc: '/areas-de-atuacao',  changefreq: 'monthly', priority: '0.7' },
  { loc: '/artigos',           changefreq: 'daily',   priority: '0.8' },
  { loc: '/contato',           changefreq: 'monthly', priority: '0.6' },
]

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export default defineEventHandler(async (event) => {
  const siteUrl = (process.env.NUXT_PUBLIC_SITE_URL ?? '').replace(/\/$/, '')

  const articles = await getAllArticles(true) // onlyPublished = true

  const today = new Date().toISOString().split('T')[0]

  const staticUrls = STATIC_PAGES.map(({ loc, changefreq, priority }) => `
  <url>
    <loc>${escapeXml(siteUrl + loc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('')

  const articleUrls = articles.map((a) => {
    const lastmod = (a.updatedAt ?? a.publishedAt ?? a.createdAt ?? today).split('T')[0]
    return `
  <url>
    <loc>${escapeXml(`${siteUrl}/artigos/${a.slug}`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
  }).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticUrls}${articleUrls}
</urlset>`

  setResponseHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  // Sem cache: o sitemap deve refletir imediatamente qualquer artigo publicado.
  // 'no-store' impede tanto o CDN/Vercel Edge quanto o browser de servir versão antiga.
  setResponseHeader(event, 'Cache-Control', 'no-store')
  return xml
})
