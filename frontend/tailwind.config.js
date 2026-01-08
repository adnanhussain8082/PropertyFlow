/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        propertyflow: {
          dark: '#0F2C32',
          gold: '#A87F59',
          light: '#F5F5F0',
        }
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-in',
        'slide-up': 'slide-up 0.4s ease-out',
      },
      keyframes: {
        'fade-in': {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        'slide-up': {
          'from': { transform: 'translateY(20px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
