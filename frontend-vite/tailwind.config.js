/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pwde-blue': '#4a6cf8',
        'pwde-dark': '#172554',
        'pwde-green': '#22c55e',
        'pwde-purple': '#9333ea',
        'pwde-bg': '#f2f7ff',
        'pwde-bg-alt': '#f7f2ff',
      },
      fontSize: {
        'small': ['0.875rem', { lineHeight: '1.25rem' }],
        'normal': ['1rem', { lineHeight: '1.5rem' }],
        'large': ['1.125rem', { lineHeight: '1.75rem' }],
        'extra-large': ['1.25rem', { lineHeight: '1.75rem' }],
      },
    },
  },
  plugins: [],
} 