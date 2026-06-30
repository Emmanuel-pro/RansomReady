/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#e0e9ff',
          500: '#3b5bdb',
          600: '#2f4ac7',
          700: '#2541b2',
          900: '#1a2e7a',
        },
        danger: {
          50:  '#fff5f5',
          500: '#e03131',
          600: '#c92a2a',
        },
        amber: {
          50:  '#fff8e1',
          500: '#f59f00',
          600: '#e67700',
        },
        success: {
          50:  '#ebfbee',
          500: '#2f9e44',
          600: '#2b8a3e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
