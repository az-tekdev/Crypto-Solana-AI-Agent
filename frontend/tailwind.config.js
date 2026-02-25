/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'solana-purple': '#9945FF',
        'solana-green': '#14F195',
        'neon-cyan': '#00FFFF',
        'neon-pink': '#FF00FF',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #9945FF, 0 0 10px #9945FF' },
          '100%': { boxShadow: '0 0 10px #9945FF, 0 0 20px #9945FF, 0 0 30px #9945FF' },
        },
      },
    },
  },
  plugins: [],
}
