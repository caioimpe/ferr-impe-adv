// server/utils/prismaClient.ts
// ─────────────────────────────────────────────────────────────────────────────
// Singleton do PrismaClient para uso exclusivo no servidor.
//
// REGRA DE SEGURANÇA: NUNCA importe este arquivo em pages/, components/ ou
// composables/. O Nuxt 3 separará o bundle automaticamente, mas é uma boa
// prática manter a convenção explícita.
//
// O padrão globalThis evita instanciar múltiplos clientes durante hot-reload
// em desenvolvimento (onde o módulo pode ser re-avaliado pelo Vite/Nitro).
// ─────────────────────────────────────────────────────────────────────────────

import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var __prismaClient: PrismaClient | undefined
}

function createClient(): PrismaClient {
  return new PrismaClient({
    // Em desenvolvimento: loga erros e warnings sem poluir com queries
    log: process.env.NODE_ENV === 'development'
      ? ['error', 'warn']
      : ['error'],
  })
}

// Reutiliza a instância existente em dev (hot-reload) ou cria uma nova
export const prisma: PrismaClient =
  globalThis.__prismaClient ?? (globalThis.__prismaClient = createClient())
