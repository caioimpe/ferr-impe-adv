// server/api/auth/logout.post.ts
export default defineEventHandler((event) => {
  deleteCookie(event, 'admin_token', {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path:     '/',
  })
  return { ok: true }
})
