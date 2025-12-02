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
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
      },
      colors: {
        // Linear-inspired warm dark palette
        background: {
          DEFAULT: '#0f0f12',      // Slightly warmer black with blue undertone
          secondary: '#16161a',    // Card backgrounds
          tertiary: '#1c1c21',     // Hover states
          elevated: '#222228',     // Elevated surfaces
          highlight: '#2a2a32',    // Active/selected states
        },
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.08)',
          subtle: 'rgba(255, 255, 255, 0.04)',
          focus: 'rgba(255, 255, 255, 0.16)',
        },
        text: {
          primary: '#ececf1',      // Softer white
          secondary: '#8e8ea0',    // Muted text with warmth
          tertiary: '#5c5c6f',     // Even more muted
          inverse: '#0f0f12',
        },
        // Softer purple-blue accent (Linear-inspired)
        accent: {
          DEFAULT: '#5e6ad2',      // Linear's signature purple-blue
          hover: '#7c85e3',        // Lighter on hover
          muted: 'rgba(94, 106, 210, 0.12)',
          glow: 'rgba(94, 106, 210, 0.25)',
        },
        // Softer semantic colors
        success: {
          DEFAULT: '#2da44e',      // GitHub green
          light: '#3fb950',
          muted: 'rgba(45, 164, 78, 0.12)',
          border: 'rgba(45, 164, 78, 0.25)',
        },
        danger: {
          DEFAULT: '#f85149',      // Warm red
          light: '#ff7b72',
          muted: 'rgba(248, 81, 73, 0.12)',
          border: 'rgba(248, 81, 73, 0.25)',
        },
        warning: {
          DEFAULT: '#d29922',      // Warm amber
          light: '#e3b341',
          muted: 'rgba(210, 153, 34, 0.12)',
          border: 'rgba(210, 153, 34, 0.25)',
        },
        neutral: {
          DEFAULT: '#6e7681',
          light: '#8b949e',
          muted: 'rgba(110, 118, 129, 0.12)',
          border: 'rgba(110, 118, 129, 0.25)',
        },
      },
      fontSize: {
        'display': ['2rem', { lineHeight: '1.25', fontWeight: '600', letterSpacing: '-0.02em' }],
        'h1': ['1.375rem', { lineHeight: '1.35', fontWeight: '600', letterSpacing: '-0.01em' }],
        'h2': ['1.125rem', { lineHeight: '1.4', fontWeight: '500' }],
        'h3': ['1rem', { lineHeight: '1.5', fontWeight: '500' }],
        'body': ['0.875rem', { lineHeight: '1.6', fontWeight: '400' }],
        'small': ['0.8125rem', { lineHeight: '1.5', fontWeight: '400' }],
        'tiny': ['0.6875rem', { lineHeight: '1.4', fontWeight: '500', letterSpacing: '0.02em' }],
      },
      borderRadius: {
        'sm': '0.375rem',
        'DEFAULT': '0.5rem',
        'md': '0.625rem',
        'lg': '0.875rem',
        'xl': '1rem',
      },
      boxShadow: {
        'soft': '0 1px 2px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)',
        'elevated': '0 4px 12px rgba(0, 0, 0, 0.4), 0 1px 4px rgba(0, 0, 0, 0.3)',
        'glow': '0 0 20px rgba(94, 106, 210, 0.15)',
        'glow-success': '0 0 20px rgba(45, 164, 78, 0.15)',
        'glow-danger': '0 0 20px rgba(248, 81, 73, 0.15)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'subtle-glow': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(94, 106, 210, 0.15), transparent)',
        'card-gradient': 'linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0) 100%)',
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { transform: "translateY(0.5rem)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "pulse-soft": {
          '0%, 100%': { opacity: "1" },
          '50%': { opacity: "0.7" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "slide-up": "slide-up 0.25s ease-out",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
