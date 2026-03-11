/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Newsreader', 'serif'],
      },
      colors: {
        'botanical-bg': '#FDF2ED',
        'botanical-navy': '#152C40',
        'botanical-green-dark': '#1C4A3C',
        'botanical-green-light': '#7E8D53',
        'botanical-mustard': '#E8B725',
        'botanical-coral': '#F1918A',
        'botanical-red': '#E85B48',
        'botanical-blue': '#C8D9DB',
      }
    },
  },
  plugins: [],
}
