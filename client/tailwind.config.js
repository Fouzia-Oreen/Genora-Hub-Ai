/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
			colors: {
        // base_color
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

        // resume_color
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				resume: {
					text: 'hsl(var(--resume-text))',
					'text-light': 'hsl(var(--resume-text-light))',
					accent: 'hsl(var(--resume-accent))',
					divider: 'hsl(var(--resume-divider))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
      // colors: {
      //   color_1: '#1F2228',
      //   color_2: '#172554',
      //   color_3: '#172554',
      //   color_4: '#1D357B',
      //   color_5: '#1D4ED8',
      //   color_6: '#2563EB',
      //   color_7: '#3B82F6',
      //   color_8: '#60A5FA',
      //   color_9: '#F3F5F8',
      //   color_10: '#EA580C',
      //   color_11: '#F97316',
      // },
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
        // resume_keyframes
        				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
      },
      animation: {
        sparkle: 'sparkle 1.5s ease-in-out infinite',
        // resume_animation
        'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
      },
    },
  },
  plugins: [
     require('tailwind-scrollbar'), 
     require("tailwindcss-animate")
  ],
}