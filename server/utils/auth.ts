// server/utils/auth.ts
// Implementação de JWT simples usando apenas módulos nativos do Node.js
// Sem dependências externas.

import { createHmac, timingSafeEqual } from 'node:crypto'

const TOKEN_EXPIRY_SECONDS = 60 * 60 * 24 // 24 horas

function getSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET deve ter no mínimo 32 caracteres. Configure no arquivo .env')
  }
  return secret
}

/** Gera um token JWT HS256 com payload de administrador. */
export function signAdminToken(): string {
  const secret  = getSecret()
  const header  = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const payload = Buffer.from(JSON.stringify({
    role: 'admin',
    iat:  Math.floor(Date.now() / 1000),
    exp:  Math.floor(Date.now() / 1000) + TOKEN_EXPIRY_SECONDS,
  })).toString('base64url')

  const sig = createHmac('sha256', secret)
    .update(`${header}.${payload}`)
    .digest('base64url')

  return `${header}.${payload}.${sig}`
}

/** Verifica se o token é válido e não expirou. */
export function verifyAdminToken(token: string): boolean {
  try {
    const secret = getSecret()
    const parts  = token.split('.')
    if (parts.length !== 3) return false

    const [header, body, sig] = parts as [string, string, string]

    const expectedSig = createHmac('sha256', secret)
      .update(`${header}.${body}`)
      .digest('base64url')

    // Comparação em tempo constante para evitar timing attacks
    const sigBuf = Buffer.from(sig,         'base64url')
    const expBuf = Buffer.from(expectedSig, 'base64url')
    if (sigBuf.length !== expBuf.length) return false
    if (!timingSafeEqual(sigBuf, expBuf))  return false

    const decoded = JSON.parse(Buffer.from(body, 'base64url').toString())
    return decoded.role === 'admin' && decoded.exp > Math.floor(Date.now() / 1000)
  } catch {
    return false
  }
}

/** Compara senha usando HMAC antes do timingSafeEqual para neutralizar ataques de timing por comprimento. */
export function comparePassword(provided: string, expected: string): boolean {
  // Deriva HMAC 32 bytes de cada input — ambos ficam com comprimento fixo
  const salt = 'fi_pw_salt'
  const a = createHmac('sha256', salt).update(provided).digest()
  const b = createHmac('sha256', salt).update(expected).digest()
  return timingSafeEqual(a, b)
}
