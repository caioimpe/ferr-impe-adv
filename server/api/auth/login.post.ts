// server/api/auth/login.post.ts
import { comparePassword, signAdminToken } from '../../utils/auth'
import { checkRateLimit, getClientIp } from '../../utils/rateLimiter'

// Contas de administrador aceitas (e-mail + senha), configuradas via variáveis de ambiente.
function getAdminAccounts(): Array<{ email: string; password: string }> {
  const accounts = [
    { email: process.env.ADMIN_EMAIL_1, password: process.env.ADMIN_PASSWORD_1 },
    { email: process.env.ADMIN_EMAIL_2, password: process.env.ADMIN_PASSWORD_2 },
  ]

  return accounts.filter(
    (a): a is { email: string; password: string } => Boolean(a.email && a.password),
  )
}

export default defineEventHandler(async (event) => {
  // Rate limiting: 5 tentativas por IP a cada 60 segundos
  const ip = getClientIp(event)
  if (!checkRateLimit(`login:${ip}`, 5, 60_000)) {
    throw createError({
      statusCode: 429,
      message: 'Muitas tentativas de login. Aguarde 1 minuto.',
    })
  }

  const body     = await readBody<{ email?: string; password?: string }>(event)
  const accounts = getAdminAccounts()

  if (!accounts.length) {
    throw createError({ statusCode: 500, message: 'Contas de administrador não configuradas no servidor' })
  }

  const email   = body.email?.trim().toLowerCase() ?? ''
  const account = accounts.find((a) => a.email.trim().toLowerCase() === email)

  if (!email || !body.password || !account || !comparePassword(body.password, account.password)) {
    // Mesmo erro para credenciais erradas e campos vazios (não revela qual falhou)
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
