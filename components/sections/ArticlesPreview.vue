<template>
  <section class="py-20 bg-gray-50">
    <div class="container-site">

      <SectionTitle
        label="Conhecimento"
        description="Reflexões e análises jurídicas do nosso escritório."
      >
        Artigos Recentes
      </SectionTitle>

      <!-- Artigos reais do store local -->
      <div v-if="recentArticles.length > 0" class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <ArticleCard
          v-for="article in recentArticles"
          :key="article.slug"
          :article="article"
        />
      </div>

      <!-- Estado vazio na home -->
      <div v-else class="mt-12 flex flex-col items-center gap-4 py-12 text-center">
        <div class="w-px h-8 bg-brand-gold/25 mx-auto" aria-hidden="true" />
        <p class="text-[0.75rem] font-body text-brand-grayLight">Nenhum artigo publicado ainda.</p>
      </div>

      <div class="mt-10">
        <NuxtLink
          to="/artigos"
          class="text-sm font-subheading font-semibold text-brand-green hover:text-brand-gold transition-colors tracking-wide inline-flex items-center gap-2"
        >
          Ver todos os artigos
          <span aria-hidden="true">→</span>
        </NuxtLink>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import type { Article } from '~/types/article'

const { data: articles } = await useFetch<Article[]>('/api/articles')
const recentArticles = computed(() => articles.value?.slice(0, 3) ?? [])
</script>
