// server/utils/rateLimiter.ts
// Rate limiting por IP — proteção básica contra brute force e abuso.
//
// IMPLEMENTAÇÃO: sliding window com Map em memória.
//
// LIMITAÇÃO IMPORTANTE (Vercel/serverless):
//   Cada cold start zera o store. Em alta concorrência com múltiplas
//   instâncias, requests podem cair em instâncias diferentes.
//   Para um painel admin de baixo tráfego, essa proteção é adequada.
//   Etapa futura: migrar para Vercel KV / Upstash Redis para state compartilhado.
//
// USO:
//   const ip = getClientIp(event)
//   if (!checkRateLimit(`login:${ip}`, 5, 60_000)) {
//     throw createError({ statusCode: 429, message: 'Muitas tentativas. Aguarde.' })
//   }

import type { H3Event } from 'h3'

interface RateEntry {
  count:       number
  windowStart: number
}

const store = new Map<string, RateEntry>()

// Limpeza quando store cresce demais (segurança contra memory leak)
const MAX_STORE_SIZE = 2_000

function maybeCleanup(windowMs: number): void {
  if (store.size < MAX_STORE_SIZE) return
  const cutoff = Date.now() - windowMs
  for (const [key, entry] of store) {
    if (entry.windowStart < cutoff) store.delete(key)
  }
}

/**
 * Verifica e registra uma tentativa no rate limiter.
 * Retorna `true` se a requisição está dentro do limite, `false` se deve ser bloqueada.
 *
 * @param key      Chave única — ex: `"login:192.168.1.1"`
 * @param limit    Número máximo de requisições na janela
 * @param windowMs Duração da janela em milissegundos
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  maybeCleanup(windowMs)

  const now   = Date.now()
  const entry = store.get(key)

  if (!entry || now - entry.windowStart > windowMs) {
    store.set(key, { count: 1, windowStart: now })
    return true
  }

  if (entry.count >= limit) return false

  entry.count++
  return true
}

/**
 * Retorna o IP do cliente respeitando proxies (X-Forwarded-For).
 * Em produção na Vercel, o IP real vem no header x-forwarded-for.
 */
export function getClientIp(event: H3Event): string {
  const forwarded = getHeader(event, 'x-forwarded-for')
  if (forwarded) {
    // x-forwarded-for pode conter múltiplos IPs: "client, proxy1, proxy2"
    // O primeiro é o cliente real
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  return getRequestIP(event) ?? 'unknown'
}
