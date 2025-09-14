/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8f5f0',
          100: '#c3e4d6',
          200: '#9dd3bb',
          300: '#76c2a1',
          400: '#50b186',
          500: '#074E3C', // Cor primária principal
          600: '#063e30',
          700: '#053224',
          800: '#042619',
          900: '#031a0d',
        },
        custom: {
          white: '#F5F5EB', // Nova cor "branca"
        },
      },
    },
  },
  plugins: [],
};
