<template>
  <div class="flex flex-col md:flex-row gap-10 md:gap-14 items-start">

    <!-- Foto -->
    <div class="flex-shrink-0 w-full md:w-56">
      <!--
        SUBSTITUIR: coloque o arquivo de foto em /public/images/team/
        Exemplo: /images/team/nome-sobrenome.jpg
        Proporção recomendada: 3:4 (retrato), mínimo 400×530px
      -->
      <div
        v-if="!attorney.photo"
        class="w-full aspect-[3/4] bg-brand-green/8 border border-gray-100 flex items-end justify-center pb-6"
        aria-hidden="true"
      >
        <!-- Ícone silhueta placeholder -->
        <svg class="w-16 h-16 text-brand-gold/20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
        </svg>
      </div>
      <img
        v-else
        :src="attorney.photo"
        :alt="`Foto de ${attorney.name}`"
        class="w-full aspect-[3/4] object-cover object-top"
        width="224"
        height="298"
      />
    </div>

    <!-- Conteúdo textual -->
    <div class="flex flex-col gap-5 flex-1 pt-1">

      <!-- Linha dourada decorativa -->
      <div class="w-8 h-px bg-brand-gold" aria-hidden="true" />

      <!-- Nome e cargo -->
      <div class="flex flex-col gap-1">
        <!--
          SUBSTITUIR: attorney.name → nome real do advogado
        -->
        <h3 class="font-heading text-2xl text-brand-green leading-tight">
          {{ attorney.name }}
        </h3>
        <!--
          SUBSTITUIR: attorney.role → cargo, ex: "Advogado — OAB/SP 000.000"
        -->
        <p class="text-xs font-subheading font-semibold tracking-[0.1em] uppercase text-brand-gold">
          {{ attorney.role }}
        </p>
      </div>

      <!-- Especialidades (tags) -->
      <div v-if="attorney.specialties?.length" class="flex flex-wrap gap-2">
        <!--
          SUBSTITUIR: attorney.specialties → array de strings com áreas
          Ex: ['Direito Civil', 'Direito Empresarial']
        -->
        <span
          v-for="s in attorney.specialties"
          :key="s"
          class="px-3 py-1 text-[0.65rem] font-subheading font-semibold tracking-widest uppercase border border-brand-gold/30 text-brand-grayDark"
        >
          {{ s }}
        </span>
      </div>

      <!-- Biografia -->
      <!--
        SUBSTITUIR: attorney.bio → texto de apresentação (2-4 frases)
      -->
      <p class="text-sm font-body text-brand-grayDark leading-[1.85]">
        {{ attorney.bio }}
      </p>

      <!-- OAB e formação -->
      <div v-if="attorney.oab || attorney.education" class="flex flex-col gap-1 pt-1 border-t border-gray-100">
        <p v-if="attorney.oab" class="text-xs font-body text-brand-grayDark">
          <span class="font-subheading font-semibold text-brand-green">OAB:</span>
          <!--
            SUBSTITUIR: attorney.oab → número de inscrição real
          -->
          {{ attorney.oab }}
        </p>
        <p v-if="attorney.education" class="text-xs font-body text-brand-grayDark">
          <span class="font-subheading font-semibold text-brand-green">Formação:</span>
          <!--
            SUBSTITUIR: attorney.education → instituição e ano, ex: "Unip — 2010"
          -->
          {{ attorney.education }}
        </p>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
export interface Attorney {
  name:          string
  role:          string
  bio:           string
  photo?:        string
  oab?:          string
  education?:    string
  specialties?:  string[]
}

defineProps<{ attorney: Attorney }>()
</script>
