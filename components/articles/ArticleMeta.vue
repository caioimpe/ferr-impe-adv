<template>
  <div class="flex items-center gap-3 text-[0.72rem] font-body text-brand-grayLight flex-wrap">
    <span>{{ formatDate(date) }}</span>
    <span class="w-px h-3 bg-brand-grayLight/40" aria-hidden="true" />
    <span>{{ readingTime }} min de leitura</span>
    <template v-if="category">
      <span class="w-px h-3 bg-brand-grayLight/40" aria-hidden="true" />
      <NuxtLink
        :to="`/artigos/categoria/${categorySlug}`"
        class="text-brand-gold/80 hover:text-brand-gold transition-colors"
      >
        {{ category }}
      </NuxtLink>
    </template>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  date:          string
  readingTime:   number
  category?:     string
  categorySlug?: string
}>()
</script>
