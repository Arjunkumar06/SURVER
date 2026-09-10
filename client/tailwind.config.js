/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surver: {
          950: '#060913',
          900: '#0B1120',
          850: '#0F172A',
          800: '#1E293B',
          700: '#334155',
          cyan: '#06B6D4',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#EF4444',
          indigo: '#6366F1'
        },
        hud: {
          navy: '#050914',
          dark: '#0A1020',
          glass: 'rgba(15, 24, 42, 0.75)',
          cyan: '#00D9FF',
          blue: '#1688FF',
          violet: '#6957FF',
          emerald: '#20D69A',
          amber: '#FFC52E',
          rose: '#FF5C78',
          textMain: '#F4F7FF',
          textSub: '#9AA6BB',
          border: '#263248'
        },
        cyber: {
          black: '#030712',
          dark: '#0B0F19',
          card: 'rgba(15, 23, 42, 0.75)',
          cyan: '#00F0FF',
          purple: '#A855F7',
          crimson: '#FF2E54',
          amber: '#F59E0B',
          emerald: '#10B981',
          textMain: '#F8FAFC',
          textSub: '#94A3B8',
          border: 'rgba(255, 255, 255, 0.12)'
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'spin 4s linear infinite',
      }
    },
  },
  plugins: [],
}
