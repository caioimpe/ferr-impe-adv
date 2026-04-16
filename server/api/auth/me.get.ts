// server/api/auth/me.get.ts
// Verifica se a sessão atual é válida — usada pelo middleware cliente.
import { verifyAdminToken } from '../../utils/auth'

export default defineEventHandler((event) => {
  const token = getCookie(event, 'admin_token')

  if (!token || !verifyAdminToken(token)) {
    throw createError({ statusCode: 401, message: 'Não autenticado' })
  }

  return { role: 'admin' }
})
