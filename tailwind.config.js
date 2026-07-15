/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/renderer/index.html",
    "./src/renderer/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        discord: {
          dark: '#313338',
          darker: '#2b2d31',
          darkest: '#1e1f22',
          blurple: '#5865f2',
          green: '#23a559',
          yellow: '#f0b232',
          red: '#f23f43',
          text: '#dbdee1',
          muted: '#949ba4',
        }
      }
    },
  },
  plugins: [],
}
