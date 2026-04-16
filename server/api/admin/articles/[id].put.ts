// server/api/admin/articles/[id].put.ts
// Admin — atualiza artigo existente pelo ID.
import { getArticleById, saveArticle } from '../../../utils/storage'
import type { ArticleInput } from '../../../../types/article'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!

  const existing = await getArticleById(id)
  if (!existing) {
    throw createError({ statusCode: 404, message: 'Artigo não encontrado' })
  }

  const body = await readBody<Partial<ArticleInput>>(event)

  if (body.title !== undefined && !body.title.trim()) {
    throw createError({ statusCode: 400, message: 'title não pode ser vazio' })
  }

  return saveArticle({ ...existing, ...body, id })
})
