// server/api/articles/[slug].get.ts
// Endpoint público — artigo individual pelo slug (somente publicados).
import { getArticleBySlug } from '../../utils/storage'

export default defineEventHandler(async (event) => {
  const slug    = getRouterParam(event, 'slug')!
  const article = await getArticleBySlug(slug, true) // somente publicados

  if (!article) {
    throw createError({ statusCode: 404, message: 'Artigo não encontrado' })
  }

  return article
})
