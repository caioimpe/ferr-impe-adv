// server/api/admin/articles/[id].get.ts
// Admin — busca artigo pelo ID (inclui drafts).
import { getArticleById } from '../../../repositories/articlesRepository'

export default defineEventHandler(async (event) => {
  const id      = getRouterParam(event, 'id')!
  const article = await getArticleById(id)

  if (!article) {
    throw createError({ statusCode: 404, message: 'Artigo não encontrado' })
  }

  return article
})
