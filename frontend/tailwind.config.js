/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "background": "#f9f9f9",  // grayish,
        "raspberry": "#ff0072",   // raspberry color
        "pinkish": "#ff61a8",     // pinkish
        "lblue": "#DBF1F4",
        "cyanish": "#14e5ff",
        "message": "#00b9f6",      // blue bubble,
        "search": "#f5f5f5"
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'], // 'sans' is the default font family in Tailwind
      },
      spacing: {
        '100': '14rem'
      }
    },
  },
  plugins: [],
}