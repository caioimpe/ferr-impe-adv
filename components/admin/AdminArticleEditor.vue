<template>
  <form class="flex flex-col gap-8" @submit.prevent="handleSubmit">

    <!-- ─── Identificação ─────────────────────────────────────────── -->
    <fieldset class="flex flex-col gap-5">
      <legend class="label-institutional text-brand-green mb-1">Identificação</legend>

      <div class="flex flex-col gap-1.5">
        <label for="f-title" class="field-label">Título <span class="text-red-400">*</span></label>
        <input
          id="f-title"
          v-model="form.title"
          type="text"
          required
          placeholder="Ex.: Como revisar um contrato de locação"
          class="field-input"
          @input="onTitleInput"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="f-slug" class="field-label">
          Slug (URL)
          <span class="font-body normal-case tracking-normal text-brand-grayLight ml-1">— gerado automaticamente</span>
        </label>
        <div class="flex items-center border border-gray-200 bg-white focus-within:border-brand-gold/60 transition-colors">
          <span class="px-3 text-[0.72rem] font-body text-brand-grayLight border-r border-gray-200 py-3 select-none bg-gray-50 whitespace-nowrap">
            /artigos/
          </span>
          <input
            id="f-slug"
            v-model="form.slug"
            type="text"
            required
            placeholder="slug-do-artigo"
            class="flex-1 px-3 py-3 text-[0.875rem] font-body text-brand-green focus:outline-none bg-white"
            @input="slugManuallyEdited = true"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div class="flex flex-col gap-1.5">
          <label for="f-category" class="field-label">Categoria <span class="text-red-400">*</span></label>
          <input
            id="f-category"
            v-model="form.category"
            type="text"
            required
            placeholder="Ex.: Direito Civil"
            class="field-input"
            @input="onCategoryInput"
          />
        </div>
        <div class="flex flex-col gap-1.5">
          <label for="f-cat-slug" class="field-label">
            Slug da Categoria
            <span class="font-body normal-case tracking-normal text-brand-grayLight ml-1">— auto</span>
          </label>
          <input
            id="f-cat-slug"
            v-model="form.categorySlug"
            type="text"
            required
            placeholder="direito-civil"
            class="field-input"
          />
        </div>
      </div>
    </fieldset>

    <!-- ─── Metadados ─────────────────────────────────────────────── -->
    <fieldset class="flex flex-col gap-5">
      <legend class="label-institutional text-brand-green mb-1">Metadados</legend>

      <div class="flex flex-col gap-1.5">
        <label for="f-reading" class="field-label">Tempo de leitura (min)</label>
        <input
          id="f-reading"
          v-model.number="form.readingTime"
          type="number"
          min="1"
          max="60"
          placeholder="5"
          class="field-input w-40"
        />
      </div>

      <!-- ─── Imagem de capa ──────────────────────────────────────── -->
      <div class="flex flex-col gap-2">
        <p class="field-label">Imagem de capa</p>

        <!-- Preview (quando há URL definida e não está carregando) -->
        <div v-if="form.coverImage && !uploading" class="relative border border-gray-200 overflow-hidden bg-white">
          <img
            :src="form.coverImage"
            :alt="form.title || 'Capa do artigo'"
            class="w-full h-44 object-cover"
          />
          <button
            type="button"
            class="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-black/50 text-white text-[0.65rem] leading-none hover:bg-red-600/80 transition-colors"
            title="Remover imagem"
            @click="form.coverImage = ''; uploadError = ''"
          >
            ✕
          </button>
        </div>

        <!-- Zona de upload (sem imagem ou carregando) -->
        <label
          v-else
          class="flex flex-col items-center justify-center gap-3 h-44 border border-dashed border-gray-300 bg-white cursor-pointer hover:border-brand-gold/50 hover:bg-brand-gold/5 transition-all group"
          :class="{ 'opacity-60 cursor-not-allowed pointer-events-none': uploading }"
        >
          <input
            ref="fileInputRef"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            class="sr-only"
            :disabled="uploading"
            @change="handleFileChange"
          />

          <!-- estado: carregando -->
          <div v-if="uploading" class="flex items-center gap-2">
            <div class="w-4 h-px bg-brand-gold animate-pulse" />
            <span class="text-[0.72rem] font-body text-brand-grayLight">Carregando...</span>
            <div class="w-4 h-px bg-brand-gold animate-pulse" />
          </div>

          <!-- estado: aguardando seleção -->
          <template v-else>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-7 h-7 text-brand-grayLight group-hover:text-brand-gold transition-colors"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <div class="text-center">
              <p class="text-[0.72rem] font-subheading tracking-wide text-brand-grayDark group-hover:text-brand-green transition-colors">
                Clique para carregar
              </p>
              <p class="text-[0.62rem] font-body text-brand-grayLight mt-0.5">
                JPEG, PNG, WebP ou GIF — máx. 5 MB
              </p>
            </div>
          </template>
        </label>

        <!-- URL manual (alternativa) -->
        <div class="flex items-center gap-3">
          <span class="text-[0.58rem] font-subheading tracking-widest uppercase text-brand-grayLight shrink-0">ou URL</span>
          <div class="flex-1 h-px bg-gray-200" />
        </div>
        <input
          v-model="form.coverImage"
          type="text"
          placeholder="https://... ou /images/artigos/nome.jpg"
          class="field-input text-[0.78rem]"
        />

        <p v-if="uploadError" class="text-[0.62rem] font-body text-red-400">{{ uploadError }}</p>
      </div>

      <!-- Status de publicação -->
      <div class="flex flex-col gap-2">
        <p class="field-label">Status de publicação <span class="text-red-400">*</span></p>
        <div class="flex items-center gap-3">
          <label class="flex items-center gap-2 cursor-pointer group">
            <input
              v-model="form.status"
              type="radio"
              value="draft"
              class="sr-only peer"
            />
            <span
              class="px-4 py-2 text-[0.62rem] font-subheading tracking-widest uppercase border transition-all cursor-pointer"
              :class="form.status === 'draft'
                ? 'border-brand-grayDark bg-brand-grayDark text-white'
                : 'border-gray-200 text-brand-grayLight hover:border-gray-300'"
            >
              Rascunho
            </span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="form.status"
              type="radio"
              value="published"
              class="sr-only"
            />
            <span
              class="px-4 py-2 text-[0.62rem] font-subheading tracking-widest uppercase border transition-all cursor-pointer"
              :class="form.status === 'published'
                ? 'border-green-600 bg-green-600 text-white'
                : 'border-gray-200 text-brand-grayLight hover:border-green-300 hover:text-green-700'"
            >
              Publicado
            </span>
          </label>
        </div>
        <p class="text-[0.62rem] font-body text-brand-grayLight">
          <span v-if="form.status === 'draft'">Artigo salvo como rascunho — não aparece no site público.</span>
          <span v-else>Artigo publicado — visível imediatamente em <strong>/artigos</strong>.</span>
        </p>
      </div>
    </fieldset>

    <!-- ─── Texto ──────────────────────────────────────────────────── -->
    <fieldset class="flex flex-col gap-5">
      <legend class="label-institutional text-brand-green mb-1">Texto</legend>

      <div class="flex flex-col gap-1.5">
        <label for="f-excerpt" class="field-label">Resumo / Excerpt <span class="text-red-400">*</span></label>
        <textarea
          id="f-excerpt"
          v-model="form.excerpt"
          required
          rows="3"
          placeholder="Frase ou parágrafo curto. Aparece nos cards e no hero do artigo."
          class="field-input resize-none"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="f-content" class="field-label">
          Conteúdo <span class="text-red-400">*</span>
          <span class="font-body normal-case tracking-normal text-brand-grayLight ml-1">
            — HTML ou texto simples (parágrafos separados por linha em branco)
          </span>
        </label>
        <textarea
          id="f-content"
          v-model="form.content"
          required
          rows="20"
          placeholder="<p>Primeiro parágrafo...</p>&#10;&#10;<h2>Seção</h2>&#10;<p>Texto da seção...</p>"
          class="field-input resize-y font-mono text-[0.78rem] leading-[1.7]"
        />
        <p class="text-[0.62rem] font-body text-brand-grayLight">
          Use
          <code class="bg-gray-100 px-0.5">&lt;h2&gt;</code>,
          <code class="bg-gray-100 px-0.5">&lt;p&gt;</code>,
          <code class="bg-gray-100 px-0.5">&lt;ul&gt;&lt;li&gt;</code>,
          <code class="bg-gray-100 px-0.5">&lt;strong&gt;</code>.
          Texto simples é convertido automaticamente em parágrafos.
        </p>
      </div>
    </fieldset>

    <!-- ─── SEO ───────────────────────────────────────────────────── -->
    <fieldset class="flex flex-col gap-5">
      <legend class="label-institutional text-brand-green mb-1">SEO</legend>

      <div class="flex flex-col gap-1.5">
        <label for="f-seo-title" class="field-label">
          SEO Title
          <span class="font-body normal-case tracking-normal text-brand-grayLight ml-1">— {{ form.seoTitle.length }}/65 caracteres</span>
        </label>
        <input
          id="f-seo-title"
          v-model="form.seoTitle"
          type="text"
          placeholder="Título do Artigo | Ferrigato & Imperato Advogados"
          class="field-input"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="f-seo-desc" class="field-label">
          SEO Description
          <span class="font-body normal-case tracking-normal text-brand-grayLight ml-1">— {{ form.seoDescription.length }}/155 caracteres</span>
        </label>
        <textarea
          id="f-seo-desc"
          v-model="form.seoDescription"
          rows="2"
          placeholder="Descrição clara do artigo em até 155 caracteres."
          class="field-input resize-none"
        />
      </div>
    </fieldset>

    <!-- ─── Tags ──────────────────────────────────────────────────── -->
    <fieldset>
      <legend class="label-institutional text-brand-green mb-3">Tags</legend>
      <div class="flex flex-col gap-1.5">
        <label for="f-tags" class="field-label">
          Tags
          <span class="font-body normal-case tracking-normal text-brand-grayLight ml-1">— separadas por vírgula</span>
        </label>
        <input
          id="f-tags"
          v-model="tagsRaw"
          type="text"
          placeholder="contrato, locação, inquilino"
          class="field-input"
        />
      </div>
    </fieldset>

    <!-- ─── Erro de envio ─────────────────────────────────────────── -->
    <p v-if="submitError" class="text-[0.72rem] font-body text-red-500 -mt-4">
      {{ submitError }}
    </p>

    <!-- ─── Ações ─────────────────────────────────────────────────── -->
    <div class="flex items-center gap-3 pt-2 border-t border-gray-200">
      <button
        type="submit"
        :disabled="saving"
        class="px-8 py-3 bg-brand-green text-white text-[0.62rem] font-subheading font-bold tracking-widest uppercase hover:bg-brand-greenLight transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {{ saving ? 'Salvando...' : (isEdit ? 'Salvar Alterações' : 'Criar Artigo') }}
      </button>
      <NuxtLink
        to="/admin"
        class="px-8 py-3 border border-gray-200 text-brand-grayDark text-[0.62rem] font-subheading tracking-widest uppercase hover:border-brand-gold/50 transition-colors"
      >
        Cancelar
      </NuxtLink>
    </div>

  </form>
</template>

<script setup lang="ts">
import type { Article, ArticleInput, ArticleStatus } from '~/types/article'

const props = defineProps<{
  initial: Article | null
  isEdit:  boolean
}>()

const emit = defineEmits<{
  saved: [id: string]
}>()

// ─── Estado do formulário ─────────────────────────────────────────────────────

const form = reactive({
  title:          props.initial?.title          ?? '',
  slug:           props.initial?.slug           ?? '',
  excerpt:        props.initial?.excerpt        ?? '',
  category:       props.initial?.category       ?? '',
  categorySlug:   props.initial?.categorySlug   ?? '',
  seoTitle:       props.initial?.seoTitle       ?? '',
  seoDescription: props.initial?.seoDescription ?? '',
  content:        props.initial?.content        ?? '',
  coverImage:     props.initial?.coverImage     ?? '',
  readingTime:    props.initial?.readingTime     ?? 5,
  status:         (props.initial?.status        ?? 'draft') as ArticleStatus,
})

const tagsRaw          = ref(props.initial?.tags?.join(', ') ?? '')
const slugManuallyEdited = ref(props.isEdit)
const saving           = ref(false)
const submitError      = ref('')
const fileInputRef     = ref<HTMLInputElement | null>(null)
const uploading        = ref(false)
const uploadError      = ref('')

// ─── Handlers ────────────────────────────────────────────────────────────────

function onTitleInput(): void {
  if (!slugManuallyEdited.value) {
    form.slug = generateSlug(form.title)
  }
  if (!form.seoTitle || form.seoTitle === buildDefaultSeoTitle(form.title)) {
    form.seoTitle = buildDefaultSeoTitle(form.title)
  }
}

function onCategoryInput(): void {
  form.categorySlug = generateSlug(form.category)
}

async function handleFileChange(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file  = input.files?.[0]
  if (!file) return

  uploading.value   = true
  uploadError.value = ''

  try {
    const body = new FormData()
    body.append('file', file)

    const result = await $fetch<{ url: string }>('/api/admin/upload', {
      method: 'POST',
      body,
    })

    form.coverImage = result.url
  } catch (e: unknown) {
    const msg = (e as { data?: { message?: string } })?.data?.message
    uploadError.value = msg ?? 'Erro ao carregar imagem. Tente novamente.'
  } finally {
    uploading.value = false
    if (fileInputRef.value) fileInputRef.value.value = ''
  }
}

function buildDefaultSeoTitle(title: string): string {
  return title ? `${title} | Ferrigato & Imperato Advogados` : ''
}

function processContent(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return ''
  if (/<(p|h[1-6]|ul|ol|li|strong|em|a|blockquote|br)\b/i.test(trimmed)) return trimmed
  return trimmed
    .split(/\n{2,}/)
    .map(block => `<p>${block.trim().replace(/\n/g, '<br />')}</p>`)
    .join('\n')
}

// ─── Submit ───────────────────────────────────────────────────────────────────

async function handleSubmit(): Promise<void> {
  saving.value      = true
  submitError.value = ''

  const tags = tagsRaw.value
    .split(',')
    .map(t => t.trim())
    .filter(Boolean)

  const payload: ArticleInput = {
    ...form,
    coverImage: form.coverImage?.trim() || undefined,
    content:    processContent(form.content),
    tags:       tags.length > 0 ? tags : undefined,
    ...(props.isEdit && props.initial ? { id: props.initial.id } : {}),
  }

  try {
    let result: Article

    if (props.isEdit && props.initial) {
      result = await $fetch<Article>(`/api/admin/articles/${props.initial.id}`, {
        method: 'PUT',
        body:   payload,
      })
    } else {
      result = await $fetch<Article>('/api/admin/articles', {
        method: 'POST',
        body:   payload,
      })
    }

    emit('saved', result.id)
  } catch (e: unknown) {
    const msg = (e as { data?: { message?: string } })?.data?.message
    submitError.value = msg ?? 'Erro ao salvar artigo. Tente novamente.'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.field-label {
  @apply text-[0.62rem] font-subheading font-semibold tracking-[0.12em] uppercase text-brand-grayDark;
}
.field-input {
  @apply w-full border border-gray-200 bg-white px-4 py-3 text-[0.875rem] font-body text-brand-green
         focus:border-brand-gold/60 focus:outline-none transition-colors;
}
</style>
