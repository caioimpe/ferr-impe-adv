// composables/useAdminAuth.ts
// Gerencia o estado de autenticação do painel administrativo.
// O estado é compartilhado entre todas as instâncias via useState.

export const useAdminAuth = () => {
  // null = não verificado ainda | true = autenticado | false = não autenticado
  const isAuthenticated = useState<boolean | null>('admin_auth', () => null)

  /**
   * Verifica a sessão chamando GET /api/auth/me.
   * Armazena o resultado no estado para evitar chamadas repetidas.
   */
  const checkAuth = async (): Promise<boolean> => {
    if (isAuthenticated.value !== null) return isAuthenticated.value === true

    try {
      await $fetch('/api/auth/me')
      isAuthenticated.value = true
      return true
    } catch {
      isAuthenticated.value = false
      return false
    }
  }

  /** Realiza login: envia senha para /api/auth/login. */
  const login = async (password: string): Promise<void> => {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body:   { password },
    })
    isAuthenticated.value = true
  }

  /** Realiza logout: limpa o cookie e redireciona para login. */
  const logout = async (): Promise<void> => {
    await $fetch('/api/auth/logout', { method: 'POST' })
    isAuthenticated.value = false
    await navigateTo('/admin/login')
  }

  return {
    isAuthenticated: readonly(isAuthenticated),
    checkAuth,
    login,
    logout,
  }
}
