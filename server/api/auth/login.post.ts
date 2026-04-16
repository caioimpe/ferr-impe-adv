// server/api/auth/login.post.ts
import { comparePassword, signAdminToken } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body     = await readBody<{ password?: string }>(event)
  const adminPwd = process.env.ADMIN_PASSWORD

  if (!adminPwd) {
    throw createError({ statusCode: 500, message: 'ADMIN_PASSWORD não configurado no servidor' })
  }

  if (!body.password || !comparePassword(body.password, adminPwd)) {
    // Mesmo erro para senha errada e campo vazio (não revela qual falhou)
    throw createError({ statusCode: 401, message: 'Credenciais inválidas' })
  }

  const token = signAdminToken()

  setCookie(event, 'admin_token', token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge:   60 * 60 * 24, // 24 horas
    path:     '/',
  })

  return { ok: true }
})
