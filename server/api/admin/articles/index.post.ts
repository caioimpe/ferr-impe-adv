// server/api/admin/articles/index.post.ts
// Admin — cria novo artigo.
// Protegido por server/middleware/admin-auth.ts
import { saveArticle } from '../../../repositories/articlesRepository'
import type { ArticleInput } from '../../../../types/article'
import { validateArticleInput } from '../../../utils/validateArticleInput'
import { checkRateLimit, getClientIp } from '../../../utils/rateLimiter'

export default defineEventHandler(async (event) => {
  // Rate limiting: 30 criações por IP por hora
  const ip = getClientIp(event)
  if (!checkRateLimit(`articles-write:${ip}`, 30, 60 * 60_000)) {
    throw createError({ statusCode: 429, message: 'Muitas requisições. Aguarde antes de criar mais artigos.' })
  }

  const body  = await readBody<Partial<ArticleInput>>(event)
  const error = validateArticleInput(body, true)
  if (error) throw createError({ statusCode: 400, message: error })

  return saveArticle(body as ArticleInput)
})
