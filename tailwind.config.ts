import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        wonderful: {
          purple: {
            50: '#faf5ff',
            100: '#f3e8ff',
            200: '#e9d5ff',
            300: '#d8b4fe',
            400: '#c084fc',
            500: '#a855f7',
            600: '#9333ea',
            700: '#7e22ce',
            800: '#6b21a8',
            900: '#581c87',
          },
          pink: {
            400: '#f472b6',
            500: '#ec4899',
            600: '#db2777',
          },
          blue: {
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb',
          },
          orange: {
            400: '#fb923c',
            500: '#f97316',
            600: '#ea580c',
          },
        },
      },
      backgroundImage: {
        // Gradient orbs
        'orb-purple': 'radial-gradient(circle, rgba(139, 92, 246, 0.6) 0%, rgba(139, 92, 246, 0.1) 70%)',
        'orb-pink': 'radial-gradient(circle, rgba(236, 72, 153, 0.6) 0%, rgba(236, 72, 153, 0.1) 70%)',
        'orb-blue': 'radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, rgba(59, 130, 246, 0.1) 70%)',
        'orb-orange': 'radial-gradient(circle, rgba(251, 146, 60, 0.6) 0%, rgba(251, 146, 60, 0.1) 70%)',
        'orb-mixed': 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, rgba(236, 72, 153, 0.3) 50%, rgba(59, 130, 246, 0.2) 100%)',

        // Background gradients
        'hero-light': 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #ede9fe 100%)',
        'hero-dark': 'linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 50%, #0f0a1e 100%)',
        'section-light': 'linear-gradient(to bottom, #ffffff 0%, #faf5ff 100%)',
        'section-dark': 'linear-gradient(to bottom, #000000 0%, #0a0a0a 100%)',

        // Button gradients
        'btn-primary': 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
        'btn-primary-hover': 'linear-gradient(135deg, #9333ea 0%, #db2777 100%)',
        'btn-secondary': 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',

        // Card gradients
        'card-light': 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(250, 245, 255, 0.9) 100%)',
        'card-dark': 'linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(26, 10, 46, 0.9) 100%)',
        'card-purple': 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',

        // Text gradients
        'text-primary': 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
        'text-accent': 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
      },
      boxShadow: {
        'glow-light': '0 0 40px rgba(168, 85, 247, 0.3)',
        'glow-dark': '0 0 60px rgba(168, 85, 247, 0.5), 0 0 100px rgba(236, 72, 153, 0.3)',
        'wonderful-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'wonderful-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'wonderful-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'wonderful-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'wonderful-sm': '0.5rem',
        'wonderful-md': '0.75rem',
        'wonderful-lg': '1rem',
        'wonderful-xl': '1.5rem',
        'wonderful-2xl': '2rem',
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-in-from-bottom-4": {
          from: {
            transform: "translateY(1rem)",
            opacity: "0",
          },
          to: {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '33%': { transform: 'translateY(-20px) translateX(10px)' },
          '66%': { transform: 'translateY(10px) translateX(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(168, 85, 247, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(168, 85, 247, 0.6), 0 0 60px rgba(236, 72, 153, 0.4)' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      animation: {
        "in": "fade-in 0.2s ease-in",
        "slide-in-from-bottom-4": "slide-in-from-bottom-4 0.3s ease-out",
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "gradient-shift": "gradientShift 3s ease infinite",
      },
      transitionTimingFunction: {
        'wonderful-smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'wonderful-bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
    },
  },
  plugins: [],
};
export default config;
