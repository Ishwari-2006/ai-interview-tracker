module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#f5f0e8',
          dark: '#ede6d6',
          darker: '#e0d5c0',
        },
        brown: {
          dark: '#2c1a0e',
          mid: '#5c3d2e',
          accent: '#8b5e3c',
          light: '#c4956a',
          muted: '#9b7e6e',
        },
        parchment: '#f9f5ef',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}