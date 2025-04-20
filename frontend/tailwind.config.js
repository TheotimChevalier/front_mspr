/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // ← dis à Tailwind où chercher les classes
  ],
  darkMode: 'class', // ← active le mode sombre basé sur une classe
  theme: {
    extend: {},
  },
  plugins: [],
}
