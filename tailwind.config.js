export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'bounce-random': 'bounce 1s ease-in-out infinite',
        'pulse-fast': 'pulse 0.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}