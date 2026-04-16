<template>
  <!-- Cabeçalho interno de página — fundo verde, título centralizado -->
  <section class="bg-brand-green py-16 border-b border-brand-gold/20">
    <div class="container-site text-center flex flex-col items-center gap-4">
      <p v-if="label" class="label-institutional">{{ label }}</p>
      <h1 class="font-heading text-3xl lg:text-4xl text-white">{{ title }}</h1>
      <div class="w-10 h-px bg-brand-gold" aria-hidden="true" />
      <p v-if="description" class="text-base font-body text-white/60 max-w-lg leading-relaxed">
        {{ description }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  label?: string
  description?: string
}>()
</script>
