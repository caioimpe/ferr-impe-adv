<template>
  <div>
    <PageHero
      label="Especialidades"
      title="Áreas de Atuação"
      description="Assessoria jurídica especializada nas principais áreas do direito."
    />

    <!-- Grid de áreas -->
    <section class="py-20 bg-white">
      <div class="container-site">

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            v-for="area in areas"
            :key="area.slug"
            class="group flex gap-6 items-start border border-gray-100 p-8 hover:border-brand-gold/40 hover:shadow-sm transition-all duration-300"
          >

            <!-- Indicador dourado -->
            <div class="w-px h-full min-h-[3rem] bg-brand-gold/40 group-hover:bg-brand-gold flex-shrink-0 transition-colors duration-300" aria-hidden="true" />

            <div class="flex flex-col gap-2">
              <h2 class="font-heading text-xl text-brand-green">{{ area.name }}</h2>
              <p class="text-sm font-body text-brand-grayDark leading-relaxed">{{ area.description }}</p>
            </div>

          </div>
        </div>

      </div>
    </section>

    <ContactCallout />
  </div>
</template>

<script setup lang="ts">
const { public: { siteUrl } } = useRuntimeConfig()
const canonical = `${siteUrl}/areas-de-atuacao`

useSeoMeta({
  title: 'Áreas de Atuação — Ferrigato & Imperato Advogados',
  description: 'Conheça as especialidades jurídicas do escritório Ferrigato & Imperato: direito civil, trabalhista, empresarial e muito mais.',
  ogTitle: 'Áreas de Atuação — Ferrigato & Imperato Advogados',
  ogDescription: 'Assessoria jurídica especializada em direito civil, trabalhista, empresarial e mais. Escritório em Salto/SP.',
  ogUrl: canonical,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Áreas de Atuação — Ferrigato & Imperato Advogados',
  twitterDescription: 'Assessoria jurídica especializada nas principais áreas do direito.',
})

useHead({
  link: [{ rel: 'canonical', href: canonical }],
})

const areas = [
  {
    slug: 'direito-civil',
    name: 'Direito Civil',
    description: 'Contratos, responsabilidade civil, direito de família, sucessões, cobranças e questões patrimoniais.',
  },
  {
    slug: 'direito-trabalhista',
    name: 'Direito Trabalhista',
    description: 'Defesa de trabalhadores e assessoria a empregadores. Verbas rescisórias, horas extras, assédio e FGTS.',
  },
  {
    slug: 'direito-empresarial',
    name: 'Direito Empresarial',
    description: 'Constituição e dissolução de sociedades, contratos comerciais, recuperação judicial e extrajudicial.',
  },
  {
    slug: 'direito-previdenciario',
    name: 'Direito Previdenciário',
    description: 'Aposentadorias, pensões, benefícios por incapacidade e revisões de benefícios junto ao INSS.',
  },
  {
    slug: 'direito-imobiliario',
    name: 'Direito Imobiliário',
    description: 'Compra, venda e locação de imóveis. Usucapião, regularização fundiária e distrato imobiliário.',
  },
  {
    slug: 'direito-criminal',
    name: 'Direito Criminal',
    description: 'Defesa técnica em inquéritos policiais, ações penais e habeas corpus.',
  },
  {
    slug: 'direito-consumidor',
    name: 'Direito do Consumidor',
    description: 'Ações contra fornecedores, bancos e prestadoras de serviço. Danos materiais e morais.',
  },
  {
    slug: 'direito-bancario',
    name: 'Direito Bancário',
    description: 'Revisão de contratos de crédito, juros abusivos, negativação indevida e superendividamento.',
  },
]
</script>
