<template>
  <footer class="w-full border-t border-gray-200 bg-gray-50">
    <div class="max-w-7xl mx-auto px-6 py-6 text-center text-sm text-gray-500">
      &copy; {{ currentYear }} Ferrigato &amp; Imperato Advogados. Todos os direitos reservados.
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>
