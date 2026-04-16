// server/middleware/admin-auth.ts
// Protege TODOS os endpoints /api/admin/** exigindo um token de admin válido.
// A validação é feita no servidor — não pode ser bypassada pelo cliente.

import { verifyAdminToken } from '../utils/auth'

export default defineEventHandler((event) => {
  const path = getRequestURL(event).pathname
  if (!path.startsWith('/api/admin')) return

  const token = getCookie(event, 'admin_token')

  if (!token || !verifyAdminToken(token)) {
    throw createError({ statusCode: 401, message: 'Não autorizado' })
  }
})
