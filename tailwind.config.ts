import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Derived from brand research — 04-design-system.md
        forest:    '#2C4A2E',
        bark:      '#1C1A14',
        parchment: '#F0EAD9',
        ember:     '#C4703A',
        moss:      '#3E5C40',
        stone:     '#8A7F70',
        creek:     '#6B9AAD',
        border:    '#2E2B22',
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        body:    ['var(--font-plus-jakarta)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['5rem',    { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display':    ['3.75rem', { lineHeight: '1.1',  letterSpacing: '-0.02em' }],
        'h2':         ['2.75rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'h3':         ['2rem',    { lineHeight: '1.2',  letterSpacing: '-0.01em' }],
        'h4':         ['1.5rem',  { lineHeight: '1.25' }],
        'lead':       ['1.125rem',{ lineHeight: '1.7'  }],
      },
      borderRadius: {
        DEFAULT: '4px',
        sm: '2px',
        lg: '8px',
        full: '9999px',
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
      },
      maxWidth: {
        content: '1280px',
        prose:   '720px',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      transitionProperty: {
        'shadow': 'box-shadow',
      },
    },
  },
  plugins: [],
}

export default config
