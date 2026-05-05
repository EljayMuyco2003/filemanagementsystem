/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Spotify Dark Theme Colors
        'spotify-black': '#121212',
        'spotify-dark': '#181818',
        'spotify-darker': '#1f1f1f',
        'spotify-green': '#1ed760',
        'spotify-green-hover': '#1db954',
        'spotify-gray': '#b3b3b3',
        'spotify-gray-dark': '#7c7c7c',
        'spotify-border': '#282828',
        'spotify-border-light': '#4d4d4d',
        'spotify-red': '#f3727f',
      },
    },
  },
  plugins: [],
}
