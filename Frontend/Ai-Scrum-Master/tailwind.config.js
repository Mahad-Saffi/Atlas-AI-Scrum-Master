/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'rich-black': '#0d1b2a',
        'oxford-blue': '#1b263b',
        'yinmn-blue': '#415a77',
        'silver-lake-blue': '#778da9',
        'platinum': '#e0e1dd',
      },
    },
  },
  plugins: [],
}
