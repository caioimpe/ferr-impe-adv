import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],

  theme: {
    extend: {
      colors: {
        // ─── Paleta oficial Ferrigato & Imperato ───────────────────────────
        brand: {
          green:        '#002820', // verde escuro institucional (principal)
          greenLight:   '#014d3e', // verde secundário escuro (detalhe/hover)
          gold:         '#d19d4a', // dourado institucional (acento)
          grayLight:    '#b4b4b4', // cinza claro (textos secundários)
          grayDark:     '#6f6f6f', // cinza escuro (textos de apoio)
          white:        '#ffffff',
          black:        '#000000',
        },
      },
      fontFamily: {
        // Marcellus — títulos institucionais premium
        heading: ['Marcellus', 'Georgia', 'ui-serif', 'serif'],
        // Raleway — subtítulos e navegação
        subheading: ['Raleway', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // Montserrat — textos corridos
        body: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.2em',
      },
      maxWidth: {
        // container institucional padrão
        site: '1200px',
      },
    },
  },

  plugins: [],
} satisfies Config
