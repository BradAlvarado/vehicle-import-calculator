/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx,jsx,js}'],
  theme: {
    extend: {
      colors: {
        profit: {
          green: '#16a34a',
          yellow: '#facc15',
          red: '#dc2626'
        }
      }
    }
  },
  plugins: []
};
