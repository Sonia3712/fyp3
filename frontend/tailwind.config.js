/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "oklch(0.92 0 0)",
        input: "oklch(0.96 0 0)",
        ring: "oklch(0.56 0.18 190)",
        background: "oklch(0.98 0 0)",
        foreground: "oklch(0.12 0 0)",
        primary: {
          DEFAULT: "oklch(0.40 0.15 285)",
          foreground: "oklch(0.98 0 0)",
        },
        secondary: {
          DEFAULT: "oklch(0.45 0.15 200)",
          foreground: "oklch(0.98 0 0)",
        },
        destructive: {
          DEFAULT: "oklch(0.577 0.245 27.325)",
          foreground: "oklch(1 0 0)",
        },
        muted: {
          DEFAULT: "oklch(0.93 0 0)",
          foreground: "oklch(0.50 0 0)",
        },
        accent: {
          DEFAULT: "oklch(0.56 0.18 190)",
          foreground: "oklch(0.98 0 0)",
        },
        popover: {
          DEFAULT: "oklch(1 0 0)",
          foreground: "oklch(0.12 0 0)",
        },
        card: {
          DEFAULT: "oklch(1 0 0)",
          foreground: "oklch(0.12 0 0)",
        },
      },
      borderRadius: {
        lg: "0.75rem",
        md: "calc(0.75rem - 2px)",
        sm: "calc(0.75rem - 4px)",
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.6s ease-out',
        'glow': 'glow 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-scale': 'pulse-scale 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'bounce-in': 'bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'rotate': 'rotate-360 20s linear infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'blob': 'blob-animation 7s infinite',
        'counter': 'counter-up 0.8s ease-out',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}