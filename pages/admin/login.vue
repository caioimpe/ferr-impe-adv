<template>
  <div class="min-h-screen bg-brand-green flex flex-col items-center justify-center px-4">

    <!-- Card de login -->
    <div class="w-full max-w-sm flex flex-col gap-8">

      <!-- Identidade -->
      <div class="flex flex-col gap-1.5 text-center">
        <div class="flex items-center justify-center gap-4 mb-4">
          <div class="w-8 h-px bg-brand-gold/30" aria-hidden="true" />
          <div class="w-1.5 h-1.5 rounded-full bg-brand-gold/40" aria-hidden="true" />
          <div class="w-8 h-px bg-brand-gold/30" aria-hidden="true" />
        </div>
        <p class="label-institutional">Ferrigato & Imperato Advogados</p>
        <h1 class="font-heading text-[1.6rem] text-white leading-snug">
          Painel Editorial
        </h1>
        <p class="text-[0.72rem] font-body text-white/40 mt-1">
          Acesso restrito ao administrador do site.
        </p>
      </div>

      <!-- Formulário -->
      <form class="flex flex-col gap-4" @submit.prevent="handleLogin">

        <div class="flex flex-col gap-1.5">
          <label for="password" class="text-[0.6rem] font-subheading tracking-widest uppercase text-white/50">
            Senha de acesso
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
            placeholder="••••••••••••"
            class="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 px-4 py-3.5 text-[0.875rem] font-body focus:border-brand-gold/50 focus:outline-none transition-colors"
            :class="{ 'border-red-400/60': error }"
          />
        </div>

        <p v-if="error" class="text-[0.68rem] font-body text-red-400">
          {{ error }}
        </p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3.5 bg-brand-gold text-brand-green text-[0.65rem] font-subheading font-bold tracking-widest uppercase hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>

      </form>

      <!-- Rodapé -->
      <p class="text-center text-[0.58rem] font-body text-white/20">
        Área privada — não compartilhar credenciais
      </p>

    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

useSeoMeta({ title: 'Painel Editorial | Ferrigato & Imperato', robots: 'noindex, nofollow' })

const auth     = useAdminAuth()
const password = ref('')
const error    = ref('')
const loading  = ref(false)

// Se já estiver autenticado, redireciona direto para o painel
onMounted(async () => {
  const ok = await auth.checkAuth()
  if (ok) await navigateTo('/admin', { replace: true })
})

async function handleLogin(): Promise<void> {
  error.value   = ''
  loading.value = true

  try {
    await auth.login(password.value)
    await navigateTo('/admin', { replace: true })
  } catch (e: unknown) {
    const msg = (e as { data?: { message?: string } })?.data?.message
    error.value = msg ?? 'Credenciais inválidas. Tente novamente.'
  } finally {
    loading.value = false
    password.value = ''
  }
}
</script>
