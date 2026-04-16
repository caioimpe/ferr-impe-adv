// utils/articles.ts
// Funções auto-importadas pelo Nuxt em toda a aplicação
// Os dados são lidos via useArticleStore (localStorage).
// Este arquivo mantém apenas o helper de data como função pura.
export type { Article, Category } from '~/types/article'

export function formatDate(dateString: string): string {
  const date = new Date(`${dateString}T12:00:00`)
  return date.toLocaleDateString('pt-BR', {
    day:   'numeric',
    month: 'long',
    year:  'numeric',
  })
}
