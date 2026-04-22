<template>
  <div>
    <HeroSection />
    <PracticeAreasPreview />
    <ArticlesPreview />
    <ContactCallout />
  </div>
</template>

<script setup lang="ts">
const { public: { siteUrl } } = useRuntimeConfig()
const canonical = `${siteUrl}/`

useSeoMeta({
  title: 'Ferrigato & Imperato Advogados — Assessoria Jurídica em Salto/SP',
  description: 'Escritório de advocacia especializado. Assessoria jurídica técnica, ética e comprometida com os resultados dos nossos clientes.',
  ogTitle: 'Ferrigato & Imperato Advogados — Assessoria Jurídica em Salto/SP',
  ogDescription: 'Escritório de advocacia especializado em Salto/SP. Assessoria jurídica técnica, ética e comprometida com os resultados dos nossos clientes.',
  ogUrl: canonical,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Ferrigato & Imperato Advogados',
  twitterDescription: 'Assessoria jurídica técnica, ética e comprometida com os resultados dos nossos clientes.',
})

useHead({
  link: [{ rel: 'canonical', href: canonical }],
})
</script>
