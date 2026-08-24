/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef5ff",
          100: "#d8e6ff",
          200: "#b3ccff",
          300: "#8ab0ff",
          500: "#4b7bff",
          600: "#2f5fe6",
          700: "#2548b8",
          800: "#1f3a8a",
          900: "#1b2f6b",
        },
      },
      fontFamily: {
        sans: ["Montserrat", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px rgba(37, 72, 184, 0.12)",
        card: "0 8px 24px rgba(16, 24, 40, 0.08)",
      },
    },
  },
  plugins: [],
};
