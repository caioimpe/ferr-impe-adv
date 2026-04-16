<template>
  <footer class="bg-brand-green text-white">

    <!-- Seção principal do footer -->
    <div class="container-site py-14 grid grid-cols-1 md:grid-cols-3 gap-12">

      <!-- Coluna 1: Identidade -->
      <div class="flex flex-col gap-5">
        <!-- Logo vertical clara — fundo escuro -->
        <img
          src="/images/logo/logo-vertical-light.png"
          alt="Ferrigato & Imperato Advogados"
          class="w-[200px] h-auto object-contain"
          width="200"
          height="120"
        />
        <p class="text-sm font-body text-white/60 leading-relaxed max-w-xs">
          Assessoria jurídica especializada com rigor técnico,
          ética e compromisso com os resultados dos nossos clientes.
        </p>
      </div>

      <!-- Coluna 2: Navegação -->
      <div class="flex flex-col gap-3">
        <p class="label-institutional mb-2">Navegação</p>
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="text-sm font-body text-white/60 hover:text-brand-gold transition-colors"
        >
          {{ item.label }}
        </NuxtLink>
      </div>

      <!-- Coluna 3: Contato -->
      <div class="flex flex-col gap-3">
        <p class="label-institutional mb-2">Contato</p>
        <address class="not-italic flex flex-col gap-2 text-sm font-body text-white/60 leading-relaxed">
          <span>Rua Carlos de Campos, 224</span>
          <span>Vila Teixeira — Salto/SP</span>
          <span>CEP 13.320-352</span>
          <a
            href="tel:+5511934764353"
            class="mt-2 hover:text-brand-gold transition-colors"
          >
            (11) 93476-4353
          </a>
          <a
            href="mailto:atendimento@ferrigatoeimperato.com.br"
            class="hover:text-brand-gold transition-colors break-all"
          >
            atendimento@ferrigatoeimperato.com.br
          </a>
        </address>
      </div>

    </div>

    <!-- Linha dourada divisória -->
    <div class="divider-gold opacity-30" />

    <!-- Rodapé legal -->
    <div class="container-site py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
      <p class="text-xs font-body text-white/40">
        &copy; {{ currentYear }} Ferrigato &amp; Imperato Advogados. Todos os direitos reservados.
      </p>
      <p class="text-xs font-body text-white/30">
        OAB/SP — Advocacia responsável e ética
      </p>
    </div>

  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()

const navItems = [
  { label: 'Início',             to: '/' },
  { label: 'Quem Somos',         to: '/quem-somos' },
  { label: 'Sobre o Escritório', to: '/sobre' },
  { label: 'Áreas de Atuação',   to: '/areas-de-atuacao' },
  { label: 'Artigos',            to: '/artigos' },
  { label: 'Contato',            to: '/contato' },
]
</script>
