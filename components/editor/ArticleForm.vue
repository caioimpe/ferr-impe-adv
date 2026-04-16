<template>
  <form class="flex flex-col gap-8" @submit.prevent="handleSubmit">

    <!-- ─── Seção: Identificação ─────────────────────────────── -->
    <fieldset class="flex flex-col gap-5">
      <legend class="label-institutional text-brand-green mb-1">Identificação</legend>

      <!-- Título -->
      <div class="flex flex-col gap-1.5">
        <label for="f-title" class="field-label">Título <span class="text-red-400">*</span></label>
        <input
          id="f-title"
          v-model="form.title"
          type="text"
          required
          placeholder="Ex: Como revisar um contrato de locação"
          class="field-input"
          @input="onTitleInput"
        />
      </div>

      <!-- Slug -->
      <div class="flex flex-col gap-1.5">
        <label for="f-slug" class="field-label">
          Slug (URL)
          <span class="font-body normal-case tracking-normal text-brand-grayLight ml-1">— gerado automaticamente, editável</span>
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
            :class="{ 'text-red-500': slugConflict }"
            @input="slugManuallyEdited = true"
          />
        </div>
        <p v-if="slugConflict" class="text-[0.67rem] font-body text-red-500">
          Este slug já está em uso por outro artigo.
        </p>
        <p v-else class="text-[0.67rem] font-body text-brand-grayLight">
          Usado na URL: ferrigato-imperato.adv.br/artigos/{{ form.slug || '...' }}
        </p>
      </div>

      <!-- Categoria + CategorySlug -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div class="flex flex-col gap-1.5">
          <label for="f-category" class="field-label">Categoria <span class="text-red-400">*</span></label>
          <input
            id="f-category"
            v-model="form.category"
            type="text"
            required
            placeholder="Ex: Direito Civil"
            list="category-suggestions"
            class="field-input"
            @input="onCategoryInput"
          />
          <datalist id="category-suggestions">
            <option v-for="cat in existingCategories" :key="cat" :value="cat" />
          </datalist>
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

    <!-- ─── Seção: Datas e metadados ─────────────────────────── -->
    <fieldset class="flex flex-col gap-5">
      <legend class="label-institutional text-brand-green mb-1">Metadados</legend>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <!-- Data -->
        <div class="flex flex-col gap-1.5">
          <label for="f-date" class="field-label">Data de publicação <span class="text-red-400">*</span></label>
          <input id="f-date" v-model="form.date" type="date" required class="field-input" />
        </div>

        <!-- Tempo de leitura -->
        <div class="flex flex-col gap-1.5">
          <label for="f-reading" class="field-label">Tempo de leitura (min)</label>
          <input
            id="f-reading"
            v-model.number="form.readingTime"
            type="number"
            min="1"
            max="60"
            placeholder="5"
            class="field-input"
          />
        </div>

        <!-- Imagem de capa -->
        <div class="flex flex-col gap-1.5">
          <label for="f-cover" class="field-label">
            Imagem de capa
            <span class="font-body normal-case tracking-normal text-brand-grayLight ml-1">— path ou URL</span>
          </label>
          <input
            id="f-cover"
            v-model="form.cover"
            type="text"
            placeholder="/images/artigos/nome.jpg"
            class="field-input"
          />
        </div>
      </div>
    </fieldset>

    <!-- ─── Seção: Texto ──────────────────────────────────────── -->
    <fieldset class="flex flex-col gap-5">
      <legend class="label-institutional text-brand-green mb-1">Texto</legend>

      <!-- Resumo -->
      <div class="flex flex-col gap-1.5">
        <label for="f-excerpt" class="field-label">Resumo / Excerpt <span class="text-red-400">*</span></label>
        <textarea
          id="f-excerpt"
          v-model="form.excerpt"
          required
          rows="3"
          placeholder="Uma frase ou parágrafo curto resumindo o artigo. Aparece nos cards e no hero."
          class="field-input resize-none"
        />
      </div>

      <!-- Conteúdo -->
      <div class="flex flex-col gap-1.5">
        <label for="f-content" class="field-label">
          Conteúdo <span class="text-red-400">*</span>
          <span class="font-body normal-case tracking-normal text-brand-grayLight ml-1">
            — aceita HTML; parágrafos separados por linha em branco serão convertidos automaticamente
          </span>
        </label>
        <textarea
          id="f-content"
          v-model="form.content"
          required
          rows="18"
          placeholder="Escreva o conteúdo do artigo aqui.&#10;&#10;Separe parágrafos com uma linha em branco.&#10;&#10;Ou use HTML diretamente: &lt;h2&gt;Título da seção&lt;/h2&gt;"
          class="field-input resize-y font-mono text-[0.8rem] leading-[1.7]"
        />
        <p class="text-[0.65rem] font-body text-brand-grayLight">
          Use <code class="bg-gray-100 px-1">&lt;h2&gt;</code> e <code class="bg-gray-100 px-1">&lt;h3&gt;</code> para seções,
          <code class="bg-gray-100 px-1">&lt;strong&gt;</code> para negrito,
          <code class="bg-gray-100 px-1">&lt;ul&gt;&lt;li&gt;</code> para listas.
          Ou escreva em texto simples que os parágrafos serão convertidos.
        </p>
      </div>
    </fieldset>

    <!-- ─── Seção: SEO ────────────────────────────────────────── -->
    <fieldset class="flex flex-col gap-5">
      <legend class="label-institutional text-brand-green mb-1">SEO</legend>

      <div class="flex flex-col gap-1.5">
        <label for="f-seo-title" class="field-label">
          SEO Title
          <span class="font-body normal-case tracking-normal text-brand-grayLight ml-1">— título para motores de busca</span>
        </label>
        <input
          id="f-seo-title"
          v-model="form.seoTitle"
          type="text"
          placeholder="Título do Artigo | Ferrigato & Imperato Advogados"
          class="field-input"
        />
        <p class="text-[0.65rem] font-body text-brand-grayLight">
          {{ form.seoTitle.length }}/65 caracteres recomendados
        </p>
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="f-seo-desc" class="field-label">
          SEO Description
          <span class="font-body normal-case tracking-normal text-brand-grayLight ml-1">— resumo para motores de busca</span>
        </label>
        <textarea
          id="f-seo-desc"
          v-model="form.seoDescription"
          rows="2"
          placeholder="Descrição clara do artigo em até 155 caracteres."
          class="field-input resize-none"
        />
        <p class="text-[0.65rem] font-body text-brand-grayLight">
          {{ form.seoDescription.length }}/155 caracteres recomendados
        </p>
      </div>
    </fieldset>

    <!-- ─── Seção: Tags ──────────────────────────────────────── -->
    <fieldset class="flex flex-col gap-2">
      <legend class="label-institutional text-brand-green mb-1">Tags</legend>
      <label for="f-tags" class="field-label">
        Tags
        <span class="font-body normal-case tracking-normal text-brand-grayLight ml-1">— separadas por vírgula</span>
      </label>
      <input
        id="f-tags"
        v-model="tagsRaw"
        type="text"
        placeholder="locação, contrato, inquilino"
        class="field-input"
      />
    </fieldset>

    <!-- ─── Ações ──────────────────────────────────────────────── -->
    <div class="flex items-center gap-3 pt-2 border-t border-gray-200 mt-2">
      <button
        type="submit"
        :disabled="slugConflict"
        class="px-8 py-3 bg-brand-green text-white text-[0.65rem] font-subheading font-bold tracking-widest uppercase hover:bg-brand-greenLight transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {{ isEdit ? 'Salvar Alterações' : 'Publicar Artigo' }}
      </button>
      <button
        type="button"
        class="px-8 py-3 border border-gray-200 text-brand-grayDark text-[0.65rem] font-subheading tracking-widest uppercase hover:border-brand-gold/50 transition-colors"
        @click="$emit('cancel')"
      >
        Cancelar
      </button>
    </div>

  </form>
</template>

<script setup lang="ts">
import type { Article } from '~/types/article'

const props = defineProps<{
  initial:  Article | null
  isEdit:   boolean
}>()

const emit = defineEmits<{
  save:   [article: Article]
  cancel: []
}>()

const store = useArticleStore()

// ─── Estado do formulário ─────────────────────────────────────────────────────

const today = new Date().toISOString().split('T')[0]!

const form = reactive<Omit<Article, 'tags'>>({
  slug:           props.initial?.slug           ?? '',
  title:          props.initial?.title          ?? '',
  seoTitle:       props.initial?.seoTitle        ?? '',
  seoDescription: props.initial?.seoDescription ?? '',
  excerpt:        props.initial?.excerpt         ?? '',
  category:       props.initial?.category        ?? '',
  categorySlug:   props.initial?.categorySlug ?? '',
  date:           props.initial?.date            ?? today,
  updatedDate:    props.initial?.updatedDate,
  readingTime:    props.initial?.readingTime     ?? 5,
  cover:          props.initial?.cover           ?? '',
  content:        props.initial?.content         ?? '',
})

const tagsRaw = ref<string>(props.initial?.tags?.join(', ') ?? '')

// Controla se o slug foi editado manualmente (evita sobrescrever ao mudar o título)
const slugManuallyEdited = ref<boolean>(props.isEdit)

// Categorias já utilizadas (para sugestão via datalist)
const existingCategories = computed(() =>
  store.categories.value.map(c => c.name),
)

// Detecta conflito de slug
const slugConflict = computed(() =>
  store.slugExists(form.slug, props.isEdit ? (props.initial?.slug ?? undefined) : undefined),
)

// ─── Handlers de entrada ─────────────────────────────────────────────────────

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

function buildDefaultSeoTitle(title: string): string {
  return title ? `${title} | Ferrigato & Imperato Advogados` : ''
}

// ─── Processamento de conteúdo ───────────────────────────────────────────────

/**
 * Se o conteúdo não contém tags HTML, converte parágrafos separados por
 * linha em branco em elementos <p>. Caso contrário, mantém o HTML intacto.
 */
function processContent(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return ''
  // Detecta se há HTML: qualquer tag conhecida
  if (/<(p|h[1-6]|ul|ol|li|strong|em|a|blockquote|br)\b/i.test(trimmed)) return trimmed
  // Converte parágrafos de texto simples
  return trimmed
    .split(/\n{2,}/)
    .map(block => `<p>${block.trim().replace(/\n/g, '<br />')}</p>`)
    .join('\n')
}

// ─── Submit ──────────────────────────────────────────────────────────────────

function handleSubmit(): void {
  if (slugConflict.value) return

  const tags = tagsRaw.value
    .split(',')
    .map(t => t.trim())
    .filter(Boolean)

  const article: Article = {
    ...form,
    cover:   form.cover?.trim() || undefined,
    content: processContent(form.content),
    tags:    tags.length > 0 ? tags : undefined,
  }

  emit('save', article)
}
</script>

<style scoped>
.field-label {
  @apply text-[0.65rem] font-subheading font-semibold tracking-[0.12em] uppercase text-brand-grayDark;
}
.field-input {
  @apply w-full border border-gray-200 bg-white px-4 py-3 text-[0.875rem] font-body text-brand-green
         focus:border-brand-gold/60 focus:outline-none transition-colors;
}
</style>
