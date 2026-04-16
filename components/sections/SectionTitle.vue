<template>
  <div class="flex flex-col gap-3" :class="centerClass">

    <p v-if="label" class="label-institutional">{{ label }}</p>

    <h2 class="font-heading text-3xl lg:text-4xl text-brand-green leading-snug">
      <slot />
    </h2>

    <div
      v-if="!noLine"
      class="w-10 h-px bg-brand-gold"
      :class="center ? 'mx-auto' : ''"
      aria-hidden="true"
    />

    <p v-if="description" class="mt-1 text-base font-body text-brand-grayDark leading-relaxed" :class="center ? 'max-w-lg mx-auto text-center' : 'max-w-lg'">
      {{ description }}
    </p>

  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label?: string
  description?: string
  center?: boolean
  noLine?: boolean
}>()

const centerClass = computed(() => props.center ? 'items-center text-center' : '')
</script>
