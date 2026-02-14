/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        baseDark: '#060102',
        baseLight: '#fff1ef',
        neonPurple: '#ff2b55',
        neonBlue: '#ff6a3d',
        neonPink: '#ff3d7f',
        cyanSoft: '#ffb347',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Orbitron', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 24px rgba(255, 43, 85, 0.55)',
        neonBlue: '0 0 28px rgba(255, 106, 61, 0.45)',
        glass: '0 14px 40px rgba(7, 10, 25, 0.35)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
