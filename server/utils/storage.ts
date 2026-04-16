// server/utils/storage.ts
// Camada de abstração de persistência — usa useStorage() do Nitro.
//
// DESENVOLVIMENTO LOCAL: driver 'fs', arquivos em .data/db/
// PRODUÇÃO (Vercel):     trocar para 'vercel-kv' ou 'redis' no nuxt.config.ts
//                        ver comentário em nuxt.config.ts → nitro.storage

import { randomUUID } from 'node:crypto'
import type { Article, ArticleInput, Category } from '../../types/article'

// Namespace configurado em nitro.storage (nuxt.config.ts)
const NS = 'db'

// ─── Índice leve (evita carregar todos os artigos para listagens) ─────────────

type IndexEntry = Pick<Article, 'id' | 'slug' | 'status' | 'category' | 'categorySlug' | 'publishedAt' | 'updatedAt' | 'date'>

async function getIndex(): Promise<IndexEntry[]> {
  return (await useStorage(NS).getItem<IndexEntry[]>('articles:index')) ?? []
}

async function setIndex(index: IndexEntry[]): Promise<void> {
  await useStorage(NS).setItem('articles:index', index)
}

// ─── Funções públicas ─────────────────────────────────────────────────────────

/** Retorna todos os artigos. onlyPublished=true para o site público. */
export async function getAllArticles(onlyPublished = false): Promise<Article[]> {
  const index = await getIndex()
  const entries = onlyPublished ? index.filter(e => e.status === 'published') : index

  const articles = await Promise.all(
    entries.map(({ id }) => useStorage(NS).getItem<Article>(`articles:${id}`)),
  )

  return (articles.filter((a): a is Article => a !== null))
    .sort((a, b) => (b.publishedAt ?? b.createdAt).localeCompare(a.publishedAt ?? a.createdAt))
}

/** Retorna um artigo pelo ID. */
export async function getArticleById(id: string): Promise<Article | null> {
  return useStorage(NS).getItem<Article>(`articles:${id}`)
}

/** Retorna o artigo pelo slug. onlyPublished=true para o site público. */
export async function getArticleBySlug(slug: string, onlyPublished = true): Promise<Article | null> {
  const index = await getIndex()
  const entry = index.find(
    e => e.slug === slug && (!onlyPublished || e.status === 'published'),
  )
  if (!entry) return null
  return getArticleById(entry.id)
}

/**
 * Cria ou atualiza um artigo.
 * Ao publicar pela primeira vez, define publishedAt automaticamente.
 * Ao despublicar (draft), preserva o publishedAt histórico.
 */
export async function saveArticle(input: ArticleInput): Promise<Article> {
  const storage = useStorage(NS)
  const now     = new Date().toISOString()
  const dateKey = (iso: string) => iso.split('T')[0]!

  let article: Article

  if (input.id) {
    const existing = await getArticleById(input.id)
    if (!existing) {
      throw createError({ statusCode: 404, message: 'Artigo não encontrado' })
    }

    const publishedAt = input.status === 'published'
      ? (existing.publishedAt ?? now)
      : existing.publishedAt

    article = {
      ...existing,
      ...input,
      id:          existing.id,
      createdAt:   existing.createdAt,
      updatedAt:   now,
      publishedAt,
      date:        dateKey(publishedAt ?? now),
    }
  } else {
    const id          = randomUUID()
    const publishedAt = input.status === 'published' ? now : undefined

    article = {
      ...input,
      id,
      createdAt:   now,
      updatedAt:   now,
      publishedAt,
      date:        dateKey(publishedAt ?? now),
    } as Article
  }

  await storage.setItem(`articles:${article.id}`, article)

  // Atualiza índice
  const index = await getIndex()
  const entry: IndexEntry = {
    id:          article.id,
    slug:        article.slug,
    status:      article.status,
    category:    article.category,
    categorySlug: article.categorySlug,
    publishedAt: article.publishedAt,
    updatedAt:   article.updatedAt,
    date:        article.date,
  }

  const pos = index.findIndex(e => e.id === article.id)
  if (pos >= 0) {
    index[pos] = entry
  } else {
    index.unshift(entry)
  }
  await setIndex(index)

  return article
}

/** Remove um artigo pelo ID. */
export async function deleteArticle(id: string): Promise<void> {
  await useStorage(NS).removeItem(`articles:${id}`)
  await setIndex((await getIndex()).filter(e => e.id !== id))
}

/** Lista categorias com contagem. onlyPublished=true para o site público. */
export async function getCategories(onlyPublished = true): Promise<Category[]> {
  const index = await getIndex()
  const entries = onlyPublished ? index.filter(e => e.status === 'published') : index

  const map = new Map<string, Category>()
  for (const e of entries) {
    const existing = map.get(e.categorySlug)
    if (existing) {
      existing.count++
    } else {
      map.set(e.categorySlug, { name: e.category, slug: e.categorySlug, count: 1 })
    }
  }

  return [...map.values()].sort((a, b) => b.count - a.count)
}
