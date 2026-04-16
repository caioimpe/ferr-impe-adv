<template>
  <div class="min-h-screen bg-[#f7f6f4]">

    <!-- ─── Cabeçalho do editor ────────────────────────────────────────── -->
    <header class="bg-brand-green border-b border-brand-gold/15 sticky top-0 z-40">
      <div class="container-site py-4 flex items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <NuxtLink
            to="/artigos"
            class="text-[0.65rem] font-subheading tracking-widest uppercase text-white/40 hover:text-brand-gold transition-colors"
          >
            ← Artigos
          </NuxtLink>
          <div class="w-px h-4 bg-brand-gold/20" aria-hidden="true" />
          <p class="text-[0.65rem] font-subheading tracking-widest uppercase text-brand-gold/70">
            Editor Editorial
          </p>
          <!-- indicador local -->
          <span class="px-2 py-0.5 text-[0.55rem] font-subheading tracking-widest uppercase border border-brand-gold/20 text-brand-gold/40">
            localhost
          </span>
        </div>

        <button
          v-if="view === 'list'"
          class="flex items-center gap-2 px-5 py-2.5 bg-brand-gold text-brand-green text-[0.65rem] font-subheading font-bold tracking-widest uppercase hover:brightness-110 transition-all"
          @click="openCreate"
        >
          <span class="text-base leading-none font-light">+</span>
          <span>Novo Artigo</span>
        </button>

        <button
          v-else
          class="text-[0.65rem] font-subheading tracking-widest uppercase text-white/40 hover:text-brand-gold transition-colors"
          @click="backToList"
        >
          ← Voltar à lista
        </button>
      </div>
    </header>

    <!-- ─── Listagem ───────────────────────────────────────────────────── -->
    <div v-if="view === 'list'" class="container-site py-12">

      <!-- Estado de carregamento -->
      <div v-if="!store.hydrated.value" class="flex items-center gap-3 py-20 text-brand-grayLight">
        <div class="w-4 h-px bg-brand-gold/40 animate-pulse" />
        <p class="text-[0.75rem] font-body">Carregando artigos...</p>
      </div>

      <!-- Estado vazio -->
      <div
        v-else-if="store.articles.value.length === 0"
        class="flex flex-col items-center gap-6 py-24 text-center"
      >
        <div class="w-px h-12 bg-brand-gold/25 mx-auto" aria-hidden="true" />
        <p class="label-institutional">Nenhum artigo ainda</p>
        <p class="text-[0.875rem] font-body text-brand-grayDark max-w-sm leading-relaxed">
          O repositório local está vazio. Crie o primeiro artigo para que ele
          apareça na página <strong>/artigos</strong>.
        </p>
        <button
          class="flex items-center gap-2 px-6 py-3 bg-brand-green text-white text-[0.65rem] font-subheading font-bold tracking-widest uppercase hover:bg-brand-greenLight transition-colors"
          @click="openCreate"
        >
          <span class="text-base leading-none font-light">+</span>
          Criar Primeiro Artigo
        </button>
      </div>

      <!-- Lista de artigos -->
      <div v-else class="flex flex-col gap-3">
        <div class="flex items-center justify-between mb-4">
          <p class="text-[0.7rem] font-body text-brand-grayLight">
            {{ store.articles.value.length }}
            {{ store.articles.value.length === 1 ? 'artigo salvo' : 'artigos salvos' }}
            localmente
          </p>
        </div>

        <div
          v-for="article in store.articles.value"
          :key="article.slug"
          class="group bg-white border border-gray-100 hover:border-brand-gold/30 transition-all"
        >
          <div class="flex items-start gap-5 p-5">

            <!-- Info principal -->
            <div class="flex-1 min-w-0 flex flex-col gap-1.5">
              <div class="flex items-center gap-3 flex-wrap">
                <span class="px-2.5 py-0.5 text-[0.58rem] font-subheading tracking-widest uppercase border border-brand-gold/30 text-brand-gold/70">
                  {{ article.category }}
                </span>
                <span class="text-[0.65rem] font-body text-brand-grayLight">
                  {{ formatDate(article.date) }}
                </span>
                <span class="text-[0.65rem] font-body text-brand-grayLight">
                  {{ article.readingTime }} min de leitura
                </span>
              </div>
              <h2 class="font-heading text-[1rem] text-brand-green leading-snug truncate">
                {{ article.title }}
              </h2>
              <p class="text-[0.72rem] font-body text-brand-grayDark leading-relaxed line-clamp-1">
                {{ article.excerpt }}
              </p>
              <p class="text-[0.62rem] font-body text-brand-grayLight mt-1">
                /artigos/{{ article.slug }}
              </p>
            </div>

            <!-- Ações -->
            <div class="flex items-center gap-1 flex-shrink-0 pt-1">
              <NuxtLink
                :to="`/artigos/${article.slug}`"
                target="_blank"
                class="p-2 text-brand-grayLight hover:text-brand-gold transition-colors"
                title="Visualizar artigo"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </NuxtLink>
              <button
                class="p-2 text-brand-grayLight hover:text-brand-green transition-colors"
                title="Editar artigo"
                @click="openEdit(article.slug)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button
                class="p-2 text-brand-grayLight hover:text-red-400 transition-colors"
                title="Excluir artigo"
                @click="confirmDelete(article.slug, article.title)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- ─── Editor (criar / editar) ────────────────────────────────────── -->
    <div v-else-if="view === 'form'" class="container-site py-12 max-w-3xl">

      <div class="flex flex-col gap-2 mb-8">
        <div class="flex items-center gap-3">
          <div class="w-5 h-px bg-brand-gold" aria-hidden="true" />
          <p class="label-institutional">{{ isEdit ? 'Editar Artigo' : 'Novo Artigo' }}</p>
        </div>
        <h1 class="font-heading text-[1.6rem] text-brand-green">
          {{ isEdit ? editingTitle : 'Criar Novo Artigo' }}
        </h1>
        <p class="text-[0.78rem] font-body text-brand-grayDark mt-1">
          Salvo localmente no navegador (localStorage). Disponível apenas neste dispositivo.
        </p>
      </div>

      <ArticleForm
        :initial="currentArticle"
        :is-edit="isEdit"
        @save="handleSave"
        @cancel="backToList"
      />

    </div>

    <!-- ─── Modal de confirmação de exclusão ───────────────────────────── -->
    <Teleport to="body">
      <div
        v-if="deleteDialog.open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="deleteDialog.open = false"
      >
        <div class="absolute inset-0 bg-brand-green/80 backdrop-blur-sm" aria-hidden="true" />
        <div class="relative bg-white w-full max-w-sm p-8 flex flex-col gap-5 shadow-xl">
          <div class="flex items-center gap-3">
            <div class="w-5 h-px bg-red-400" aria-hidden="true" />
            <p class="text-[0.62rem] font-subheading tracking-widest uppercase text-red-400">
              Confirmar exclusão
            </p>
          </div>
          <p class="font-heading text-[1rem] text-brand-green leading-snug">
            Excluir "{{ deleteDialog.title }}"?
          </p>
          <p class="text-[0.78rem] font-body text-brand-grayDark leading-relaxed">
            Esta ação não pode ser desfeita. O artigo será removido do armazenamento local.
          </p>
          <div class="flex gap-3 pt-1">
            <button
              class="flex-1 py-2.5 bg-red-500 text-white text-[0.62rem] font-subheading font-bold tracking-widest uppercase hover:bg-red-600 transition-colors"
              @click="executeDelete"
            >
              Excluir
            </button>
            <button
              class="flex-1 py-2.5 border border-gray-200 text-brand-grayDark text-[0.62rem] font-subheading tracking-widest uppercase hover:border-brand-gold/50 transition-colors"
              @click="deleteDialog.open = false"
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

// Sem layout padrão nesta rota — tela de editor dedicada
definePageMeta({ layout: false })

useSeoMeta({ title: 'Editor Editorial — Ferrigato & Imperato' })

const store = useArticleStore()

// ─── Hidratação ──────────────────────────────────────────────────────────────
onMounted(() => store.hydrate())

// ─── Estado de navegação do editor ───────────────────────────────────────────
type View = 'list' | 'form'
const view           = ref<View>('list')
const isEdit         = ref(false)
const editingSlug    = ref<string | null>(null)
const editingTitle   = ref('')
const currentArticle = ref<Article | null>(null)

function openCreate(): void {
  currentArticle.value = null
  isEdit.value         = false
  editingTitle.value   = ''
  view.value           = 'form'
}

function openEdit(slug: string): void {
  const article = store.getBySlug(slug)
  if (!article) return
  currentArticle.value = { ...article }
  isEdit.value         = true
  editingSlug.value    = slug
  editingTitle.value   = article.title
  view.value           = 'form'
}

function backToList(): void {
  view.value = 'list'
  currentArticle.value = null
}

// ─── Salvar artigo ────────────────────────────────────────────────────────────
function handleSave(article: Article): void {
  store.saveArticle(article)
  backToList()
}

// ─── Exclusão ─────────────────────────────────────────────────────────────────
const deleteDialog = reactive({ open: false, slug: '', title: '' })

function confirmDelete(slug: string, title: string): void {
  deleteDialog.slug  = slug
  deleteDialog.title = title
  deleteDialog.open  = true
}

function executeDelete(): void {
  store.deleteArticle(deleteDialog.slug)
  deleteDialog.open = false
}
</script>
