<template>
  <nav aria-label="Breadcrumb">
    <ol class="flex items-center gap-2 text-[0.7rem] font-subheading text-brand-grayLight flex-wrap">
      <li v-for="(item, index) in items" :key="index" class="flex items-center gap-2">
        <NuxtLink
          v-if="item.to"
          :to="item.to"
          class="hover:text-brand-gold transition-colors"
        >
          {{ item.label }}
        </NuxtLink>
        <span v-else class="text-brand-grayDark truncate max-w-[200px] lg:max-w-none">
          {{ item.label }}
        </span>
        <span
          v-if="index < items.length - 1"
          class="text-brand-grayLight/40 select-none"
          aria-hidden="true"
        >
          /
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
defineProps<{
  items: Array<{ label: string; to?: string }>
}>()
</script>
