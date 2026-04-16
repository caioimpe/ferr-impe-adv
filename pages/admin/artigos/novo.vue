<template>
  <div class="container-site py-10 max-w-3xl">

    <!-- Cabeçalho -->
    <div class="flex flex-col gap-2 mb-8">
      <NuxtLink
        to="/admin"
        class="text-[0.6rem] font-subheading tracking-widest uppercase text-brand-grayLight hover:text-brand-gold transition-colors self-start"
      >
        ← Voltar à lista
      </NuxtLink>
      <div class="flex items-center gap-3 mt-3">
        <div class="w-4 h-px bg-brand-gold" aria-hidden="true" />
        <p class="label-institutional">Novo Artigo</p>
      </div>
      <h1 class="font-heading text-[1.6rem] text-brand-green">Criar Novo Artigo</h1>
    </div>

    <AdminArticleEditor
      :initial="null"
      :is-edit="false"
      @saved="onSaved"
    />

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
useSeoMeta({ title: 'Novo Artigo — Painel | Ferrigato & Imperato' })

function onSaved(id: string): void {
  navigateTo(`/admin/artigos/${id}`)
}
</script>
