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

      <!-- Breadcrumb discreto em fundo claro -->
      <div class="bg-[#f7f6f4] border-b border-gray-200/60">
        <div class="container-site py-3">
          <ArticleBreadcrumb
            :items="[
              { label: 'Início',  to: '/' },
              { label: 'Artigos', to: '/artigos' },
              { label: article.title },
            ]"
          />
        </div>
      </div>

      <!-- Hero editorial — fundo branco, título em verde escuro -->
      <header class="bg-white pt-14 pb-12">
        <div class="container-site max-w-3xl flex flex-col gap-5">

          <!-- Acento dourado + badge de categoria -->
          <div class="flex items-center gap-3">
            <div class="w-5 h-px bg-brand-gold" aria-hidden="true" />
            <CategoryBadge
              :name="article.category"
              :to="`/artigos/categoria/${article.categorySlug}`"
            />
          </div>

          <!-- Título -->
          <h1 class="font-heading text-[2.1rem] lg:text-[2.8rem] text-brand-green leading-[1.18] tracking-tight">
            {{ article.title }}
          </h1>

          <!-- Resumo -->
          <p class="text-[0.925rem] font-body text-brand-grayDark leading-[1.9] max-w-[58ch]">
            {{ article.excerpt }}
          </p>

          <!-- Metadados com acento dourado à esquerda -->
          <div class="flex items-center gap-4 border-l-2 border-brand-gold/40 pl-4 pt-1">
            <ArticleMeta
              :date="article.date"
              :reading-time="article.readingTime"
              :category="article.category"
              :category-slug="article.categorySlug"
            />
          </div>

        </div>
      </header>

      <!-- Imagem de capa — âncora visual entre hero e corpo -->
      <div class="bg-white pb-12">
        <div class="container-site max-w-3xl">
          <!-- Sem imagem: linha divisória dourada discreta -->
          <div
            v-if="!article.coverImage || coverLoadError"
            class="h-px bg-brand-gold/20"
            aria-hidden="true"
          />
          <!-- Com imagem: foto com sombra e borda sutil -->
          <img
            v-else
            :src="article.coverImage"
            :alt="article.title"
            class="w-full aspect-[16/7] object-cover ring-1 ring-gray-200/80 shadow-sm"
            width="1200"
            height="525"
            @error="coverLoadError = true"
          />
        </div>
      </div>

      <!-- Corpo editorial — fundo off-white para conforto de leitura -->
      <main class="bg-[#f7f6f4] py-14">
        <div class="container-site max-w-3xl">

          <!-- Texto do artigo (v-html seguro: conteúdo gerado pelo admin autenticado) -->
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

          <!-- Divisor dourado -->
          <div class="my-10 h-px bg-brand-gold/20" aria-hidden="true" />

          <!-- CTA — único bloco verde da página, âncora institucional -->
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

const coverLoadError = ref(false)

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
