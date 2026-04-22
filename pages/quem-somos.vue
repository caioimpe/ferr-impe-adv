<template>
  <div>

    <!-- Hero interno -->
    <PageHero
      label="O Time"
      title="Quem Somos"
      description="Conheça os advogados por trás do compromisso, da técnica e do cuidado com cada cliente."
    />

    <!-- Bloco institucional -->
    <section class="py-16 bg-white">
      <div class="container-site max-w-3xl">

        <SectionTitle label="Nosso Propósito">
          Advocacia que respeita pessoas e protege direitos.
        </SectionTitle>

        <div class="mt-7 flex flex-col gap-4 text-sm font-body text-brand-grayDark leading-[1.9]">
          <p>
            O escritório Ferrigato &amp; Imperato Advogados nasceu da convicção de que
            a advocacia de excelência exige mais do que conhecimento técnico — exige
            escuta ativa, presença real e responsabilidade genuína com o cliente.
          </p>
          <p>
            Nossa atuação une rigor jurídico e atendimento humanizado para pessoas físicas
            e jurídicas em diversas áreas do direito, sempre com clareza, ética e
            comprometimento com o melhor resultado possível dentro da lei.
          </p>
        </div>

      </div>
    </section>

    <!-- Divisor dourado -->
    <div class="container-site">
      <div class="h-px bg-brand-gold/20" aria-hidden="true" />
    </div>

    <!-- Seção dos advogados -->
    <section class="py-16 bg-white">
      <div class="container-site flex flex-col gap-16">

        <SectionTitle label="Advogados">
          Os Profissionais do Escritório
        </SectionTitle>

        <div class="flex flex-col gap-16">
          <AttorneyProfileCard
            v-for="attorney in attorneys"
            :key="attorney.name"
            :attorney="attorney"
          />
        </div>

      </div>
    </section>

    <!-- CTA final -->
    <ContactCallout />

  </div>
</template>

<script setup lang="ts">
import type { Attorney } from '~/components/ui/AttorneyProfileCard.vue'

const { public: { siteUrl } } = useRuntimeConfig()
const canonical = `${siteUrl}/quem-somos`

useSeoMeta({
  title: 'Quem Somos — Ferrigato & Imperato Advogados',
  description: 'Conheça a equipe do escritório Ferrigato & Imperato Advogados. Profissionais comprometidos com rigor técnico e atendimento humanizado.',
  ogTitle: 'Quem Somos — Ferrigato & Imperato Advogados',
  ogDescription: 'Conheça a equipe do escritório Ferrigato & Imperato. Profissionais comprometidos com rigor técnico e atendimento humanizado.',
  ogUrl: canonical,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Quem Somos — Ferrigato & Imperato Advogados',
  twitterDescription: 'Conheça os advogados do escritório Ferrigato & Imperato em Salto/SP.',
})

useHead({
  link: [{ rel: 'canonical', href: canonical }],
})

/*
 * ─── DADOS DOS ADVOGADOS ────────────────────────────────────────────────────
 * Substitua os campos abaixo pelos dados reais quando disponíveis.
 *
 * photo:       caminho relativo à /public, ex: '/images/team/joao-ferrigato.jpg'
 * oab:         número de inscrição, ex: 'SP 000.000'
 * education:   faculdade e ano, ex: 'Universidade de São Paulo — 2010'
 * specialties: array com as áreas principais (máx. 3)
 * ────────────────────────────────────────────────────────────────────────────
 */
const attorneys: Attorney[] = [
  {
    name:  'Nome do Advogado',
    role:  'Advogado — Sócio Fundador',
    bio:   'Breve apresentação institucional do profissional será inserida aqui. Descreva formação, trajetória, áreas de atuação e diferenciais em duas a três frases objetivas e elegantes.',
    oab:       'SP 000.000',
    education: 'Instituição de Ensino Superior — Ano',
    specialties: ['Direito Civil', 'Direito Empresarial', 'Direito Imobiliário'],
    // photo: '/images/team/advogado-1.jpg',
  },
  {
    name:  'Nome do Advogado',
    role:  'Advogado(a) — Sócio(a)',
    bio:   'Breve apresentação institucional do profissional será inserida aqui. Descreva formação, trajetória, áreas de atuação e diferenciais em duas a três frases objetivas e elegantes.',
    oab:       'SP 000.000',
    education: 'Instituição de Ensino Superior — Ano',
    specialties: ['Direito Trabalhista', 'Direito Previdenciário'],
    // photo: '/images/team/advogado-2.jpg',
  },
]
</script>
