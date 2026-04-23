// server/api/admin/upload.post.ts
// Upload de imagem de capa — protegido pelo middleware admin-auth.ts
//
// ─── Estratégia de armazenamento ─────────────────────────────────────────────
//
// PRODUÇÃO  (BLOB_READ_WRITE_TOKEN definido):
//   Usa Vercel Blob Storage — URLs públicas, persistentes e globalmente
//   distribuídas via CDN. Requer: npm install @vercel/blob
//   Configurar em: Vercel Dashboard → Storage → Blob → Connect to Project
//
// DESENVOLVIMENTO (BLOB_READ_WRITE_TOKEN ausente):
//   Fallback local — salva em public/images/artigos/.
//   Funciona apenas em localhost; não é persistente na Vercel.
//
// ─────────────────────────────────────────────────────────────────────────────

import { readMultipartFormData } from 'h3'
import { randomUUID } from 'node:crypto'
import { checkRateLimit, getClientIp } from '../../utils/rateLimiter'

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const MAX_BYTES     = 5 * 1024 * 1024   // 5 MB

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png':  '.png',
  'image/webp': '.webp',
  'image/gif':  '.gif',
}

// ─── Validação de magic bytes ────────────────────────────────────────────────
// Verifica a assinatura binária real do arquivo, independente do Content-Type
// declarado pelo cliente. Impede upload de arquivos mascarados como imagens.
function hasValidMagicBytes(data: Buffer, mimeType: string): boolean {
  if (data.length < 12) return false
  if (mimeType === 'image/jpeg') {
    return data[0] === 0xFF && data[1] === 0xD8 && data[2] === 0xFF
  }
  if (mimeType === 'image/png') {
    return (
      data[0] === 0x89 && data[1] === 0x50 &&
      data[2] === 0x4E && data[3] === 0x47
    )
  }
  if (mimeType === 'image/webp') {
    // RIFF????WEBP
    return (
      data[0] === 0x52 && data[1] === 0x49 && data[2] === 0x46 && data[3] === 0x46 &&
      data[8] === 0x57 && data[9] === 0x45 && data[10] === 0x42 && data[11] === 0x50
    )
  }
  if (mimeType === 'image/gif') {
    // GIF87a ou GIF89a
    return data[0] === 0x47 && data[1] === 0x49 && data[2] === 0x46
  }
  return false
}

export default defineEventHandler(async (event) => {
  // Rate limiting: 20 uploads por IP por hora
  const ip = getClientIp(event)
  if (!checkRateLimit(`upload:${ip}`, 20, 60 * 60_000)) {
    throw createError({
      statusCode: 429,
      message: 'Limite de uploads atingido. Aguarde antes de enviar mais imagens.',
    })
  }

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

  // Verificação de magic bytes — garante que o conteúdo real corresponde ao tipo declarado
  if (!hasValidMagicBytes(filePart.data, mimeType)) {
    throw createError({
      statusCode: 400,
      message: 'Arquivo inválido: o conteúdo não corresponde ao tipo de imagem declarado.',
    })
  }

  const ext      = MIME_TO_EXT[mimeType] ?? '.jpg'
  const filename = `artigos/${randomUUID()}${ext}`

  // ─── PRODUÇÃO: Vercel Blob ────────────────────────────────────────────────
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import('@vercel/blob')
    const blob    = await put(filename, filePart.data, {
      access:      'public',
      contentType: mimeType,
    })
    return { url: blob.url }
  }

  // ─── PRODUÇÃO sem token: falha explícita ──────────────────────────────────
  // Na Vercel, o filesystem é efêmero — arquivos gravados somem no próximo
  // deploy. Em vez de silenciosamente persistir uma URL quebrada, falhamos
  // com uma mensagem clara para o administrador configurar o token.
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    throw createError({
      statusCode: 503,
      message:
        'Upload de imagens desativado: configure a variável BLOB_READ_WRITE_TOKEN ' +
        'no painel da Vercel (Storage → Blob → Connect to Project) para habilitar o armazenamento.',
    })
  }

  // ─── DESENVOLVIMENTO: fallback filesystem local ───────────────────────────
  // ⚠️  Arquivos gravados aqui NÃO persistem na Vercel.
  //     Configure BLOB_READ_WRITE_TOKEN para usar Vercel Blob em produção.
  const { writeFile, mkdir } = await import('node:fs/promises')
  const { join }             = await import('node:path')
  const dir                  = join(process.cwd(), 'public', 'images', 'artigos')
  const localFilename        = `${randomUUID()}${ext}`

  await mkdir(dir, { recursive: true })
  await writeFile(join(dir, localFilename), filePart.data)

  return { url: `/images/artigos/${localFilename}` }
})
