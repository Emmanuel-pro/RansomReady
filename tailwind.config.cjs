/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas:  '#F7F4F1',
        surface: '#DCCFC0',
        moss:    '#A4AE98',
        ink: {
          DEFAULT: '#262626',
          muted:   '#9D8E82',
          faint:   '#C0B5AB',
        },
        safe:    '#4C5C55',
        danger:  '#8B3A3A',
        warning: '#7A6020',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        mono:  ['"JetBrains Mono"', 'Consolas', 'monospace'],
      },
      boxShadow: {
        subtle: '0 4px 32px rgba(38, 38, 38, 0.06)',
        card:   '0 1px 6px rgba(38, 38, 38, 0.04)',
        lift:   '0 8px 40px rgba(38, 38, 38, 0.08)',
      },
      letterSpacing: {
        display: '-0.03em',
      },
      transitionTimingFunction: {
        'out-smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },
  plugins: [],
}
