/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8feff',
          100: '#d1fdfe',
          200: '#a3fbfd',
          300: '#94eff1',
          400: '#7de0e2',
          500: '#5cbcbe',
          600: '#459899',
          700: '#2e7475',
          800: '#175051',
          900: '#002c2d',
        },
        accent: {
          50: '#f8ffe6',
          100: '#f1ffcc',
          200: '#e3ff99',
          300: '#d5ff66',
          400: '#c3f628',
          500: '#a8d922',
          600: '#8dbc1c',
          700: '#729f16',
          800: '#578210',
          900: '#3c650a',
        },
        surface: {
          50: '#ffffff',
          100: '#f1f3f5',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
        },
      },
    },
  },
  plugins: [],
};
