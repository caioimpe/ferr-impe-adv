// composables/useArticleStore.ts
// DEPRECATED — migrado para Nuxt Server API.
// Use useFetch('/api/articles') ou os endpoints /api/admin/articles/.
// Stub mantém assinatura de tipos para não quebrar arquivos legados durante a transição.

import type { Article, Category } from '~/types/article'

export const useArticleStore = () => {
  const articles = useState<Article[]>('fi_articles', () => [])
  const hydrated = useState<boolean>('fi_hydrated', () => false)

  const hydrate = () => {}
  const saveArticle = (_article: Article) => {}
  const deleteArticle = (_slug: string) => {}
  const getBySlug = (_slug: string): Article | undefined => undefined
  const getByCategory = (_categorySlug: string): Article[] => []
  const categories = computed<Category[]>(() => [])
  const slugExists = (_slug: string, _exclude?: string): boolean => false
  const getRelated = (_current: Article, _count = 2): Article[] => []

  return {
    articles: readonly(articles),
    hydrated: readonly(hydrated),
    hydrate,
    saveArticle,
    deleteArticle,
    getBySlug,
    getByCategory,
    categories,
    slugExists,
    getRelated,
  }
}
