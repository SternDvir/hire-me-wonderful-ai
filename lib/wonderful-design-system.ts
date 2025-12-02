/**
 * Wonderful AI Design System
 *
 * Based on Wonderful.ai's brand identity:
 * - Soft gradient backgrounds (purple, pink, blue, orange)
 * - Floating gradient orbs
 * - Dark mode with colorful accents
 * - Premium, dreamy aesthetics
 * - Clean, spacious layouts
 */

// ============================================================================
// BRAND COLORS - Wonderful AI Palette
// ============================================================================

export const wonderfulColors = {
  // Gradient Orbs (signature Wonderful AI element)
  orbs: {
    purple: 'radial-gradient(circle, rgba(139, 92, 246, 0.6) 0%, rgba(139, 92, 246, 0.1) 70%)',
    pink: 'radial-gradient(circle, rgba(236, 72, 153, 0.6) 0%, rgba(236, 72, 153, 0.1) 70%)',
    blue: 'radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, rgba(59, 130, 246, 0.1) 70%)',
    orange: 'radial-gradient(circle, rgba(251, 146, 60, 0.6) 0%, rgba(251, 146, 60, 0.1) 70%)',
    mixed: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, rgba(236, 72, 153, 0.3) 50%, rgba(59, 130, 246, 0.2) 100%)',
  },

  // Background Gradients
  backgrounds: {
    light: {
      hero: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #ede9fe 100%)',
      section: 'linear-gradient(to bottom, #ffffff 0%, #faf5ff 100%)',
      card: 'linear-gradient(135deg, #ffffff 0%, #faf5ff 100%)',
    },
    dark: {
      hero: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 50%, #0f0a1e 100%)',
      section: 'linear-gradient(to bottom, #000000 0%, #0a0a0a 100%)',
      card: 'linear-gradient(135deg, #1a1a1a 0%, #1a0a2e 100%)',
    },
  },

  // Primary Brand Colors
  primary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',  // Main purple
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
  },

  // Accent Colors (for gradients)
  accent: {
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

  // Neutrals (Dark Mode Optimized)
  neutral: {
    light: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
    dark: {
      50: '#fafafa',
      100: '#e5e5e5',
      200: '#d4d4d4',
      300: '#a3a3a3',
      400: '#737373',
      500: '#525252',
      600: '#404040',
      700: '#2a2a2a',
      800: '#1a1a1a',
      900: '#0a0a0a',
    },
  },
} as const;

// ============================================================================
// GRADIENT PRESETS
// ============================================================================

export const gradients = {
  // Button Gradients
  button: {
    primary: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    primaryHover: 'linear-gradient(135deg, #9333ea 0%, #db2777 100%)',
    secondary: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    dark: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
  },

  // Card Gradients
  card: {
    light: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(250, 245, 255, 0.9) 100%)',
    dark: 'linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(26, 10, 46, 0.9) 100%)',
    purple: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
    blue: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
  },

  // Text Gradients
  text: {
    primary: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    accent: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
  },

  // Background Overlays
  overlay: {
    light: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(250, 245, 255, 0.9))',
    dark: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(10, 10, 10, 0.9))',
  },
} as const;

// ============================================================================
// SHADOWS & GLOWS
// ============================================================================

export const wonderfulShadows = {
  light: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    glow: '0 0 40px rgba(168, 85, 247, 0.3)',
  },
  dark: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -2px rgba(0, 0, 0, 0.4)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 10px 10px -5px rgba(0, 0, 0, 0.5)',
    glow: '0 0 60px rgba(168, 85, 247, 0.5), 0 0 100px rgba(236, 72, 153, 0.3)',
  },
} as const;

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const wonderfulRadius = {
  sm: '0.5rem',    // 8px
  md: '0.75rem',   // 12px
  lg: '1rem',      // 16px
  xl: '1.5rem',    // 24px
  '2xl': '2rem',   // 32px
  full: '9999px',
} as const;

// ============================================================================
// ANIMATIONS
// ============================================================================

export const wonderfulAnimations = {
  // Floating animation for orbs
  float: `
    @keyframes float {
      0%, 100% { transform: translateY(0px) translateX(0px); }
      33% { transform: translateY(-20px) translateX(10px); }
      66% { transform: translateY(10px) translateX(-10px); }
    }
  `,

  // Pulse glow for interactive elements
  pulseGlow: `
    @keyframes pulseGlow {
      0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.3); }
      50% { box-shadow: 0 0 40px rgba(168, 85, 247, 0.6), 0 0 60px rgba(236, 72, 153, 0.4); }
    }
  `,

  // Gradient shift
  gradientShift: `
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `,

  durations: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '1000ms',
  },

  timings: {
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const wonderfulTypography = {
  fontSizes: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
    '7xl': '4.5rem',   // 72px
  },

  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
} as const;

// ============================================================================
// COMPONENT VARIANTS
// ============================================================================

export const componentVariants = {
  button: {
    // Wonderful AI uses black primary buttons
    primary: {
      light: 'bg-black text-white hover:bg-gray-900',
      dark: 'bg-white text-black hover:bg-gray-100',
    },
    // Outlined secondary buttons
    secondary: {
      light: 'bg-transparent border-2 border-black text-black hover:bg-black hover:text-white',
      dark: 'bg-transparent border-2 border-white text-white hover:bg-white hover:text-black',
    },
    // Gradient accent buttons
    gradient: {
      light: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600',
      dark: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600',
    },
  },

  card: {
    default: {
      light: 'bg-white border border-gray-200 shadow-lg',
      dark: 'bg-gray-900 border border-gray-800 shadow-xl',
    },
    elevated: {
      light: 'bg-white shadow-2xl',
      dark: 'bg-gray-900 shadow-2xl',
    },
    gradient: {
      light: 'bg-gradient-to-br from-white to-purple-50 border border-purple-100 shadow-lg',
      dark: 'bg-gradient-to-br from-gray-900 to-purple-950 border border-purple-900 shadow-xl',
    },
  },
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const createOrb = (color: keyof typeof wonderfulColors.orbs, size: number = 200) => ({
  width: `${size}px`,
  height: `${size}px`,
  background: wonderfulColors.orbs[color],
  borderRadius: '50%',
  filter: 'blur(40px)',
  opacity: 0.6,
});

export const applyGradientText = (gradient: string) => ({
  background: gradient,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
});
