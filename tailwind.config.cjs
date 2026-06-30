/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas:  '#FBF9F6',
        surface: '#F4F0EA',
        ink: {
          DEFAULT: '#2A2725',
          muted:   '#8C857B',
          faint:   '#C4BAB0',
        },
        safe:    '#4A5D4E',
        danger:  '#802B2B',
        warning: '#8B6914',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        mono:  ['"JetBrains Mono"', 'Consolas', 'monospace'],
      },
      boxShadow: {
        subtle: '0 2px 24px rgba(42, 39, 37, 0.05)',
        card:   '0 1px 8px rgba(42, 39, 37, 0.04)',
        lift:   '0 4px 32px rgba(42, 39, 37, 0.07)',
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
