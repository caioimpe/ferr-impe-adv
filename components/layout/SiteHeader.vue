<template>
  <header
    class="w-full bg-brand-green"
    :class="scrolled ? 'border-b border-brand-gold/30 shadow-lg shadow-black/20' : 'border-b border-brand-gold/15'"
  >
    <!-- Faixa superior decorativa em dourado — 1px de altura, muito sutil -->
    <div class="w-full h-px bg-brand-gold/40" aria-hidden="true" />

    <div class="container-site flex items-center h-[4.5rem] gap-0">

      <!-- Logo horizontal clara — fundo escuro -->
      <NuxtLink to="/" class="flex-shrink-0" aria-label="Ferrigato & Imperato Advogados — Página Inicial">
        <img
          src="/images/logo/logo-horizontal-light.png"
          alt="Ferrigato & Imperato Advogados"
          class="h-[2.6rem] w-auto object-contain"
          width="370"
          height="42"
        />
      </NuxtLink>

      <!-- Separador vertical entre logo e nav -->
      <div class="hidden md:block w-px h-5 bg-brand-gold/25 mx-9 flex-shrink-0" aria-hidden="true" />

      <!-- Links de navegação desktop -->
      <nav aria-label="Menu principal" class="hidden md:flex items-center gap-8">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="relative text-[0.8rem] font-subheading font-medium text-white/60 hover:text-white/90 tracking-[0.06em] transition-colors duration-200 group pb-px"
          active-class="!text-brand-gold"
        >
          {{ item.label }}
          <!-- underline animado no hover -->
          <span class="absolute -bottom-px left-0 w-0 h-px bg-brand-gold/70 group-hover:w-full transition-all duration-300" aria-hidden="true" />
          <!-- ponto fixo no estado ativo -->
          <span class="absolute -bottom-[3px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-gold opacity-0 [.router-link-exact-active_&]:opacity-100" aria-hidden="true" />
        </NuxtLink>
      </nav>

      <!-- CTA à direita -->
      <NuxtLink
        to="/contato"
        class="hidden md:inline-flex ml-auto items-center px-[1.1rem] py-[0.45rem] border border-brand-gold/50 text-brand-gold text-[0.7rem] font-subheading font-semibold tracking-[0.12em] uppercase hover:bg-brand-gold hover:border-brand-gold hover:text-brand-green transition-all duration-200"
      >
        Fale Conosco
      </NuxtLink>

      <!-- Menu mobile (botão) -->
      <button
        class="md:hidden flex flex-col gap-1.5 p-2"
        aria-label="Abrir menu"
        @click="mobileOpen = !mobileOpen"
      >
        <span class="block w-6 h-px bg-white transition-all duration-200" :class="{ 'rotate-45 translate-y-2': mobileOpen }" />
        <span class="block w-6 h-px bg-white transition-all duration-200" :class="{ 'opacity-0': mobileOpen }" />
        <span class="block w-6 h-px bg-white transition-all duration-200" :class="{ '-rotate-45 -translate-y-2': mobileOpen }" />
      </button>

    </div>

    <!-- Menu mobile (dropdown) -->
    <Transition name="slide-down">
      <nav
        v-if="mobileOpen"
        aria-label="Menu mobile"
        class="md:hidden bg-brand-green border-t border-brand-gold/20 px-6 py-4 flex flex-col gap-4"
      >
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="text-sm font-subheading font-medium text-white/80 hover:text-brand-gold transition-colors"
          active-class="text-brand-gold"
          @click="mobileOpen = false"
        >
          {{ item.label }}
        </NuxtLink>
        <NuxtLink
          to="/contato"
          class="mt-2 px-5 py-2 border border-brand-gold text-brand-gold text-sm font-subheading font-semibold text-center hover:bg-brand-gold hover:text-brand-green transition-all duration-200"
          @click="mobileOpen = false"
        >
          Fale Conosco
        </NuxtLink>
      </nav>
    </Transition>
  </header>
</template>

<script setup lang="ts">
const mobileOpen = ref(false)
const scrolled    = ref(false)

const navItems = [
  { label: 'Início',             to: '/' },
  { label: 'Quem Somos',         to: '/quem-somos' },
  { label: 'Sobre o Escritório', to: '/sobre' },
  { label: 'Áreas de Atuação',   to: '/areas-de-atuacao' },
  { label: 'Artigos',            to: '/artigos' },
]

onMounted(() => {
  window.addEventListener('scroll', () => {
    scrolled.value = window.scrollY > 20
  })
})
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
