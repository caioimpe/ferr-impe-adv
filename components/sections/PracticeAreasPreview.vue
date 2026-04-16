<template>
  <section class="py-20 bg-white">
    <div class="container-site">

      <SectionTitle
        label="Especialidades"
        description="Atuação técnica e comprometida nas principais áreas do direito."
      >
        Áreas de Atuação
      </SectionTitle>

      <div class="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="area in areas"
          :key="area.slug"
          class="group border border-gray-100 p-7 hover:border-brand-gold/40 hover:shadow-sm transition-all duration-300 cursor-default"
        >
          <div class="w-6 h-px bg-brand-gold mb-5 group-hover:w-10 transition-all duration-300" aria-hidden="true" />
          <h3 class="font-heading text-lg text-brand-green mb-2">{{ area.name }}</h3>
          <p class="text-sm font-body text-brand-grayDark leading-relaxed">{{ area.description }}</p>
        </div>
      </div>

      <div class="mt-10">
        <NuxtLink
          to="/areas-de-atuacao"
          class="text-sm font-subheading font-semibold text-brand-green hover:text-brand-gold transition-colors tracking-wide inline-flex items-center gap-2"
        >
          Ver todas as especialidades
          <span aria-hidden="true">→</span>
        </NuxtLink>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
// Placeholder inicial — substitua pelos dados reais na próxima etapa
const areas = [
  { slug: 'direito-civil',         name: 'Direito Civil',          description: 'Contratos, responsabilidade civil, família e sucessões.' },
  { slug: 'direito-trabalhista',   name: 'Direito Trabalhista',    description: 'Assessoria a empregados e empregadores em demandas laborais.' },
  { slug: 'direito-empresarial',   name: 'Direito Empresarial',    description: 'Constituição de empresas, contratos e recuperação judicial.' },
  { slug: 'direito-previdenciario',name: 'Direito Previdenciário', description: 'Benefícios, aposentadoria e revisões junto ao INSS.' },
  { slug: 'direito-imobiliario',   name: 'Direito Imobiliário',    description: 'Compra, venda, locação e regularização de imóveis.' },
  { slug: 'direito-criminal',      name: 'Direito Criminal',       description: 'Defesa técnica em inquéritos e processos criminais.' },
]
</script>
