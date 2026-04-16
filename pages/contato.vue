<template>
  <div>
    <PageHero
      label="Contato"
      title="Fale Conosco"
      description="Entre em contato para agendar uma consulta ou esclarecer suas dúvidas jurídicas."
    />

    <section class="py-20 bg-white">
      <div class="container-site grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

        <!-- Informações institucionais -->
        <div class="flex flex-col gap-8">

          <SectionTitle label="Atendimento">
            Informações de Contato
          </SectionTitle>

          <div class="flex flex-col gap-6">

            <div
              v-for="info in contactInfo"
              :key="info.label"
              class="flex gap-4 items-start"
            >
              <div class="w-px h-full min-h-[2.5rem] bg-brand-gold/40 flex-shrink-0" aria-hidden="true" />
              <div>
                <p class="text-xs font-subheading font-semibold tracking-widest uppercase text-brand-grayLight mb-1">
                  {{ info.label }}
                </p>
                <component
                  :is="info.href ? 'a' : 'p'"
                  :href="info.href"
                  class="text-sm font-body text-brand-grayDark leading-relaxed"
                  :class="info.href ? 'hover:text-brand-gold transition-colors' : ''"
                >
                  {{ info.value }}
                </component>
              </div>
            </div>

          </div>

          <!-- Horário de atendimento -->
          <div class="border border-gray-100 p-6 flex flex-col gap-2">
            <p class="label-institutional mb-1">Horário de Atendimento</p>
            <p class="text-sm font-body text-brand-grayDark">Segunda a Sexta: 9h às 18h</p>
            <p class="text-sm font-body text-brand-grayDark">Sábado: Mediante agendamento prévio</p>
          </div>

        </div>

        <!-- Espaço reservado para formulário -->
        <div class="flex flex-col gap-6">
          <SectionTitle label="Consulta">
            Envie uma Mensagem
          </SectionTitle>

          <!--
            Formulário a ser implementado na próxima etapa.
            Integrar com: Resend, Formspree, Netlify Forms ou similar.
          -->
          <div class="border border-dashed border-brand-gold/30 p-10 flex flex-col items-center gap-4 text-center">
            <div class="w-px h-10 bg-brand-gold/40" aria-hidden="true" />
            <p class="text-sm font-body text-brand-grayDark leading-relaxed max-w-xs">
              Formulário de contato em desenvolvimento.<br />
              Por enquanto, utilize o telefone ou e-mail ao lado.
            </p>
            <a
              href="mailto:atendimento@ferrigatoeimperato.com.br"
              class="mt-2 inline-block px-7 py-2.5 bg-brand-green text-white text-sm font-subheading font-medium tracking-wide hover:bg-brand-greenLight transition-colors"
            >
              Enviar E-mail
            </a>
          </div>

        </div>

      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Contato — Ferrigato & Imperato Advogados',
  description: 'Entre em contato com o escritório Ferrigato & Imperato. Advocacia em Salto/SP. Atendimento presencial e online.',
})

const contactInfo = [
  {
    label: 'Telefone / WhatsApp',
    value: '(11) 93476-4353',
    href:  'tel:+5511934764353',
  },
  {
    label: 'E-mail',
    value: 'atendimento@ferrigatoeimperato.com.br',
    href:  'mailto:atendimento@ferrigatoeimperato.com.br',
  },
  {
    label: 'Endereço',
    value: 'Rua Carlos de Campos, 224 — Vila Teixeira\nSalto/SP — CEP 13.320-352',
    href:  null,
  },
  {
    label: 'Site',
    value: 'www.ferrigatoeimperato.com.br',
    href:  'https://www.ferrigatoeimperato.com.br',
  },
]
</script>
