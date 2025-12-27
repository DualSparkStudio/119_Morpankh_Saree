/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'royal-blue': '#1e3a8a',
        'deep-indigo': '#1e3a8a',
        'navy-blue': '#0f172a',
        'sale-red': '#dc2626',
        'sale-red-light': '#ef4444',
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
};

