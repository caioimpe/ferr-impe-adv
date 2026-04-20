// server/repositories/adapters/storageAdapter.ts
// Adaptador que usa o storage Nitro local (fs driver em dev, KV em produção se configurado).
// É a implementação padrão — usada quando DATABASE_URL não está definida.
// FALLBACK SEGURO: mantém o comportamento atual sem qualquer alteração.

import {
  getAllArticles,
  getArticleById,
  getArticleBySlug,
  saveArticle,
  deleteArticle,
  getCategories,
} from '../../utils/storage'

import type { ArticleRepositoryAdapter } from '../articlesRepository'

export const storageAdapter: ArticleRepositoryAdapter = {
  getAllArticles,
  getArticleById,
  getArticleBySlug,
  saveArticle,
  deleteArticle,
  getCategories,
}
