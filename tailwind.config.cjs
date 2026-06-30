/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas:  '#F3F8F7',
        surface: '#E3EFEC',
        ink: {
          DEFAULT: '#14332D',
          muted:   '#3D6960',
          faint:   '#7AADA6',
        },
        safe:    '#2B6B5C',
        danger:  '#802B2B',
        warning: '#7A6020',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        mono:  ['"JetBrains Mono"', 'Consolas', 'monospace'],
      },
      boxShadow: {
        subtle: '0 2px 24px rgba(20, 51, 45, 0.07)',
        card:   '0 1px 8px rgba(20, 51, 45, 0.06)',
        lift:   '0 4px 32px rgba(20, 51, 45, 0.10)',
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
