// types/article.ts
// Tipos canônicos da área editorial

export type ArticleStatus = 'draft' | 'published'

export interface Article {
  id:             string
  slug:           string
  title:          string
  seoTitle:       string
  seoDescription: string
  excerpt:        string
  category:       string
  categorySlug:   string
  /** Data de exibição pública (YYYY-MM-DD) — derivada de publishedAt ?? createdAt */
  date:           string
  readingTime:    number
  coverImage?:    string      // path relativo ou URL externa
  content:        string      // HTML
  tags?:          string[]
  status:         ArticleStatus
  createdAt:      string      // ISO datetime
  updatedAt:      string      // ISO datetime
  publishedAt?:   string      // ISO datetime — definido ao publicar
}

export interface Category {
  name:  string
  slug:  string
  count: number
}

/** Campos necessários para criar/editar um artigo via API */
export type ArticleInput = Omit<Article, 'id' | 'date' | 'createdAt' | 'updatedAt' | 'publishedAt'> & {
  id?: string
}
