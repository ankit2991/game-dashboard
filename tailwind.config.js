/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0B1020',
          secondary: '#121A2D',
          card: '#182238',
          cardHover: '#1F2C49',
          border: '#233252',
          borderLight: '#2D3E66',
          purple: '#7C5CFC',
          purpleHover: '#6947eb',
          cyan: '#00D4FF',
          cyanHover: '#00b8de',
          emerald: '#20C997',
          amber: '#FFB547',
          rose: '#FF5D73',
          text: '#F5F7FF',
          muted: '#98A5BF',
          darkMuted: '#64748B',
        },
        lightBg: '#F5F7FC',
        lightCard: '#FFFFFF',
        lightBorder: '#E2E8F0',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'glow-purple': '0 0 25px -5px rgba(124, 92, 252, 0.4)',
        'glow-cyan': '0 0 25px -5px rgba(0, 212, 255, 0.4)',
        'glow-card': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': 'radial-gradient(circle at 50% 20%, rgba(124, 92, 252, 0.15) 0%, rgba(11, 16, 32, 0) 70%)',
      }
    },
  },
  plugins: [],
}
