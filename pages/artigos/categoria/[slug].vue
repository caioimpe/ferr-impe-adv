<template>
  <div>

    <!-- Categoria não encontrada (sem artigos com este slug de categoria) -->
    <div
      v-if="!categoryInfo"
      class="bg-brand-green min-h-[60vh] flex flex-col items-center justify-center gap-5 text-center px-6"
    >
      <p class="label-institutional">Categoria não encontrada</p>
      <p class="font-heading text-xl text-white">Nenhum artigo foi publicado nesta categoria ainda.</p>
      <NuxtLink
        to="/artigos"
        class="px-5 py-2.5 border border-white/20 text-white/70 text-[0.65rem] font-subheading tracking-widest uppercase hover:border-brand-gold/50 hover:text-brand-gold transition-all"
      >
        Ver Todos os Artigos
      </NuxtLink>
    </div>

    <template v-else>
      <!-- Hero da categoria -->
      <PageHero
        label="Categoria"
        :title="categoryInfo.name"
        :description="`Artigos e análises sobre ${categoryInfo.name} pelo escritório Ferrigato & Imperato.`"
      />

      <!-- gradiente de transição: hero verde → fundo off-white -->
      <div class="h-12 bg-gradient-to-b from-brand-green to-[#f7f6f4]" aria-hidden="true" />

      <section class="pb-16 bg-[#f7f6f4]">
        <div class="container-site flex flex-col gap-8">

          <!-- Breadcrumb -->
          <ArticleBreadcrumb
            :items="[
              { label: 'Início',     to: '/' },
              { label: 'Artigos',    to: '/artigos' },
              { label: categoryInfo.name },
            ]"
          />

          <!-- Grid de artigos -->
          <div v-if="categoryArticles.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-10 pt-4">
            <ArticleCard
              v-for="article in categoryArticles"
              :key="article.slug"
              :article="article"
            />
          </div>

          <!-- Estado vazio -->
          <div v-else class="flex flex-col items-center gap-5 py-16 text-center">
            <div class="w-px h-10 bg-brand-gold/40 mx-auto" aria-hidden="true" />
            <p class="label-institutional">Em Breve</p>
            <p class="text-sm font-body text-brand-grayDark max-w-sm leading-relaxed">
              Ainda não há artigos publicados nesta categoria. Novos conteúdos serão adicionados em breve.
            </p>
            <NuxtLink
              to="/artigos"
              class="text-sm font-subheading text-brand-green hover:text-brand-gold transition-colors"
            >
              Ver todos os artigos
            </NuxtLink>
          </div>

        </div>
      </section>

      <ContactCallout />
    </template>

  </div>
</template>

<script setup lang="ts">
import type { Article } from '~/types/article'

const route = useRoute()
const categorySlug = route.params.slug as string

const { data: categoryArticles } = await useFetch<Article[]>('/api/articles', {
  query: { category: categorySlug },
})

const categoryInfo = computed(() => {
  const first = categoryArticles.value?.[0]
  if (!first) return null
  return { name: first.category, slug: first.categorySlug }
})

useSeoMeta({
  title:       computed(() => categoryInfo.value
    ? `${categoryInfo.value.name} — Artigos | Ferrigato & Imperato Advogados`
    : 'Categoria | Ferrigato & Imperato Advogados',
  ),
  description: computed(() => categoryInfo.value
    ? `Leia artigos e análises sobre ${categoryInfo.value.name} pelo escritório Ferrigato & Imperato Advogados.`
    : '',
  ),
})
</script>
