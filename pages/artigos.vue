<template>
  <div>
    <PageHero
      label="Publicações"
      title="Artigos & Análises Jurídicas"
      description="Conhecimento acessível sobre temas do direito que impactam o seu dia a dia."
    />

    <!-- Faixa de transição green → off-white -->
    <div class="w-full h-8 bg-gradient-to-b from-brand-green to-[#f7f6f4]" aria-hidden="true" />

    <section class="pb-20 bg-[#f7f6f4]">
      <div class="container-site flex flex-col gap-10">

        <!-- Filtros de categoria -->
        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between gap-4">
            <p class="label-institutional">Filtrar por área</p>
          </div>

          <div class="flex items-center gap-1 flex-wrap">
            <button
              class="px-4 py-1.5 text-[0.67rem] font-subheading font-semibold tracking-[0.11em] uppercase transition-all duration-200 border"
              :class="selectedCategory === null
                ? 'bg-brand-green text-white border-brand-green'
                : 'border-gray-200 text-brand-grayDark bg-white hover:border-brand-gold/60 hover:text-brand-green'"
              @click="selectedCategory = null"
            >
              Todos
            </button>
            <button
              v-for="cat in categories"
              :key="cat.slug"
              class="px-4 py-1.5 text-[0.67rem] font-subheading font-semibold tracking-[0.11em] uppercase transition-all duration-200 border"
              :class="selectedCategory === cat.slug
                ? 'bg-brand-green text-white border-brand-green'
                : 'border-gray-200 text-brand-grayDark bg-white hover:border-brand-gold/60 hover:text-brand-green'"
              @click="selectedCategory = cat.slug"
            >
              {{ cat.name }}
            </button>
          </div>

          <p class="text-[0.7rem] font-body text-brand-grayLight">
            {{ filteredArticles.length }}
            {{ filteredArticles.length === 1 ? 'publicação' : 'publicações' }}
          </p>
        </div>

        <!-- Grid de artigos -->
        <div
          v-if="filteredArticles.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-10"
        >
          <ArticleCard
            v-for="article in filteredArticles"
            :key="article.id"
            :article="article"
          />
        </div>

        <!-- Sem resultados no filtro -->
        <div
          v-else-if="selectedCategory && (articles?.length ?? 0) > 0"
          class="flex flex-col items-center gap-5 py-16 text-center"
        >
          <div class="w-px h-10 bg-brand-gold/40 mx-auto" aria-hidden="true" />
          <p class="label-institutional">Sem publicações nesta categoria</p>
          <button
            class="text-sm font-subheading text-brand-green hover:text-brand-gold transition-colors"
            @click="selectedCategory = null"
          >
            Ver todos os artigos
          </button>
        </div>

        <!-- Nenhum artigo publicado ainda -->
        <div v-else class="flex flex-col items-center gap-6 py-20 text-center">
          <div class="w-px h-12 bg-brand-gold/25 mx-auto" aria-hidden="true" />
          <p class="label-institutional">Nenhuma publicação ainda</p>
          <p class="text-[0.875rem] font-body text-brand-grayDark max-w-sm leading-relaxed">
            Novos artigos jurídicos serão publicados em breve.
          </p>
        </div>

      </div>
    </section>

    <ContactCallout />
  </div>
</template>

<script setup lang="ts">
import type { Article, Category } from '~/types/article'

useSeoMeta({
  title:         'Artigos & Publicações Jurídicas | Ferrigato & Imperato Advogados',
  description:   'Análises jurídicas, orientações práticas e atualizações do direito pelo escritório Ferrigato & Imperato Advogados em Salto/SP.',
  ogTitle:       'Artigos & Publicações Jurídicas | Ferrigato & Imperato Advogados',
  ogDescription: 'Análises jurídicas, orientações práticas e atualizações do direito pelo escritório Ferrigato & Imperato Advogados.',
  ogType: 'website',
})

const { data: articles }   = await useFetch<Article[]>('/api/articles')
const { data: categories } = await useFetch<Category[]>('/api/articles/categories')

const selectedCategory = ref<string | null>(null)

const filteredArticles = computed(() => {
  const list = articles.value ?? []
  return selectedCategory.value
    ? list.filter(a => a.categorySlug === selectedCategory.value)
    : list
})
</script>

