import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:     '#0B0C0E',
        'bg-2': '#111318',
        'bg-3': '#1A1D24',
        sep:    'rgba(255,255,255,.08)',
        blue:   '#007AFF',
        green:  '#34C759',
        orange: '#FF9500',
        red:    '#FF3B30',
        purple: '#AF52DE',
        teal:   '#30B0C7',
        gold:   '#C8973B',
        l1:     '#F2F2F7',
        l2:     '#AEAEB2',
        l3:     '#636366',
        l4:     '#48484A',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"Helvetica Neue"', 'sans-serif'],
        mono: ['"SF Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
