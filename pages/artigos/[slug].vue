<template>
  <div>

    <!-- Carregando (navegação client-side) -->
    <div
      v-if="pending"
      class="min-h-[60vh] bg-[#f7f6f4] flex items-center justify-center"
    >
      <div class="flex items-center gap-3 text-brand-grayLight">
        <div class="w-4 h-px bg-brand-gold/40 animate-pulse" />
        <p class="text-[0.75rem] font-body">Carregando...</p>
      </div>
    </div>

    <!-- Artigo não encontrado -->
    <div
      v-else-if="error || !article"
      class="bg-brand-green min-h-[70vh] flex flex-col items-center justify-center gap-6 text-center px-6"
    >
      <div class="flex items-center gap-4">
        <div class="w-8 h-px bg-brand-gold/40" aria-hidden="true" />
        <p class="label-institutional">Artigo não encontrado</p>
        <div class="w-8 h-px bg-brand-gold/40" aria-hidden="true" />
      </div>
      <p class="font-heading text-2xl text-white">Este artigo não existe ou foi removido.</p>
      <p class="text-[0.8rem] font-body text-white/50 max-w-xs leading-relaxed">
        O endereço <code class="text-brand-gold/70">/artigos/{{ $route.params.slug }}</code> não corresponde a nenhum artigo publicado.
      </p>
      <div class="flex items-center gap-4 mt-2">
        <NuxtLink
          to="/artigos"
          class="px-6 py-2.5 bg-brand-gold text-brand-green text-[0.65rem] font-subheading font-bold tracking-widest uppercase hover:brightness-110 transition-all"
        >
          Ver Artigos
        </NuxtLink>
      </div>
    </div>

    <!-- Conteúdo do artigo -->
    <template v-else>
    <div class="bg-brand-green border-b border-brand-gold/15">
      <div class="container-site py-3.5 flex items-center justify-between gap-6">
        <ArticleBreadcrumb
          :items="[
            { label: 'Início',  to: '/' },
            { label: 'Artigos', to: '/artigos' },
            { label: article.title },
          ]"
        />
        <CategoryBadge
          :name="article.category"
          :to="`/artigos/categoria/${article.categorySlug}`"
          class="hidden sm:inline-block flex-shrink-0"
        />
      </div>
    </div>

    <!-- Hero do artigo -->
    <header class="bg-brand-green pt-12 pb-16 relative overflow-hidden">
      <!-- gradiente de transição para a capa abaixo -->
      <div class="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-b from-transparent to-brand-green/60 pointer-events-none" aria-hidden="true" />

      <div class="container-site max-w-3xl flex flex-col gap-5">

        <CategoryBadge
          :name="article.category"
          :to="`/artigos/categoria/${article.categorySlug}`"
          class="sm:hidden"
        />

        <h1 class="font-heading text-[1.9rem] lg:text-[2.5rem] text-white leading-[1.2] tracking-tight">
          {{ article.title }}
        </h1>

        <p class="text-[0.875rem] font-body text-white/55 leading-[1.85] max-w-[52ch]">
          {{ article.excerpt }}
        </p>

        <!-- Metadados com separador dourado à esquerda -->
        <div class="flex items-center gap-4 pt-2 border-l-2 border-brand-gold/50 pl-4">
          <ArticleMeta
            :date="article.date"
            :reading-time="article.readingTime"
            :category="article.category"
            :category-slug="article.categorySlug"
          />
        </div>

      </div>
    </header>

    <!-- Imagem de capa -->
    <div class="bg-[#f7f6f4]">
      <div class="container-site max-w-3xl">
        <div
          v-if="!article.coverImage"
          class="w-full aspect-[16/4] bg-brand-green/5 flex items-center justify-center"
          aria-hidden="true"
        >
          <div class="flex items-center gap-4">
            <div class="w-16 h-px bg-brand-gold/20" />
            <div class="w-1.5 h-1.5 rounded-full bg-brand-gold/30" />
            <div class="w-16 h-px bg-brand-gold/20" />
          </div>
        </div>
        <img
          v-else
          :src="article.coverImage"
          :alt="article.title"
          class="w-full aspect-[16/6] object-cover"
          width="1200"
          height="450"
        />
      </div>
    </div>

    <!-- Conteúdo editorial -->
    <main class="py-14 bg-[#f7f6f4]">
      <div class="container-site max-w-3xl">

        <!-- Corpo -->
        <!-- v-html é seguro aqui: conteúdo vem de ~/data/articles.ts, não de input de usuário -->
        <div class="article-body" v-html="article.content" />

        <!-- Tags -->
        <div v-if="article.tags?.length" class="mt-8 flex flex-wrap gap-2">
          <NuxtLink
            v-for="tag in article.tags"
            :key="tag"
            :to="`/artigos?tag=${tag}`"
            class="px-3 py-1 text-[0.63rem] font-subheading font-medium tracking-widest uppercase text-brand-grayDark bg-white border border-gray-200 hover:border-brand-gold/50 hover:text-brand-green transition-colors"
          >
            {{ tag }}
          </NuxtLink>
        </div>

        <!-- Divider -->
        <div class="my-10 h-px bg-brand-gold/15" aria-hidden="true" />

        <!-- CTA inline nobre -->
        <div class="bg-brand-green p-8 flex flex-col gap-4">
          <div class="flex items-center gap-3">
            <div class="w-5 h-px bg-brand-gold" aria-hidden="true" />
            <p class="label-institutional">Orientação Jurídica</p>
          </div>
          <p class="font-heading text-xl text-white leading-snug">
            Este tema envolve o seu caso?
          </p>
          <p class="text-[0.8rem] font-body text-white/55 leading-[1.8] max-w-md">
            Os advogados do escritório Ferrigato &amp; Imperato estão disponíveis para
            analisar a sua situação e indicar o caminho jurídico mais adequado.
          </p>
          <div class="flex flex-wrap gap-3 pt-1">
            <NuxtLink
              to="/contato"
              class="inline-block px-6 py-2.5 bg-brand-gold text-brand-green text-[0.68rem] font-subheading font-bold tracking-widest uppercase hover:brightness-110 transition-all duration-200"
            >
              Fale Conosco
            </NuxtLink>
            <a
              href="tel:+5511934764353"
              class="inline-block px-6 py-2.5 border border-white/20 text-white/70 text-[0.68rem] font-subheading font-medium tracking-widest uppercase hover:border-brand-gold/50 hover:text-brand-gold transition-all duration-200"
            >
              (11) 93476-4353
            </a>
          </div>
        </div>

        <!-- Artigos relacionados -->
        <RelatedArticles :articles="related" />

      </div>
    </main>

    </template><!-- /v-else: conteúdo do artigo -->

  </div>
</template>

<script setup lang="ts">
import type { Article } from '~/types/article'

const route = useRoute()
const slug = route.params.slug as string

const { data: article, pending, error } = await useFetch<Article>(`/api/articles/${slug}`)

let relatedData = ref<Article[] | null>(null)
if (article.value?.categorySlug) {
  const { data } = await useFetch<Article[]>('/api/articles', {
    query: { category: article.value.categorySlug },
  })
  relatedData = data
}

const related = computed(() =>
  (relatedData.value ?? []).filter(a => a.slug !== slug).slice(0, 2),
)

useSeoMeta({
  title:                computed(() => article.value?.seoTitle       ?? 'Artigo | Ferrigato & Imperato Advogados'),
  description:          computed(() => article.value?.seoDescription ?? ''),
  ogTitle:              computed(() => article.value?.seoTitle       ?? ''),
  ogDescription:        computed(() => article.value?.seoDescription ?? ''),
  ogType:               'article',
  articlePublishedTime: computed(() => article.value?.publishedAt    ?? ''),
  articleModifiedTime:  computed(() => article.value?.updatedAt      ?? ''),
})
</script>
