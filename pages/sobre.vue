<template>
  <div>
    <PageHero
      label="O Escritório"
      title="Sobre Ferrigato & Imperato"
      description="Conheça nossa história, nossos valores e o compromisso que guia nossa atuação jurídica."
    />

    <!-- Posicionamento institucional -->
    <section class="py-20 bg-white">
      <div class="container-site grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

        <div class="flex flex-col gap-6">
          <SectionTitle label="Quem Somos">
            Advocacia com propósito e responsabilidade
          </SectionTitle>

          <p class="text-base font-body text-brand-grayDark leading-relaxed">
            O escritório Ferrigato &amp; Imperato Advogados foi fundado com a convicção de que
            a advocacia eficaz nasce da combinação entre rigor técnico, escuta atenta e
            comprometimento real com o cliente.
          </p>
          <p class="text-base font-body text-brand-grayDark leading-relaxed">
            Atuamos em diversas áreas do direito, sempre com foco em soluções práticas,
            legais e alinhadas aos interesses de cada cliente.
          </p>
          <p class="text-base font-body text-brand-grayDark leading-relaxed">
            Nosso escritório tem sede em Salto/SP e atende clientes em todo o território nacional
            de forma presencial e online.
          </p>
        </div>

        <!-- Valores / pilares -->
        <div class="flex flex-col gap-6">
          <div
            v-for="value in values"
            :key="value.title"
            class="flex gap-5 items-start"
          >
            <div class="w-px h-10 bg-brand-gold mt-1 flex-shrink-0" aria-hidden="true" />
            <div>
              <h3 class="font-subheading font-semibold text-brand-green text-sm tracking-wide uppercase mb-1">
                {{ value.title }}
              </h3>
              <p class="text-sm font-body text-brand-grayDark leading-relaxed">
                {{ value.description }}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>

    <ContactCallout />
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Sobre o Escritório — Ferrigato & Imperato Advogados',
  description: 'Conheça o escritório Ferrigato & Imperato. Advogados em Salto/SP com atuação técnica, ética e comprometida.',
})

const values = [
  {
    title: 'Rigor Técnico',
    description: 'Análise cuidadosa de cada caso, fundamentada em sólido conhecimento jurídico e atualização constante.',
  },
  {
    title: 'Ética e Transparência',
    description: 'Comunicação clara, honesta e responsável em todas as etapas da relação com o cliente.',
  },
  {
    title: 'Comprometimento',
    description: 'Cada caso é tratado com dedicação e atenção individualizadas, do início ao fim.',
  },
  {
    title: 'Resultado',
    description: 'Atuação estratégica orientada à solução mais eficaz dentro dos limites da lei.',
  },
]
</script>
