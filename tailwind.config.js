/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'test-color': '#ff0000', 
        quaternary: '#AFAFAF',
        'primary': '#101112',
        'secondary': '#18191B',
        'tertiary': '#1A1B1E',
      },
      fontFamily: {
        sans: ['Open Sans', 'system-ui', 'sans-serif'],
        heading: ['Open Sans', 'sans-serif']
      },
      height: {
        '15': '3.75rem', // 60px
      },
      width: {
        '25': '6.25rem', // 100px
      }
    },
  },
  plugins: [],
}