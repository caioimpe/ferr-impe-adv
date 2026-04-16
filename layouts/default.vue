<template>
  <div class="flex flex-col min-h-screen">
    <SiteHeader />

    <main class="flex-1">
      <slot />
    </main>

    <SiteFooter />
  </div>
</template>
