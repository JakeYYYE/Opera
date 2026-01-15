/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'geo-blue': '#1e3a8a', // Approximate deep blue for Geovis
        'geo-light': '#3b82f6',
      }
    },
  },
  plugins: [],
}
