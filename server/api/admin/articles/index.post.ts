// server/api/admin/articles/index.post.ts
// Admin — cria novo artigo.
// Protegido por server/middleware/admin-auth.ts
import { saveArticle } from '../../../utils/storage'
import type { ArticleInput } from '../../../../types/article'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<ArticleInput>>(event)

  if (!body.title?.trim())   throw createError({ statusCode: 400, message: 'title obrigatório' })
  if (!body.slug?.trim())    throw createError({ statusCode: 400, message: 'slug obrigatório' })
  if (!body.content?.trim()) throw createError({ statusCode: 400, message: 'content obrigatório' })
  if (!body.status)          throw createError({ statusCode: 400, message: 'status obrigatório' })

  return saveArticle(body as ArticleInput)
})
