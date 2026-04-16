<template>
  <div class="min-h-screen flex flex-col bg-[#f7f6f4]">

    <!-- ─── Header do painel ────────────────────────────────────── -->
    <header class="bg-brand-green border-b border-brand-gold/15 sticky top-0 z-40">
      <div class="container-site h-[4rem] flex items-center justify-between gap-6">

        <!-- Identidade -->
        <div class="flex items-center gap-4">
          <NuxtLink to="/admin" class="flex items-center gap-3">
            <div class="flex flex-col leading-none">
              <span class="text-[0.55rem] font-subheading tracking-[0.2em] uppercase text-brand-gold/60">Ferrigato & Imperato</span>
              <span class="text-[0.7rem] font-subheading tracking-[0.15em] uppercase text-white/80">Painel Editorial</span>
            </div>
          </NuxtLink>

          <div class="w-px h-4 bg-brand-gold/20" aria-hidden="true" />

          <nav class="hidden sm:flex items-center gap-6">
            <NuxtLink
              to="/admin"
              class="text-[0.62rem] font-subheading tracking-widest uppercase transition-colors"
              :class="$route.path === '/admin' ? 'text-brand-gold' : 'text-white/50 hover:text-white/80'"
            >
              Artigos
            </NuxtLink>
            <NuxtLink
              to="/admin/artigos/novo"
              class="text-[0.62rem] font-subheading tracking-widest uppercase transition-colors"
              :class="$route.path === '/admin/artigos/novo' ? 'text-brand-gold' : 'text-white/50 hover:text-white/80'"
            >
              + Novo Artigo
            </NuxtLink>
          </nav>
        </div>

        <!-- Ações -->
        <div class="flex items-center gap-4">
          <NuxtLink
            to="/artigos"
            target="_blank"
            class="hidden sm:flex items-center gap-1.5 text-[0.6rem] font-subheading tracking-widest uppercase text-white/35 hover:text-brand-gold/70 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Ver site
          </NuxtLink>

          <button
            class="text-[0.6rem] font-subheading tracking-widest uppercase text-white/35 hover:text-red-400 transition-colors"
            @click="auth.logout"
          >
            Sair
          </button>
        </div>

      </div>
    </header>

    <!-- ─── Conteúdo ───────────────────────────────────────────── -->
    <main class="flex-1">
      <slot />
    </main>

  </div>
</template>

<script setup lang="ts">
const auth = useAdminAuth()
</script>
