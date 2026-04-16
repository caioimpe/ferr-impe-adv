<template>
  <!-- Hero principal — fundo verde escuro com acento dourado -->
  <section class="bg-brand-green min-h-[calc(100vh-4.5rem)] flex items-center relative overflow-hidden">

    <!-- Textura sutil de fundo (opcional — substitua por imagem institucional) -->
    <!--
      Para usar imagem de fundo:
      Arquivo esperado: /public/images/hero-bg.jpg
      Descomente e ajuste o estilo abaixo:
    -->
    <!--
    <div
      class="absolute inset-0 bg-cover bg-center opacity-10"
      style="background-image: url('/images/hero-bg.jpg')"
      aria-hidden="true"
    />
    -->

    <!-- Linha vertical decorativa em dourado -->
    <div
      class="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-brand-gold/30 to-transparent"
      aria-hidden="true"
    />

    <div class="container-site relative z-10 py-14 lg:py-16 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

      <!-- Conteúdo textual principal -->
      <div class="flex flex-col gap-5">

        <!-- Label institucional -->
        <div class="flex items-center gap-3">
          <div class="w-8 h-px bg-brand-gold" aria-hidden="true" />
          <p class="label-institutional">Advocacia &amp; Consultoria Jurídica</p>
        </div>

        <h1 class="text-[2.4rem] lg:text-[3rem] font-heading text-white leading-[1.18] tracking-tight">
          Soluções jurídicas com<br />
          <em class="not-italic text-brand-gold">rigor, ética</em> e<br />
          comprometimento.
        </h1>

        <div class="w-8 h-px bg-brand-gold/50" aria-hidden="true" />

        <p class="text-[0.875rem] font-body text-white/50 leading-[1.85] max-w-[22rem]">
          Assessoria jurídica especializada para pessoas e empresas.
          Atuação técnica, personalizada e orientada a resultados.
        </p>

        <div class="flex flex-wrap gap-3 pt-4">
          <NuxtLink
            to="/contato"
            class="inline-block px-7 py-3 bg-brand-gold text-brand-green text-xs font-subheading font-bold tracking-widest uppercase hover:brightness-110 transition-all duration-200"
          >
            Agendar Consulta
          </NuxtLink>
          <NuxtLink
            to="/areas-de-atuacao"
            class="inline-block px-7 py-3 border border-white/20 text-white/70 text-xs font-subheading font-medium tracking-widest uppercase hover:border-brand-gold/60 hover:text-brand-gold transition-all duration-200"
          >
            Especialidades
          </NuxtLink>
        </div>

      </div>

      <!-- Bloco institucional de autoridade -->
      <div class="hidden lg:flex flex-col justify-center gap-7 border-l border-brand-gold/20 pl-10">

        <p class="label-institutional">O Escritório</p>

        <div class="flex flex-col gap-4">
          <blockquote class="text-[1.3rem] font-heading text-white/90 leading-[1.45]">
            Advocacia que une<br />
            <span class="text-brand-gold">técnica e humanidade</span><br />
            em cada caso.
          </blockquote>
          <p class="text-[0.8rem] font-body text-white/45 leading-[1.8] max-w-[17rem]">
            Atuamos em direito civil, trabalhista, empresarial e previdenciário,
            com atendimento presencial em Salto/SP e online em todo o Brasil.
          </p>
        </div>

        <!-- Linha divisória tênue -->
        <div class="w-full h-px bg-brand-gold/10" aria-hidden="true" />

        <!-- Credenciais institucionais -->
        <div class="grid grid-cols-2 gap-x-6 gap-y-4">
          <div v-for="cred in credentials" :key="cred.label" class="flex flex-col gap-0.5">
            <p class="text-[0.75rem] font-subheading font-semibold text-brand-gold/90 tracking-wider">{{ cred.value }}</p>
            <p class="text-[0.7rem] font-body text-white/35 tracking-wide">{{ cred.label }}</p>
          </div>
        </div>

      </div>

    </div>

    <!-- Linha de rodapé dourada do hero -->
    <div
      class="absolute bottom-0 left-0 right-0 h-px bg-brand-gold/20"
      aria-hidden="true"
    />

  </section>
</template>

<script setup lang="ts">
const credentials = [
  { value: 'OAB/SP',      label: 'Regularidade ativa' },
  { value: 'Salto/SP',    label: 'Sede do escritório' },
  { value: 'Nacional',    label: 'Atendimento online' },
  { value: 'Presencial',  label: 'Consultas agendadas' },
]
</script>
