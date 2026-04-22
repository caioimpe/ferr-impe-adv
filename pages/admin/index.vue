<template>
  <div class="container-site py-10 flex flex-col gap-8">

    <!-- Cabeçalho da listagem -->
    <div class="flex items-center justify-between gap-4">
      <div class="flex flex-col gap-1">
        <div class="flex items-center gap-3">
          <div class="w-4 h-px bg-brand-gold" aria-hidden="true" />
          <p class="label-institutional">Repositório Editorial</p>
        </div>
        <h1 class="font-heading text-[1.6rem] text-brand-green">Artigos</h1>
      </div>

      <NuxtLink
        to="/admin/artigos/novo"
        class="flex items-center gap-2 px-5 py-3 bg-brand-green text-white text-[0.62rem] font-subheading font-bold tracking-widest uppercase hover:bg-brand-greenLight transition-colors"
      >
        <span class="text-base leading-none font-light">+</span>
        Novo Artigo
      </NuxtLink>
    </div>

    <!-- Estado de carregamento -->
    <div v-if="pending" class="flex items-center gap-3 py-16 justify-center text-brand-grayLight">
      <div class="w-4 h-px bg-brand-gold/40 animate-pulse" />
      <p class="text-[0.75rem] font-body">Carregando artigos...</p>
    </div>

    <!-- Erro ao carregar -->
    <div v-else-if="error" class="py-12 text-center">
      <p class="text-[0.78rem] font-body text-red-500">Erro ao carregar artigos: {{ error.message }}</p>
    </div>

    <!-- Lista vazia -->
    <div
      v-else-if="!articles?.length"
      class="flex flex-col items-center gap-5 py-20 text-center"
    >
      <div class="w-px h-10 bg-brand-gold/30 mx-auto" aria-hidden="true" />
      <p class="label-institutional">Nenhum artigo ainda</p>
      <p class="text-[0.875rem] font-body text-brand-grayDark max-w-xs leading-relaxed">
        Crie o primeiro artigo para que ele apareça no site público em <code>/artigos</code>.
      </p>
      <NuxtLink
        to="/admin/artigos/novo"
        class="flex items-center gap-2 px-6 py-3 bg-brand-green text-white text-[0.65rem] font-subheading font-bold tracking-widest uppercase hover:bg-brand-greenLight transition-colors"
      >
        <span class="text-base leading-none font-light">+</span>
        Criar Primeiro Artigo
      </NuxtLink>
    </div>

    <!-- Tabela de artigos -->
    <div v-else class="flex flex-col gap-2">
      <!-- Sumário -->
      <p class="text-[0.68rem] font-body text-brand-grayLight mb-2">
        {{ articles.length }} {{ articles.length === 1 ? 'artigo' : 'artigos' }} ·
        {{ publishedCount }} publicado{{ publishedCount !== 1 ? 's' : '' }} ·
        {{ draftCount }} rascunho{{ draftCount !== 1 ? 's' : '' }}
      </p>

      <div
        v-for="article in articles"
        :key="article.id"
        class="bg-white border border-gray-100 hover:border-gray-200 transition-all"
      >
        <div class="flex items-start gap-5 px-5 py-4">

          <!-- Status indicator -->
          <div class="flex-shrink-0 mt-1.5">
            <span
              class="inline-block w-1.5 h-1.5 rounded-full"
              :class="article.status === 'published' ? 'bg-green-500' : 'bg-brand-grayLight'"
              :title="article.status === 'published' ? 'Publicado' : 'Rascunho'"
            />
          </div>

          <!-- Informações -->
          <div class="flex-1 min-w-0 flex flex-col gap-1">
            <div class="flex items-center gap-3 flex-wrap">
              <span
                class="text-[0.55rem] font-subheading tracking-widest uppercase px-2 py-0.5 border"
                :class="article.status === 'published'
                  ? 'border-green-200 text-green-700 bg-green-50'
                  : 'border-gray-200 text-brand-grayLight'"
              >
                {{ article.status === 'published' ? 'Publicado' : 'Rascunho' }}
              </span>
              <span class="text-[0.62rem] font-subheading tracking-widest uppercase border border-brand-gold/25 text-brand-gold/70 px-2 py-0.5">
                {{ article.category }}
              </span>
              <span class="text-[0.62rem] font-body text-brand-grayLight">
                {{ article.status === 'published' ? `Publicado em ${formatDate(article.publishedAt ?? article.updatedAt)}` : `Atualizado em ${formatDate(article.updatedAt)}` }}
              </span>
            </div>
            <h2 class="font-heading text-[0.95rem] text-brand-green leading-snug line-clamp-1">
              {{ article.title }}
            </h2>
            <p class="text-[0.7rem] font-body text-brand-grayLight">/artigos/{{ article.slug }}</p>
          </div>

          <!-- Ações -->
          <div class="flex items-center gap-1 flex-shrink-0">
            <NuxtLink
              v-if="article.status === 'published'"
              :to="`/artigos/${article.slug}`"
              target="_blank"
              class="p-2.5 text-brand-grayLight hover:text-brand-gold transition-colors"
              title="Ver artigo publicado"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </NuxtLink>
            <NuxtLink
              :to="`/admin/artigos/${article.id}`"
              class="p-2.5 text-brand-grayLight hover:text-brand-green transition-colors"
              title="Editar artigo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </NuxtLink>
            <button
              class="p-2.5 text-brand-grayLight hover:text-red-400 transition-colors"
              title="Excluir artigo"
              @click="confirmDelete(article.id, article.title)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </button>
          </div>

        </div>
      </div>
    </div>

    <!-- Modal de exclusão -->
    <Teleport to="body">
      <div
        v-if="dialog.open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="dialog.open = false"
      >
        <div class="absolute inset-0 bg-brand-green/80 backdrop-blur-sm" aria-hidden="true" />
        <div class="relative bg-white w-full max-w-sm p-8 flex flex-col gap-5 shadow-xl">
          <div class="flex items-center gap-3">
            <div class="w-4 h-px bg-red-400" aria-hidden="true" />
            <p class="text-[0.6rem] font-subheading tracking-widest uppercase text-red-400">Confirmar exclusão</p>
          </div>
          <p class="font-heading text-[1rem] text-brand-green leading-snug">
            Excluir "{{ dialog.title }}"?
          </p>
          <p class="text-[0.78rem] font-body text-brand-grayDark leading-relaxed">
            Esta ação é irreversível. O artigo será removido do servidor.
          </p>
          <div class="flex gap-3 pt-1">
            <button
              class="flex-1 py-3 bg-red-500 text-white text-[0.6rem] font-subheading font-bold tracking-widest uppercase hover:bg-red-600 transition-colors"
              :disabled="deleting"
              @click="executeDelete"
            >
              {{ deleting ? 'Excluindo...' : 'Excluir' }}
            </button>
            <button
              class="flex-1 py-3 border border-gray-200 text-brand-grayDark text-[0.6rem] font-subheading tracking-widest uppercase hover:border-brand-gold/50 transition-colors"
              @click="dialog.open = false"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import type { Article } from '~/types/article'

definePageMeta({ layout: 'admin', middleware: 'admin' })
useSeoMeta({ title: 'Artigos — Painel | Ferrigato & Imperato', robots: 'noindex, nofollow' })

const { data: articles, pending, error, refresh } = await useFetch<Article[]>('/api/admin/articles')

const publishedCount = computed(() => articles.value?.filter(a => a.status === 'published').length ?? 0)
const draftCount     = computed(() => articles.value?.filter(a => a.status === 'draft').length ?? 0)

// ─── Exclusão ─────────────────────────────────────────────────────────────────
const dialog  = reactive({ open: false, id: '', title: '' })
const deleting = ref(false)

function confirmDelete(id: string, title: string): void {
  dialog.id    = id
  dialog.title = title
  dialog.open  = true
}

async function executeDelete(): Promise<void> {
  deleting.value = true
  try {
    await $fetch(`/api/admin/articles/${dialog.id}`, { method: 'DELETE' })
    await refresh()
    dialog.open = false
  } finally {
    deleting.value = false
  }
}
</script>
