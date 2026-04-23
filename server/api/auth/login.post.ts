// server/api/auth/login.post.ts
import { comparePassword, signAdminToken } from '../../utils/auth'
import { checkRateLimit, getClientIp } from '../../utils/rateLimiter'

export default defineEventHandler(async (event) => {
  // Rate limiting: 5 tentativas por IP a cada 60 segundos
  const ip = getClientIp(event)
  if (!checkRateLimit(`login:${ip}`, 5, 60_000)) {
    throw createError({
      statusCode: 429,
      message: 'Muitas tentativas de login. Aguarde 1 minuto.',
    })
  }

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
