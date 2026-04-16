<template>
  <div class="container-site py-10 max-w-3xl">

    <!-- Estado de carregamento -->
    <div v-if="pending" class="flex items-center gap-3 py-16 text-brand-grayLight">
      <div class="w-4 h-px bg-brand-gold/40 animate-pulse" />
      <p class="text-[0.75rem] font-body">Carregando artigo...</p>
    </div>

    <!-- Artigo não encontrado -->
    <div v-else-if="!article" class="py-20 text-center flex flex-col gap-4 items-center">
      <p class="label-institutional">Artigo não encontrado</p>
      <NuxtLink to="/admin" class="text-[0.8rem] font-subheading text-brand-green hover:text-brand-gold transition-colors">
        ← Voltar à lista
      </NuxtLink>
    </div>

    <!-- Editor -->
    <template v-else>
      <div class="flex flex-col gap-2 mb-8">
        <NuxtLink
          to="/admin"
          class="text-[0.6rem] font-subheading tracking-widest uppercase text-brand-grayLight hover:text-brand-gold transition-colors self-start"
        >
          ← Voltar à lista
        </NuxtLink>

        <div class="flex items-start justify-between gap-4 mt-3">
          <div class="flex flex-col gap-1">
            <div class="flex items-center gap-3">
              <div class="w-4 h-px bg-brand-gold" aria-hidden="true" />
              <p class="label-institutional">Editar Artigo</p>
            </div>
            <h1 class="font-heading text-[1.4rem] text-brand-green leading-snug line-clamp-2">
              {{ article.title }}
            </h1>
          </div>

          <!-- Status badge -->
          <span
            class="flex-shrink-0 mt-1 text-[0.55rem] font-subheading tracking-widest uppercase px-2.5 py-1 border"
            :class="article.status === 'published'
              ? 'border-green-200 text-green-700 bg-green-50'
              : 'border-gray-200 text-brand-grayLight'"
          >
            {{ article.status === 'published' ? 'Publicado' : 'Rascunho' }}
          </span>
        </div>

        <p v-if="article.status === 'published'" class="text-[0.65rem] font-body text-brand-grayLight">
          Publicado em {{ formatDate(article.publishedAt ?? article.updatedAt) }} ·
          <NuxtLink :to="`/artigos/${article.slug}`" target="_blank" class="hover:text-brand-gold transition-colors">
            Ver no site ↗
          </NuxtLink>
        </p>
      </div>

      <AdminArticleEditor
        :initial="article"
        :is-edit="true"
        @saved="onSaved"
      />

    </template>
  </div>
</template>

<script setup lang="ts">
import type { Article } from '~/types/article'

definePageMeta({ layout: 'admin', middleware: 'admin' })
useSeoMeta({ title: 'Editar Artigo — Painel | Ferrigato & Imperato' })

const route = useRoute()
const id    = route.params.id as string

const { data: article, pending } = await useFetch<Article>(`/api/admin/articles/${id}`)

function onSaved(_id: string): void {
  // Recarrega para refletir estado atualizado (ex: status mudou para publicado)
  refreshNuxtData()
}
</script>
