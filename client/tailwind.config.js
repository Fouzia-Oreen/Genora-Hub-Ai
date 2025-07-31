/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        color_1: '#1F2228',
        color_2: '#172554',
        color_3: '#172554',
        color_4: '#1D357B',
        color_5: '#1D4ED8',
        color_6: '#2563EB',
        color_7: '#3B82F6',
        color_8: '#60A5FA',
        color_9: '#F3F5F8',
        color_10: '#EA580C',
        color_11: '#F97316',
      },
      backgroundImage: {
        'gradient-1': 'linear-gradient(to right, #F86D1D, #F14742)',
        'gradient-2': 'linear-gradient(to right, #1D4ED8, #1E3A8B)',
        'gradient-3': 'linear-gradient(to right, #1E6FEB, #1D4ED8)',
      },
      keyframes: {
        sparkle: {
          '0%, 100%': { transform: 'rotate(0deg) scale(1)', opacity: '1' },
          '50%': { transform: 'rotate(15deg) scale(1.1)', opacity: '0.8' },
        },
      },
      animation: {
        sparkle: 'sparkle 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [
     require('tailwind-scrollbar'),
  ],
}