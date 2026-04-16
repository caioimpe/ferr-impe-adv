// utils/slugify.ts
// Auto-importado pelo Nuxt em toda a aplicação

/**
 * Converte uma string em slug URL-friendly.
 * Ex: "Direito Civil" → "direito-civil"
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacríticos
    .replace(/[^a-z0-9\s-]/g, '')    // remove caracteres especiais
    .trim()
    .replace(/\s+/g, '-')            // espaços → hífen
    .replace(/-+/g, '-')             // hífens múltiplos → único
}
