<template>
  <component
    :is="to ? resolveComponent('NuxtLink') : 'span'"
    :to="to"
    class="inline-block px-3 py-[0.3rem] text-[0.6rem] font-subheading font-semibold tracking-[0.12em] uppercase border border-brand-gold/50 text-brand-gold"
    :class="to ? 'hover:bg-brand-gold/8 transition-colors cursor-pointer' : ''"
  >
    {{ name }}
  </component>
</template>

<script setup lang="ts">
defineProps<{
  name: string
  to?:  string
}>()
</script>
