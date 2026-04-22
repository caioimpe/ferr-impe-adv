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

// ─── Tratamento de erros Prisma ───────────────────────────────────────────────
//
// Converte erros do Prisma em createError com mensagens seguras (sem expor
// detalhes internos de conexão, query ou schema ao cliente).

function handlePrismaError(err: unknown, context: string): never {
  // Erros tipados do Prisma
  if (err && typeof err === 'object' && 'code' in err) {
    const code = (err as { code: string }).code

    if (code === 'P1001' || code === 'P1002') {
      // Não consegue alcançar o servidor de banco de dados
      console.error(`[Prisma:${context}] Erro de conexão (${code}):`, err)
      throw createError({ statusCode: 503, message: 'Banco de dados temporariamente indisponível.' })
    }

    if (code === 'P2021' || code === 'P2022') {
      // Tabela ou coluna não existe — migration não foi rodada
      console.error(`[Prisma:${context}] Tabela inexistente (${code}):`, err)
      throw createError({ statusCode: 503, message: 'Estrutura do banco desatualizada. Verifique as migrations.' })
    }

    if (code === 'P2002') {
      // Violação de unique constraint (ex: slug duplicado)
      throw createError({ statusCode: 409, message: 'Já existe um artigo com este slug.' })
    }

    if (code === 'P2025') {
      // Registro não encontrado em operação de update/delete
      throw createError({ statusCode: 404, message: 'Artigo não encontrado.' })
    }
  }

  // Erro desconhecido — loga e retorna 500 sem expor detalhes internos
  console.error(`[Prisma:${context}] Erro inesperado:`, err)
  throw createError({ statusCode: 500, message: 'Erro interno ao acessar o banco de dados.' })
}

// ─── Implementação ────────────────────────────────────────────────────────────

export const prismaAdapter: ArticleRepositoryAdapter = {

  async getAllArticles(onlyPublished = false): Promise<Article[]> {
    try {
      const where: Prisma.ArticleWhereInput = onlyPublished ? { status: 'published' } : {}
      const rows = await prisma.article.findMany({
        where,
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      })
      return rows.map(mapRow)
    } catch (err) {
      handlePrismaError(err, 'getAllArticles')
    }
  },

  async getArticleById(id: string): Promise<Article | null> {
    try {
      const row = await prisma.article.findUnique({ where: { id } })
      return row ? mapRow(row) : null
    } catch (err) {
      handlePrismaError(err, 'getArticleById')
    }
  },

  async getArticleBySlug(slug: string, onlyPublished = true): Promise<Article | null> {
    try {
      const where: Prisma.ArticleWhereInput = onlyPublished
        ? { slug, status: 'published' }
        : { slug }
      const row = await prisma.article.findFirst({ where })
      return row ? mapRow(row) : null
    } catch (err) {
      handlePrismaError(err, 'getArticleBySlug')
    }
  },

  async saveArticle(input: ArticleInput): Promise<Article> {
    try {
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
    } catch (err) {
      // Re-lança createError diretamente (ex: 404 acima) sem envolver em handlePrismaError
      if (err && typeof err === 'object' && 'statusCode' in err) throw err
      handlePrismaError(err, 'saveArticle')
    }
  },

  async deleteArticle(id: string): Promise<void> {
    try {
      await prisma.article.delete({ where: { id } })
    } catch (err) {
      handlePrismaError(err, 'deleteArticle')
    }
  },

  async getCategories(onlyPublished = true): Promise<Category[]> {
    try {
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
    } catch (err) {
      handlePrismaError(err, 'getCategories')
    }
  },
}
    return rows.map(r => ({
      name:  r.category,
      slug:  r.categorySlug,
      count: r._count.id,
    }))
  },
}
