// server/api/admin/articles/[id].delete.ts
// Admin — exclui artigo pelo ID.
import { deleteArticle } from '../../../repositories/articlesRepository'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  await deleteArticle(id)
  return { ok: true }
})
