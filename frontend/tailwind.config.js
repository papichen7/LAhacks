/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "background": "#f9f9f9", // grayish,
        "raspberry": "#ff0072", // raspberry color
        "pinkish": "#ff61a8", // pinkish
        "lblue": "#b8f7ff",
        "cyanish": "#14e5ff",
        "message": "#00b9f6"// blue bubble
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'], // 'sans' is the default font family in Tailwind
      },
    },
  },
  plugins: [],
}