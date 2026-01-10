/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "1rem",
        screens: {
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1280px",
        }
      },
      colors: {
        primary: "#0f172a",
        secondary: "#1e293b",
        accent: "#f43f5e",
      }
    },
  },
  plugins: [],
}
