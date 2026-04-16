// middleware/admin.ts
// Guarda de rota client-side para o painel /admin.
// A segurança REAL é garantida pelo server/middleware/admin-auth.ts —
// este middleware apenas fornece experiência de usuário (evita flicker).

export default defineNuxtRouteMiddleware(async (to) => {
  // A rota de login não precisa de autenticação
  if (to.path === '/admin/login') return

  const { checkAuth } = useAdminAuth()
  const authenticated  = await checkAuth()

  if (!authenticated) {
    return navigateTo('/admin/login', { replace: true })
  }
})
