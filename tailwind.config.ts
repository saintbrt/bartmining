import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:        '#FFFFFF',
        'bg-2':    '#FFFFFF',
        'bg-3':    '#FFFFFF',
        paper:     '#F4F6F6',
        ink:       '#14181A',
        'ink-2':   '#444C50',
        'ink-3':   '#5E686D',
        gold:      '#8A6C36',
        'gold-2':  '#B9995C',
        'gold-deep':'#7A5F2F',
        slate:     '#14181A',
        'slate-2': '#1E2427',
        line:      '#D4DBDE',
        'line-2':  '#E4E9EB',
      },
      fontFamily: {
        sora:   ['var(--font-sora)', 'system-ui', 'sans-serif'],
        manrope:['var(--font-manrope)', 'system-ui', 'sans-serif'],
        mono:   ['var(--font-mono)', 'monospace'],
      },
      maxWidth: { site: '1240px' },
      borderRadius: {
        'r-sm': '2px',
        'r-md': '3px',
        'r-lg': '4px',
        'r-xl': '4px',
      },
      // Depth is off by design — kept so existing shadow-* classes stay valid.
      boxShadow: {
        sm:   'none',
        md:   'none',
        lg:   'none',
        gold: 'none',
      },
      screens: {
        'nav': '860px',
        'sm2': '600px',
      },
    },
  },
  plugins: [],
}

export default config
