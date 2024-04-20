/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'redbg': "#D20062",
        'greenbg': "#C4E4FF"
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'], // 'sans' is the default font family in Tailwind
      },
    },
  },
  plugins: [],
}