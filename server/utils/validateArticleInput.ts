// server/utils/validateArticleInput.ts
// Validação centralizada de input de artigos.
// Usada por index.post.ts (criar) e [id].put.ts (editar).
//
// Retorna string com mensagem de erro, ou null se válido.

import type { ArticleInput } from '../../types/article'

// Slug: apenas letras minúsculas, números e hífens; sem hífens duplos ou nas pontas
const SLUG_RE   = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const VALID_STATUS = new Set<string>(['draft', 'published'])

/**
 * Valida os campos de um artigo para criação (create=true) ou edição (create=false).
 * Em modo edição, campos ausentes são ignorados — apenas os presentes são validados.
 */
export function validateArticleInput(
  body: Partial<ArticleInput>,
  create = true,
): string | null {
  // ── Campos obrigatórios na criação ──────────────────────────────────────────
  if (create) {
    if (!body.title?.trim())   return 'title é obrigatório'
    if (!body.slug?.trim())    return 'slug é obrigatório'
    if (!body.content?.trim()) return 'content é obrigatório'
    if (!body.status)          return 'status é obrigatório'
  }

  // ── title ───────────────────────────────────────────────────────────────────
  if (body.title !== undefined) {
    if (!body.title.trim())            return 'title não pode ser vazio'
    if (body.title.length > 200)       return 'title: máximo 200 caracteres'
  }

  // ── slug ────────────────────────────────────────────────────────────────────
  if (body.slug !== undefined) {
    if (!body.slug.trim())             return 'slug não pode ser vazio'
    if (body.slug.length > 200)        return 'slug: máximo 200 caracteres'
    if (!SLUG_RE.test(body.slug))      return 'slug: use apenas letras minúsculas, números e hífens (ex: meu-artigo)'
  }

  // ── status ──────────────────────────────────────────────────────────────────
  if (body.status !== undefined) {
    if (!VALID_STATUS.has(body.status)) return 'status inválido: use "draft" ou "published"'
  }

  // ── content ─────────────────────────────────────────────────────────────────
  if (body.content !== undefined) {
    if (!body.content.trim())          return 'content não pode ser vazio'
    if (body.content.length > 300_000) return 'content: tamanho máximo excedido (300 000 caracteres)'
  }

  // ── excerpt ─────────────────────────────────────────────────────────────────
  if (body.excerpt !== undefined && body.excerpt.length > 600) {
    return 'excerpt: máximo 600 caracteres'
  }

  // ── category ────────────────────────────────────────────────────────────────
  if (body.category !== undefined && body.category.length > 100) {
    return 'category: máximo 100 caracteres'
  }

  // ── seoTitle ────────────────────────────────────────────────────────────────
  if (body.seoTitle !== undefined && body.seoTitle.length > 70) {
    return 'seoTitle: máximo 70 caracteres (recomendação SEO)'
  }

  // ── seoDescription ──────────────────────────────────────────────────────────
  if (body.seoDescription !== undefined && body.seoDescription.length > 160) {
    return 'seoDescription: máximo 160 caracteres (recomendação SEO)'
  }

  // ── tags ────────────────────────────────────────────────────────────────────
  if (body.tags !== undefined) {
    if (!Array.isArray(body.tags))     return 'tags deve ser um array'
    if (body.tags.length > 10)         return 'tags: máximo 10 tags por artigo'
    for (const tag of body.tags) {
      if (typeof tag !== 'string')     return 'tags: cada tag deve ser uma string'
      if (tag.length > 60)             return 'tags: cada tag pode ter no máximo 60 caracteres'
    }
  }

  // ── coverImage ──────────────────────────────────────────────────────────────
  if (body.coverImage !== undefined && body.coverImage.length > 2_048) {
    return 'coverImage: URL muito longa (máximo 2048 caracteres)'
  }

  return null
}
