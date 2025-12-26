/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'royal-blue': '#1e3a8a',
        'deep-indigo': '#312e81',
        'off-white': '#faf9f6',
        'soft-cream': '#fffef9',
        'gold': '#d4af37',
        'gold-light': '#f4e4bc',
      },
      fontFamily: {
        heading: ['Cormorant Garamond', 'serif'],
        script: ['Dancing Script', 'cursive'],
        body: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

