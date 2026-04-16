<template>
  <!-- CTA de contato — fundo verde escuro, acento dourado -->
  <section class="bg-brand-green py-20">
    <div class="container-site text-center flex flex-col items-center gap-7">

      <p class="label-institutional">Entre em Contato</p>

      <h2 class="font-heading text-3xl lg:text-4xl text-white leading-snug max-w-2xl">
        Precisando de orientação jurídica?<br />
        <span class="text-brand-gold">Estamos prontos para ajudá-lo.</span>
      </h2>

      <p class="text-base font-body text-white/60 max-w-lg leading-relaxed">
        Agende uma consulta e converse com nossa equipe.
        Atendimento presencial em Salto/SP e online em todo o Brasil.
      </p>

      <div class="flex flex-wrap justify-center gap-4 pt-2">
        <NuxtLink
          to="/contato"
          class="inline-block px-8 py-3 bg-brand-gold text-brand-green text-sm font-subheading font-semibold tracking-wide hover:brightness-110 transition-all duration-200"
        >
          Agendar Consulta
        </NuxtLink>
        <a
          href="tel:+5511934764353"
          class="inline-block px-8 py-3 border border-white/30 text-white/80 text-sm font-subheading font-medium tracking-wide hover:border-brand-gold hover:text-brand-gold transition-all duration-200"
        >
          (11) 93476-4353
        </a>
      </div>

    </div>
  </section>
</template>
