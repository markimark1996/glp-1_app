/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#DDEFDC', // Powder Green
          75: '#E5F2E4',
          50: '#ECF5EC',
          25: '#F6FBF6',
        },
        racing: {
          DEFAULT: '#092923', // Racing Green
          75: '#465E5A',
          50: '#849491',
          25: '#C1C9C8',
        },
        royal: {
          DEFAULT: '#2E3082', // Royal
          75: '#6264A1',
          50: '#9697C0',
          25: '#CBCBE0',
        },
        azure: {
          DEFAULT: '#B2D4EE', // Azure
          75: '#C5DFF2',
          50: '#D8E9F6',
          25: '#ECF4FB',
        }
      }
    },
  },
  plugins: [],
};