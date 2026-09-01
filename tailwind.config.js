/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          900: '#060c14',
          800: '#0a1622',
          700: '#0e1c2c',
          600: '#121e2e',
        },
        aqua: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
        },
        sky: {
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
        },
        ember: {
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
        },
        risk: {
          low: '#34d399',
          moderate: '#fbbf24',
          high: '#f97316',
          critical: '#ef4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
