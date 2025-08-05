import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        body: ['PT Sans', 'sans-serif'], // Clean, readable body font
        headline: ['Belleza', 'sans-serif'], // Stylized headline font
        // Add a more "funky" or "nganya-style" font if available and desired
        // funky: ['YourFunkyFont', 'Belleza', 'sans-serif'], 
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        highlight: 'hsl(var(--highlight-hue) var(--highlight-saturation) var(--highlight-lightness))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: 'calc(var(--radius) + 4px)', // For more rounded nganya feel
        '2xl': 'calc(var(--radius) + 8px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'slide-in-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0'},
          '100%': { transform: 'translateY(0)', opacity: '1'},
        },
        'slide-out-down': {
          '0%': { transform: 'translateY(0)', opacity: '1'},
          '100%': { transform: 'translateY(100%)', opacity: '0'},
        },
        'nganya-glow': { /* Added from globals.css for consistency */
          from: {
            filter: 'drop-shadow(0 0 5px hsl(var(--primary))) drop-shadow(0 0 10px hsl(var(--primary)))',
            opacity: '0.8',
          },
          to: {
            filter: 'drop-shadow(0 0 10px hsl(var(--primary))) drop-shadow(0 0 20px hsl(var(--primary)))',
            opacity: '1',
          },
        },
        'scroll-bg-rtl': { /* Added from globals.css */
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'burst': { /* Added from globals.css */
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '50%': { transform: 'scale(1.2)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '0' },
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'fade-out': 'fade-out 0.5s ease-out forwards',
        'slide-in-up': 'slide-in-up 0.5s ease-out forwards',
        'slide-out-down': 'slide-out-down 0.5s ease-out forwards',
        'nganya-glow': 'nganya-glow 1.5s infinite alternate',
        'scroll-bg-rtl': 'scroll-bg-rtl 180s linear infinite',
        'burst': 'burst 0.8s ease-out forwards',
      },
      boxShadow: {
        'glow-primary-sm': '0 0 8px 1px hsla(var(--primary), 0.6), 0 0 12px 3px hsla(var(--primary), 0.3)',
        'glow-primary-md': '0 0 15px 3px hsla(var(--primary), 0.7), 0 0 25px 8px hsla(var(--primary), 0.4)',
        'glow-accent-sm': '0 0 8px 1px hsla(var(--accent), 0.6), 0 0 12px 3px hsla(var(--accent), 0.3)',
        'glow-accent-md': '0 0 15px 3px hsla(var(--accent), 0.7), 0 0 25px 8px hsla(var(--accent), 0.4)',
      }
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
