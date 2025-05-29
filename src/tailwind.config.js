/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/user/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        kanit: ["Kanit", "sans-serif"],
      },
    },
  },
  plugins: [],
};
