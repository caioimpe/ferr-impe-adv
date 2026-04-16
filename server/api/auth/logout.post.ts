// server/api/auth/logout.post.ts
export default defineEventHandler((event) => {
  deleteCookie(event, 'admin_token', {
    httpOnly: true,
    path:     '/',
  })
  return { ok: true }
})
