// server/api/articles/categories.get.ts
// Endpoint público — categorias com artigos publicados.
import { getCategories } from '../../repositories/articlesRepository'

export default defineEventHandler(async () => {
  return getCategories(true)
})
