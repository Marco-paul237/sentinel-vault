/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'midnight-blue': 'var(--color-midnight-blue)',
        'sentinel-teal': 'var(--color-sentinel-teal)',
        'cloud-white': 'var(--color-cloud-white)',
        'graphite': 'var(--color-graphite)',
        'alert-red': 'var(--color-alert-red)',
        'safe-green': 'var(--color-safe-green)',
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'glass-bg': 'var(--glass-bg)',
        'glass-border': 'var(--glass-border)',
      },
      fontFamily: {
        'primary': ['var(--font-primary)'],
        'mono': ['var(--font-mono)'],
      },
      animation: {
        'pulse-alert': 'pulse-alert 2s infinite',
      }
    },
  },
  plugins: [],
}
