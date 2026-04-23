// server/api/admin/articles/[id].put.ts
// Admin — atualiza artigo existente pelo ID.
import { getArticleById, saveArticle } from '../../../repositories/articlesRepository'
import type { ArticleInput } from '../../../../types/article'
import { validateArticleInput } from '../../../utils/validateArticleInput'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!

  const existing = await getArticleById(id)
  if (!existing) {
    throw createError({ statusCode: 404, message: 'Artigo não encontrado' })
  }

  const body  = await readBody<Partial<ArticleInput>>(event)
  const error = validateArticleInput(body, false)
  if (error) throw createError({ statusCode: 400, message: error })

  return saveArticle({ ...existing, ...body, id })
})
