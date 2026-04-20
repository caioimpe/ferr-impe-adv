// server/api/articles/index.get.ts
// Endpoint público — retorna apenas artigos publicados.
import { getAllArticles } from '../../repositories/articlesRepository'

export default defineEventHandler(async (event) => {
  const { category } = getQuery(event)

  let articles = await getAllArticles(true) // somente publicados

  if (category && typeof category === 'string') {
    articles = articles.filter(a => a.categorySlug === category)
  }

  return articles
})
