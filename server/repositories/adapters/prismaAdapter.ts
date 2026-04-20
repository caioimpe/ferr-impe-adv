// server/repositories/adapters/prismaAdapter.ts
// Adaptador Postgres via Prisma — usado quando DATABASE_URL está definida.
//
// PRODUÇÃO: esta é a implementação definitiva.
//           Requer: npm install prisma @prisma/client
//           e DATABASE_URL configurada.
//
// Não importe este arquivo diretamente — use articlesRepository.ts.

import { prisma } from '../../utils/prismaClient'
import type { Article, ArticleInput, ArticleStatus, Category } from '../../../types/article'
import type { ArticleRepositoryAdapter } from '../articlesRepository'
import type { Prisma } from '@prisma/client'

// ─── Mapeamento: linha do banco → tipo Article ───────────────────────────────

type PrismaArticleRow = Awaited<ReturnType<typeof prisma.article.findUniqueOrThrow>>

function mapRow(row: PrismaArticleRow): Article {
  const publishedAt = row.publishedAt?.toISOString()
  const createdAt   = row.createdAt.toISOString()

  return {
    id:             row.id,
    slug:           row.slug,
    title:          row.title,
    seoTitle:       row.seoTitle,
    seoDescription: row.seoDescription,
    excerpt:        row.excerpt,
    category:       row.category,
    categorySlug:   row.categorySlug,
    readingTime:    row.readingTime,
    coverImage:     row.coverImage ?? undefined,
    content:        row.content,
    tags:           row.tags,
    status:         row.status as ArticleStatus,
    createdAt,
    updatedAt:      row.updatedAt.toISOString(),
    publishedAt,
    // date deriva de publishedAt ?? createdAt (campo público de exibição)
    date:           (row.publishedAt ?? row.createdAt).toISOString().split('T')[0]!,
  }
}

// ─── Implementação ────────────────────────────────────────────────────────────

export const prismaAdapter: ArticleRepositoryAdapter = {

  async getAllArticles(onlyPublished = false): Promise<Article[]> {
    const where: Prisma.ArticleWhereInput = onlyPublished ? { status: 'published' } : {}
    const rows = await prisma.article.findMany({
      where,
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    })
    return rows.map(mapRow)
  },

  async getArticleById(id: string): Promise<Article | null> {
    const row = await prisma.article.findUnique({ where: { id } })
    return row ? mapRow(row) : null
  },

  async getArticleBySlug(slug: string, onlyPublished = true): Promise<Article | null> {
    const where: Prisma.ArticleWhereInput = onlyPublished
      ? { slug, status: 'published' }
      : { slug }
    const row = await prisma.article.findFirst({ where })
    return row ? mapRow(row) : null
  },

  async saveArticle(input: ArticleInput): Promise<Article> {
    const now = new Date()

    if (input.id) {
      const existing = await prisma.article.findUnique({ where: { id: input.id } })
      if (!existing) {
        throw createError({ statusCode: 404, message: 'Artigo não encontrado' })
      }

      // Ao publicar pela primeira vez, registra publishedAt; ao despublicar, preserva.
      const publishedAt = input.status === 'published'
        ? (existing.publishedAt ?? now)
        : existing.publishedAt

      const row = await prisma.article.update({
        where: { id: input.id },
        data: {
          slug:           input.slug,
          title:          input.title,
          seoTitle:       input.seoTitle       ?? '',
          seoDescription: input.seoDescription ?? '',
          excerpt:        input.excerpt        ?? '',
          category:       input.category       ?? '',
          categorySlug:   input.categorySlug   ?? '',
          readingTime:    input.readingTime     ?? 0,
          coverImage:     input.coverImage      ?? null,
          content:        input.content,
          tags:           input.tags            ?? [],
          status:         input.status,
          updatedAt:      now,
          publishedAt,
        },
      })
      return mapRow(row)
    }

    // Novo artigo
    const publishedAt = input.status === 'published' ? now : null
    const row = await prisma.article.create({
      data: {
        slug:           input.slug,
        title:          input.title,
        seoTitle:       input.seoTitle       ?? '',
        seoDescription: input.seoDescription ?? '',
        excerpt:        input.excerpt        ?? '',
        category:       input.category       ?? '',
        categorySlug:   input.categorySlug   ?? '',
        readingTime:    input.readingTime     ?? 0,
        coverImage:     input.coverImage      ?? null,
        content:        input.content,
        tags:           input.tags            ?? [],
        status:         input.status,
        createdAt:      now,
        updatedAt:      now,
        publishedAt,
      },
    })
    return mapRow(row)
  },

  async deleteArticle(id: string): Promise<void> {
    await prisma.article.delete({ where: { id } })
  },

  async getCategories(onlyPublished = true): Promise<Category[]> {
    const where: Prisma.ArticleWhereInput = onlyPublished ? { status: 'published' } : {}
    const rows = await prisma.article.groupBy({
      by: ['category', 'categorySlug'],
      where,
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    })
    return rows.map(r => ({
      name:  r.category,
      slug:  r.categorySlug,
      count: r._count.id,
    }))
  },
}
