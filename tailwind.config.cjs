/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        ink: '#0f1216',
        dusk: '#202731',
        sand: '#f5efe6',
        clay: '#e7d7c5',
        ember: '#ff784f',
        moss: '#1d4d3b',
      },
      boxShadow: {
        card: '0 10px 30px rgba(15, 18, 22, 0.15)',
      },
    },
  },
  plugins: [],
}
