-- Migration: init
-- Criada manualmente em 2026-04-22
-- Corresponde ao model Article em prisma/schema.prisma

-- CreateTable
CREATE TABLE "Article" (
    "id"             TEXT         NOT NULL,
    "slug"           TEXT         NOT NULL,
    "title"          TEXT         NOT NULL,
    "seoTitle"       TEXT         NOT NULL DEFAULT '',
    "seoDescription" TEXT         NOT NULL DEFAULT '',
    "excerpt"        TEXT         NOT NULL DEFAULT '',
    "category"       TEXT         NOT NULL DEFAULT '',
    "categorySlug"   TEXT         NOT NULL DEFAULT '',
    "readingTime"    INTEGER      NOT NULL DEFAULT 0,
    "coverImage"     TEXT,
    "content"        TEXT         NOT NULL,
    "tags"           TEXT[]       NOT NULL DEFAULT ARRAY[]::TEXT[],
    "status"         TEXT         NOT NULL DEFAULT 'draft',
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      TIMESTAMP(3) NOT NULL,
    "publishedAt"    TIMESTAMP(3),

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: slug deve ser único (uma URL por artigo)
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");

-- CreateIndex: filtro por status (draft / published)
CREATE INDEX "Article_status_idx" ON "Article"("status");

-- CreateIndex: filtro por categoria
CREATE INDEX "Article_categorySlug_idx" ON "Article"("categorySlug");

-- CreateIndex: ordenação por data de publicação (decrescente)
CREATE INDEX "Article_publishedAt_idx" ON "Article"("publishedAt" DESC);
