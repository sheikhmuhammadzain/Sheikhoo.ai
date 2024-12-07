/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter var', 'sans-serif'],
        'display': ['Clash Display', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'geist': ['Geist Sans', 'sans-serif'],
      },
      colors: {
        'dark': {
          DEFAULT: '#000000',
          50: '#1a1a1a',
          100: '#0D0D0D',
          200: '#171717',
          300: '#262626',
          400: '#404040',
          500: '#525252',
          600: '#737373',
          700: '#999999',
          800: '#BFBFBF',
          900: '#E6E6E6',
        },
        'accent': {
          DEFAULT: '#6D28D9',
          50: '#7C3AED',
          100: '#8B5CF6',
          200: '#A78BFA',
          300: '#C4B5FD',
          400: '#DDD6FE',
          500: '#EDE9FE',
        }
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}