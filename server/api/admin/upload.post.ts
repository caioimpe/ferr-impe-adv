// server/api/admin/upload.post.ts
// Upload de imagem de capa — protegido pelo middleware admin-auth.ts
//
// ⚠️  SOLUÇÃO LOCAL / TEMPORÁRIA
// ─────────────────────────────────────────────────────────────────────────────
// Este endpoint salva arquivos em public/images/artigos/ no servidor que
// executa o Nuxt. Isso funciona perfeitamente em desenvolvimento local, mas
// NÃO é adequado para produção na Vercel (ou qualquer plataforma serverless)
// pelos seguintes motivos:
//
//   1. O filesystem da Vercel é efêmero — arquivos gravados durante um deploy
//      são descartados a cada novo deploy.
//   2. Funções serverless podem rodar em instâncias diferentes; um arquivo
//      salvo em uma instância não fica visível em outra.
//
// SOLUÇÃO RECOMENDADA PARA PRODUÇÃO:
//   - Vercel Blob Storage  → https://vercel.com/docs/storage/vercel-blob
//   - Cloudinary           → https://cloudinary.com
//   - AWS S3 / R2 (Cloudflare)
//   Substitua o bloco `writeFile` abaixo pelo SDK do serviço escolhido e
//   retorne a URL pública fornecida por ele.
// ─────────────────────────────────────────────────────────────────────────────
import { readMultipartFormData } from 'h3'
import { writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const MAX_BYTES     = 5 * 1024 * 1024   // 5 MB

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png':  '.png',
  'image/webp': '.webp',
  'image/gif':  '.gif',
}

export default defineEventHandler(async (event) => {
  const parts = await readMultipartFormData(event)

  if (!parts?.length) {
    throw createError({ statusCode: 400, message: 'Nenhum arquivo enviado.' })
  }

  const filePart = parts.find(p => p.name === 'file')

  if (!filePart?.data?.length) {
    throw createError({ statusCode: 400, message: 'Campo "file" ausente ou vazio.' })
  }

  const mimeType = filePart.type ?? ''
  if (!ALLOWED_TYPES.has(mimeType)) {
    throw createError({
      statusCode: 400,
      message: 'Tipo não permitido. Use JPEG, PNG, WebP ou GIF.',
    })
  }

  if (filePart.data.length > MAX_BYTES) {
    throw createError({ statusCode: 400, message: 'Arquivo muito grande. Máximo: 5 MB.' })
  }

  const ext      = MIME_TO_EXT[mimeType] ?? '.jpg'
  const filename = `${randomUUID()}${ext}`
  const dir      = join(process.cwd(), 'public', 'images', 'artigos')

  // ⚠️ Gravação local — ver aviso no cabeçalho deste arquivo.
  await mkdir(dir, { recursive: true })
  await writeFile(join(dir, filename), filePart.data)

  return { url: `/images/artigos/${filename}` }
})
