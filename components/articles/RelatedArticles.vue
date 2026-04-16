<template>
  <section v-if="articles.length > 0" class="pt-14 border-t border-brand-gold/15">

    <div class="flex flex-col gap-8">

      <div class="flex items-center gap-4">
        <div class="w-6 h-px bg-brand-gold" aria-hidden="true" />
        <p class="label-institutional">Leia Também</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-7 gap-y-10">
        <ArticleCard
          v-for="article in articles"
          :key="article.slug"
          :article="article"
        />
      </div>

    </div>

  </section>
</template>

<script setup lang="ts">
import type { Article } from '~/types/article'
defineProps<{ articles: Article[] }>()
</script>
