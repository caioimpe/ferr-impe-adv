<template>
  <article class="group flex flex-col bg-white border border-gray-100 hover:border-brand-gold/40 hover:shadow-md shadow-black/5 transition-all duration-300">

    <!-- Imagem de capa -->
    <NuxtLink :to="`/artigos/${article.slug}`" class="block overflow-hidden flex-shrink-0" tabindex="-1">
      <div
        v-if="!article.coverImage || coverError"
        class="aspect-[16/8] w-full bg-brand-green/5 flex flex-col items-center justify-center gap-3"
        aria-hidden="true"
      >
        <!-- placeholder com lógica dourada -->
        <div class="w-8 h-px bg-brand-gold/25" />
        <p class="text-[0.6rem] font-subheading tracking-[0.15em] uppercase text-brand-gold/30">{{ article.category }}</p>
        <div class="w-8 h-px bg-brand-gold/25" />
      </div>
      <img
        v-else
        :src="article.coverImage"
        :alt="article.title"
        class="aspect-[16/8] w-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
        @error="coverError = true"
      />
    </NuxtLink>

    <!-- Conteúdo -->
    <div class="flex flex-col gap-3 p-6 flex-1">

      <CategoryBadge
        :name="article.category"
        :to="`/artigos/categoria/${article.categorySlug}`"
      />

      <NuxtLink :to="`/artigos/${article.slug}`">
        <h2
          class="font-heading text-[1.05rem] text-brand-green leading-[1.35] group-hover:text-brand-greenLight transition-colors line-clamp-2"
        >
          {{ article.title }}
        </h2>
      </NuxtLink>

      <p class="text-[0.78rem] font-body text-brand-grayDark leading-[1.8] line-clamp-2 flex-1">
        {{ article.excerpt }}
      </p>

      <!-- Rodapé do card -->
      <div class="flex items-center justify-between pt-3 mt-auto border-t border-gray-100">
        <ArticleMeta
          :date="article.date"
          :reading-time="article.readingTime"
        />
        <NuxtLink
          :to="`/artigos/${article.slug}`"
          class="text-[0.65rem] font-subheading font-semibold tracking-[0.1em] uppercase text-brand-gold/70 hover:text-brand-gold transition-colors flex-shrink-0 ml-3"
          aria-label="Ler artigo completo"
        >
          Ler &rarr;
        </NuxtLink>
      </div>

    </div>

  </article>
</template>

<script setup lang="ts">
import type { Article } from '~/types/article'
defineProps<{ article: Article }>()
const coverError = ref(false)
</script>
