// server/repositories/articlesRepository.ts
// ─────────────────────────────────────────────────────────────────────────────
// Camada de repositório para artigos.
//
// Esta é a ÚNICA importação que os handlers de API devem usar.
// A implementação real (Nitro storage local ou Postgres via Prisma) é selecionada
// automaticamente em runtime, com base em DATABASE_URL:
//
//   DATABASE_URL definida  →  prismaAdapter  (Postgres/Neon — PRODUÇÃO)
//   DATABASE_URL ausente   →  storageAdapter (Nitro fs — DESENVOLVIMENTO)
//
// Trocar a fonte de dados no futuro = mudar apenas getAdapter() abaixo.
// As páginas, componentes e handlers não precisam saber qual implementação está ativa.
// ─────────────────────────────────────────────────────────────────────────────

import type { Article, ArticleInput, Category } from '../../types/article'

// ─── Interface do repositório ─────────────────────────────────────────────────

export interface ArticleRepositoryAdapter {
  /** Retorna todos os artigos. onlyPublished=true filtra apenas publicados. */
  getAllArticles(onlyPublished?: boolean): Promise<Article[]>

  /** Retorna artigo pelo ID (ou null). */
  getArticleById(id: string): Promise<Article | null>

  /** Retorna artigo pelo slug (onlyPublished=true para o site público). */
  getArticleBySlug(slug: string, onlyPublished?: boolean): Promise<Article | null>

  /** Cria ou atualiza um artigo. */
  saveArticle(input: ArticleInput): Promise<Article>

  /** Remove artigo pelo ID. */
  deleteArticle(id: string): Promise<void>

  /** Lista categorias com contagem de artigos. */
  getCategories(onlyPublished?: boolean): Promise<Category[]>
}

// ─── Seleção de adaptador ─────────────────────────────────────────────────────
//
// O adaptador é carregado de forma lazy e cacheado para todo o ciclo de vida
// do processo. O import dinâmico evita que @prisma/client seja carregado quando
// DATABASE_URL não existe (fallback local seguro).

let _adapterPromise: Promise<ArticleRepositoryAdapter> | null = null

function getAdapter(): Promise<ArticleRepositoryAdapter> {
  if (_adapterPromise) return _adapterPromise

  if (process.env.DATABASE_URL) {
    // PRODUÇÃO: Postgres via Prisma
    _adapterPromise = import('./adapters/prismaAdapter').then(m => m.prismaAdapter)
  } else {
    // DESENVOLVIMENTO: Nitro useStorage (driver fs local)
    _adapterPromise = import('./adapters/storageAdapter').then(m => m.storageAdapter)
  }

  // Se o import falhar (ex: binário Prisma não encontrado, DATABASE_URL inválida),
  // limpa o cache para que a próxima request tente novamente em vez de reutilizar
  // uma promessa permanentemente rejeitada.
  _adapterPromise = _adapterPromise.catch((err) => {
    _adapterPromise = null
    console.error('[articlesRepository] Falha ao carregar adaptador:', err)
    throw createError({ statusCode: 503, message: 'Serviço de artigos temporariamente indisponível.' })
  })

  return _adapterPromise
}

// ─── API pública do repositório ───────────────────────────────────────────────

/** Retorna todos os artigos. onlyPublished=true para o site público. */
export async function getAllArticles(onlyPublished = false): Promise<Article[]> {
  return (await getAdapter()).getAllArticles(onlyPublished)
}

/** Retorna artigo pelo ID (ou null). */
export async function getArticleById(id: string): Promise<Article | null> {
  return (await getAdapter()).getArticleById(id)
}

/** Retorna artigo pelo slug. onlyPublished=true para o site público. */
export async function getArticleBySlug(slug: string, onlyPublished = true): Promise<Article | null> {
  return (await getAdapter()).getArticleBySlug(slug, onlyPublished)
}

/** Cria ou atualiza um artigo. */
export async function saveArticle(input: ArticleInput): Promise<Article> {
  return (await getAdapter()).saveArticle(input)
}

/** Remove artigo pelo ID. */
export async function deleteArticle(id: string): Promise<void> {
  return (await getAdapter()).deleteArticle(id)
}

/** Lista categorias com contagem de artigos. */
export async function getCategories(onlyPublished = true): Promise<Category[]> {
  return (await getAdapter()).getCategories(onlyPublished)
}
