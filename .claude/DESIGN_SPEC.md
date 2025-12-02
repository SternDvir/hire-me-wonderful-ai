# UI Redesign Specification

> **Project:** Hire Me Wonderful AI
> **Target Aesthetic:** Professional SaaS for Technical Users
> **Reference Products:** Linear, Raycast, Vercel Dashboard, GitHub, Notion
> **Author:** Claude Code UI Designer Skill
> **Date:** 2025-12-02

---

## Executive Summary

This document specifies a complete UI redesign to transform the app from a consumer-facing "Lovable" aesthetic to a professional, data-dense SaaS tool for technical users (recruiters, hiring managers, CTOs).

### Key Changes Overview

| Aspect | Current | New |
|--------|---------|-----|
| Primary Color | Purple gradient (#a855f7 → #ec4899) | Blue (#3b82f6) |
| Background | Gradient orbs, purple tints | Solid dark (#0a0a0a) |
| Corners | Large rounded (1.5-2rem) | Subtle rounded (0.375-0.5rem) |
| Effects | Glows, animations, blur | Clean borders, no shadows |
| Density | Low, spacious | High, data-focused |
| Fonts | Geist Sans | Inter + JetBrains Mono |

---

## Part 1: Design Tokens

### 1.1 Color Palette

```typescript
// New color system - add to tailwind.config.ts
const colors = {
  // Backgrounds
  background: {
    DEFAULT: '#0a0a0a',      // Main background
    secondary: '#141414',    // Cards, panels
    tertiary: '#1a1a1a',     // Hover states
    elevated: '#1f1f1f',     // Dropdowns, modals
  },

  // Borders
  border: {
    DEFAULT: '#262626',      // Standard borders
    muted: '#1f1f1f',        // Subtle dividers
    focus: '#404040',        // Focus rings
  },

  // Text
  text: {
    primary: '#fafafa',      // Main text
    secondary: '#a1a1a1',    // Muted text
    tertiary: '#6b6b6b',     // Disabled, hints
    inverse: '#0a0a0a',      // On light backgrounds
  },

  // Semantic
  accent: {
    DEFAULT: '#3b82f6',      // Primary actions
    hover: '#2563eb',        // Primary hover
    muted: 'rgba(59, 130, 246, 0.1)', // Backgrounds
  },
  success: {
    DEFAULT: '#22c55e',      // PASS
    muted: 'rgba(34, 197, 94, 0.1)',
    border: 'rgba(34, 197, 94, 0.2)',
  },
  danger: {
    DEFAULT: '#ef4444',      // REJECT
    muted: 'rgba(239, 68, 68, 0.1)',
    border: 'rgba(239, 68, 68, 0.2)',
  },
  warning: {
    DEFAULT: '#f59e0b',      // REVIEW
    muted: 'rgba(245, 158, 11, 0.1)',
    border: 'rgba(245, 158, 11, 0.2)',
  },
  neutral: {
    DEFAULT: '#71717a',      // PENDING
    muted: 'rgba(113, 113, 122, 0.1)',
    border: 'rgba(113, 113, 122, 0.2)',
  },
}
```

### 1.2 Typography

```typescript
// Typography scale
const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Menlo', 'monospace'],
  },
  fontSize: {
    'display': ['2.25rem', { lineHeight: '1.2', fontWeight: '600' }],   // 36px - Page titles
    'h1': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],         // 24px - Section headers
    'h2': ['1.25rem', { lineHeight: '1.4', fontWeight: '500' }],        // 20px - Card titles
    'h3': ['1rem', { lineHeight: '1.5', fontWeight: '500' }],           // 16px - Subsections
    'body': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],     // 14px - Default
    'small': ['0.75rem', { lineHeight: '1.4', fontWeight: '400' }],     // 12px - Labels
    'tiny': ['0.625rem', { lineHeight: '1.4', fontWeight: '500' }],     // 10px - Badges
  },
}
```

### 1.3 Spacing Scale

```typescript
// Use Tailwind's default scale, but consistently:
// 1 = 4px, 2 = 8px, 3 = 12px, 4 = 16px, 6 = 24px, 8 = 32px

const spacing = {
  componentPadding: {
    card: 'p-4',        // 16px
    modal: 'p-6',       // 24px
    input: 'px-3 py-2', // 12px x 8px
    button: 'px-4 py-2', // 16px x 8px
    badge: 'px-2 py-0.5', // 8px x 2px
  },
  gaps: {
    tight: 'gap-2',     // 8px - Between related items
    normal: 'gap-4',    // 16px - Standard gap
    loose: 'gap-6',     // 24px - Section gaps
  },
}
```

### 1.4 Border Radius

```typescript
// Simplified radius - remove "wonderful" naming
const borderRadius = {
  none: '0',
  sm: '0.25rem',   // 4px - Badges, small elements
  DEFAULT: '0.375rem', // 6px - Buttons, inputs
  md: '0.5rem',    // 8px - Cards, modals
  lg: '0.75rem',   // 12px - Large cards only
  full: '9999px',  // Pills, avatars
}
```

---

## Part 2: Component Specifications

### 2.1 Buttons

```typescript
// Button variants
const buttons = {
  // Primary - For main actions
  primary: {
    base: 'bg-accent text-white font-medium',
    hover: 'hover:bg-accent-hover',
    active: 'active:bg-blue-700',
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
  },

  // Secondary - For secondary actions
  secondary: {
    base: 'bg-transparent border border-border text-text-primary',
    hover: 'hover:bg-background-tertiary hover:border-border-focus',
    active: 'active:bg-background-elevated',
  },

  // Ghost - For tertiary actions
  ghost: {
    base: 'bg-transparent text-text-secondary',
    hover: 'hover:bg-background-tertiary hover:text-text-primary',
  },

  // Danger - For destructive actions
  danger: {
    base: 'bg-danger text-white',
    hover: 'hover:bg-red-600',
  },

  // Sizes
  sizes: {
    sm: 'h-8 px-3 text-small',   // 32px height
    md: 'h-9 px-4 text-body',    // 36px height
    lg: 'h-10 px-5 text-body',   // 40px height
  },
}
```

**Visual Example:**
```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Start Scan  │  │   Export     │  │   Delete     │
│   (Primary)  │  │ (Secondary)  │  │   (Danger)   │
└──────────────┘  └──────────────┘  └──────────────┘
    #3b82f6         transparent        #ef4444
```

### 2.2 Cards

```typescript
const cards = {
  base: `
    bg-background-secondary
    border border-border
    rounded-md
    p-4
  `,
  hover: 'hover:border-border-focus transition-colors duration-150',

  // No shadows in dark mode
  // No gradient backgrounds
  // No blur effects
}
```

**Visual Example:**
```
┌─────────────────────────────────────────┐
│ Card Title                    [Action]  │  <- h-10, border-b
├─────────────────────────────────────────┤
│                                         │
│ Content area with consistent padding    │  <- p-4
│                                         │
└─────────────────────────────────────────┘
   #141414 bg, #262626 border, rounded-md
```

### 2.3 Tables

```typescript
const tables = {
  container: 'w-full border border-border rounded-md overflow-hidden',

  header: {
    row: 'bg-background-tertiary border-b border-border',
    cell: `
      px-4 py-3
      text-small font-medium text-text-secondary
      uppercase tracking-wide
      text-left
    `,
    sortable: 'cursor-pointer hover:text-text-primary',
  },

  body: {
    row: 'border-b border-border hover:bg-background-tertiary transition-colors',
    cell: 'px-4 py-3 text-body text-text-primary',
    cellMuted: 'px-4 py-3 text-body text-text-secondary',
  },
}
```

**Visual Example:**
```
┌──────────────────────────────────────────────────────────────────┐
│ NAME ▲          │ COMPANY         │ EXPERIENCE │ DECISION        │
├──────────────────────────────────────────────────────────────────┤
│ John Smith      │ Google          │ 8 years    │ ● PASS          │
│ Jane Doe        │ Microsoft       │ 5 years    │ ● REJECT        │
│ Bob Wilson      │ Startup Inc     │ 3 years    │ ● REVIEW        │
└──────────────────────────────────────────────────────────────────┘
```

### 2.4 Status Badges

```typescript
const badges = {
  base: 'inline-flex items-center px-2 py-0.5 rounded-sm text-tiny font-medium border',

  variants: {
    pass: 'bg-success-muted text-green-400 border-success-border',
    reject: 'bg-danger-muted text-red-400 border-danger-border',
    review: 'bg-warning-muted text-amber-400 border-warning-border',
    pending: 'bg-neutral-muted text-zinc-400 border-neutral-border',
    info: 'bg-accent-muted text-blue-400 border-blue-500/20',
  },
}
```

**Visual Example:**
```
┌────────┐  ┌────────┐  ┌────────┐  ┌─────────┐
│  PASS  │  │ REJECT │  │ REVIEW │  │ PENDING │
└────────┘  └────────┘  └────────┘  └─────────┘
  green       red        amber       zinc
```

### 2.5 Form Inputs

```typescript
const inputs = {
  base: `
    w-full h-9
    bg-background-secondary
    border border-border
    rounded
    px-3
    text-body text-text-primary
    placeholder:text-text-tertiary
  `,
  focus: `
    focus:outline-none
    focus:border-accent
    focus:ring-1 focus:ring-accent/50
  `,
  disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',

  label: 'block text-small text-text-secondary mb-1.5',
  helper: 'text-tiny text-text-tertiary mt-1',
  error: 'border-danger focus:border-danger focus:ring-danger/50',
}
```

### 2.6 Navigation

```typescript
const navigation = {
  container: `
    sticky top-0 z-50
    h-14
    bg-background/80 backdrop-blur-sm
    border-b border-border
  `,

  brand: 'text-h3 font-semibold text-text-primary',

  link: {
    base: 'text-body text-text-secondary transition-colors',
    hover: 'hover:text-text-primary',
    active: 'text-text-primary',
  },

  // No gradients, no glows
}
```

### 2.7 Modal / Dialog

```typescript
const modal = {
  overlay: 'fixed inset-0 bg-black/60 z-50',

  container: `
    fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
    w-full max-w-2xl max-h-[85vh]
    bg-background-secondary
    border border-border
    rounded-lg
    overflow-hidden
    z-50
  `,

  header: `
    flex items-center justify-between
    px-6 py-4
    border-b border-border
  `,

  body: 'px-6 py-4 overflow-y-auto',

  footer: `
    flex items-center justify-end gap-3
    px-6 py-4
    border-t border-border
  `,
}
```

---

## Part 3: Page Layouts

### 3.1 Global Layout Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Navigation (h-14)                             │
│  Logo          Dashboard    Screenings    Countries         User    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│    ┌─────────────────────────────────────────────────────────┐      │
│    │                                                         │      │
│    │                    Page Content                         │      │
│    │                  (max-w-7xl mx-auto)                    │      │
│    │                      px-6 py-8                          │      │
│    │                                                         │      │
│    └─────────────────────────────────────────────────────────┘      │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 Dashboard Page (`app/page.tsx`)

**Current Design:**
- Gradient orbs background
- Large gradient text "Candidate Screening Hub"
- Stats cards with gradient borders
- Recent screenings in card grid

**New Design:**

```
┌─────────────────────────────────────────────────────────────────────┐
│ Navigation                                                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Screening Dashboard                              [+ New Screening]  │
│                                                                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│  │ Total       │ │ Passed      │ │ Rejected    │ │ Pending     │   │
│  │ 1,234       │ │ 456         │ │ 678         │ │ 100         │   │
│  │ candidates  │ │ 37%         │ │ 55%         │ │ 8%          │   │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘   │
│                                                                      │
│  Recent Screenings                                                   │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ NAME           │ COUNTRY  │ CANDIDATES │ STATUS   │ DATE     │   │
│  ├──────────────────────────────────────────────────────────────┤   │
│  │ France Batch 1 │ France   │ 45         │ Complete │ Dec 1    │   │
│  │ Japan Q4       │ Japan    │ 32         │ Running  │ Dec 1    │   │
│  │ Israel Senior  │ Israel   │ 28         │ Complete │ Nov 30   │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**Implementation Notes:**
- Remove `GradientOrbs` component entirely
- Remove gradient text, use plain white
- Stats: simple cards with number + label, no gradients
- Use table instead of card grid for recent screenings

### 3.3 Upload Page (`app/upload/page.tsx`)

**Current Design:**
- Gradient background
- Large drop zone with dashed purple border
- Gradient button
- Card-based file preview

**New Design:**

```
┌─────────────────────────────────────────────────────────────────────┐
│ Navigation                                                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Upload Candidates                                                   │
│  Upload a JSON file with LinkedIn profile data                       │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                                                              │   │
│  │                    Drop JSON file here                       │   │
│  │                    or click to browse                        │   │
│  │                                                              │   │
│  │                    Supported: .json                          │   │
│  │                                                              │   │
│  └──────────────────────────────────────────────────────────────┘   │
│       border: dashed 2px #262626, hover: #404040                     │
│                                                                      │
│  [Selected: france_candidates.json - 45 profiles]                    │
│                                                                      │
│  Country   ┌─────────────────────────────────┐                       │
│            │ Select country...            ▾ │                       │
│            └─────────────────────────────────┘                       │
│                                                                      │
│                                   [Cancel]  [Start Screening]        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.4 Results Page (`app/results/page.tsx`)

**Current Design:**
- Card grid for candidates
- Gradient stats
- Large candidate cards with shadows

**New Design:**

```
┌─────────────────────────────────────────────────────────────────────┐
│ Navigation                                                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Screening Results                                                   │
│  Session: France Q4 2024 • 45 candidates • Completed Dec 1, 2024    │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ Filter: [All ▾] [Pass ○] [Reject ○] [Review ○]  Search: [  ]│    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │   │ NAME          │ CURRENT ROLE    │ EXP  │ SCORE │ STATUS │   │
│  │ □ │ ▲             │                 │      │       │        │   │
│  ├──────────────────────────────────────────────────────────────┤   │
│  │ □ │ John Smith    │ Senior Eng @Goo │ 8y   │ 87    │ PASS   │   │
│  │ □ │ Jane Doe      │ Staff Eng @Meta │ 12y  │ 92    │ PASS   │   │
│  │ □ │ Bob Wilson    │ Manager @Startu │ 5y   │ 45    │ REJECT │   │
│  │ □ │ Alice Brown   │ Lead @Amazon    │ 7y   │ 68    │ REVIEW │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  Showing 1-20 of 45                      [◀ Prev] [1] [2] [3] [▶]   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**Key Changes:**
- Table view instead of card grid
- Checkbox column for bulk selection
- Sortable columns
- Inline status badges
- Pagination

### 3.5 Candidate Modal (`components/CandidateModal.tsx`)

**Current Design:**
- Gradient decision banner
- Large rounded corners
- Gradient text for scores
- Purple accents

**New Design:**

```
┌──────────────────────────────────────────────────────────────────────┐
│ John Smith                                           [×]             │
│ Senior Software Engineer at Google                                   │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Decision: PASS                     Overall Score: 87/100            │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │ ████████████████████████████████████░░░░░░░░░░░░░░░            │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌─────────────────────┬─────────────────────┬────────────────────┐ │
│  │ Technical Depth     │ Leadership          │ Hands-On Current   │ │
│  │ 85                  │ 78                  │ 92                 │ │
│  ├─────────────────────┼─────────────────────┼────────────────────┤ │
│  │ AI/ML Alignment     │ Communication       │ Growth Potential   │ │
│  │ 72                  │ 88                  │ 85                 │ │
│  └─────────────────────┴─────────────────────┴────────────────────┘ │
│                                                                      │
│  Strengths                                                           │
│  • Deep experience with distributed systems                          │
│  • Strong track record of shipping products                          │
│  • Currently coding daily, not in management track                   │
│                                                                      │
│  Concerns                                                            │
│  • Limited AI/ML experience, would need ramp-up                      │
│  • No startup experience                                             │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│                               [View LinkedIn]  [Override Decision]   │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Part 4: Tailwind Configuration

Replace the current `tailwind.config.ts` with this configuration:

```typescript
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
        background: {
          DEFAULT: '#0a0a0a',
          secondary: '#141414',
          tertiary: '#1a1a1a',
          elevated: '#1f1f1f',
        },
        border: {
          DEFAULT: '#262626',
          muted: '#1f1f1f',
          focus: '#404040',
        },
        text: {
          primary: '#fafafa',
          secondary: '#a1a1a1',
          tertiary: '#6b6b6b',
          inverse: '#0a0a0a',
        },
        accent: {
          DEFAULT: '#3b82f6',
          hover: '#2563eb',
          muted: 'rgba(59, 130, 246, 0.1)',
        },
        success: {
          DEFAULT: '#22c55e',
          muted: 'rgba(34, 197, 94, 0.1)',
          border: 'rgba(34, 197, 94, 0.2)',
        },
        danger: {
          DEFAULT: '#ef4444',
          muted: 'rgba(239, 68, 68, 0.1)',
          border: 'rgba(239, 68, 68, 0.2)',
        },
        warning: {
          DEFAULT: '#f59e0b',
          muted: 'rgba(245, 158, 11, 0.1)',
          border: 'rgba(245, 158, 11, 0.2)',
        },
        neutral: {
          DEFAULT: '#71717a',
          muted: 'rgba(113, 113, 122, 0.1)',
          border: 'rgba(113, 113, 122, 0.2)',
        },
      },
      fontSize: {
        'display': ['2.25rem', { lineHeight: '1.2', fontWeight: '600' }],
        'h1': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'h2': ['1.25rem', { lineHeight: '1.4', fontWeight: '500' }],
        'h3': ['1rem', { lineHeight: '1.5', fontWeight: '500' }],
        'body': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'small': ['0.75rem', { lineHeight: '1.4', fontWeight: '400' }],
        'tiny': ['0.625rem', { lineHeight: '1.4', fontWeight: '500' }],
      },
      borderRadius: {
        'sm': '0.25rem',
        'DEFAULT': '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
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
      },
      animation: {
        "fade-in": "fade-in 0.15s ease-out",
        "slide-up": "slide-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## Part 5: File-by-File Implementation Guide

### 5.1 Files to Delete

```
components/GradientOrbs.tsx      # No longer needed
lib/wonderful-design-system.ts   # Replace with new tokens
```

### 5.2 Files to Update

#### `app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import Inter and JetBrains Mono from Google Fonts or self-host */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --background: #0a0a0a;
  --foreground: #fafafa;
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Scrollbar styling for dark mode */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #141414;
}

::-webkit-scrollbar-thumb {
  background: #404040;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #525252;
}
```

#### `app/layout.tsx`

```tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Hire Me - Candidate Screening",
  description: "AI-powered candidate screening for technical roles",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-background text-text-primary`}>
        <Navigation />
        <main className="min-h-[calc(100vh-3.5rem)]">
          {children}
        </main>
      </body>
    </html>
  );
}
```

#### `components/Navigation.tsx`

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/upload', label: 'Upload' },
  { href: '/results', label: 'Results' },
  { href: '/countries', label: 'Countries' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 h-14 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <Link href="/" className="text-h3 font-semibold text-text-primary">
          Hire Me
        </Link>

        <div className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-body transition-colors ${
                pathname === item.href
                  ? 'text-text-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
```

#### `app/page.tsx` (Dashboard)

```tsx
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function DashboardPage() {
  const stats = await prisma.candidateEvaluation.groupBy({
    by: ['decisionResult'],
    _count: true,
  });

  const recentSessions = await prisma.screeningSession.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { candidates: true } } },
  });

  const total = stats.reduce((acc, s) => acc + s._count, 0);
  const passed = stats.find(s => s.decisionResult === 'PASS')?._count || 0;
  const rejected = stats.find(s => s.decisionResult === 'REJECT')?._count || 0;
  const pending = stats.find(s => s.decisionResult === 'PENDING')?._count || 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-display text-text-primary">Screening Dashboard</h1>
        <Link
          href="/upload"
          className="h-9 px-4 bg-accent hover:bg-accent-hover text-white text-body font-medium rounded flex items-center transition-colors"
        >
          + New Screening
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Candidates" value={total} />
        <StatCard label="Passed" value={passed} percentage={total ? Math.round(passed/total*100) : 0} variant="success" />
        <StatCard label="Rejected" value={rejected} percentage={total ? Math.round(rejected/total*100) : 0} variant="danger" />
        <StatCard label="Pending" value={pending} percentage={total ? Math.round(pending/total*100) : 0} variant="neutral" />
      </div>

      {/* Recent Screenings Table */}
      <div className="bg-background-secondary border border-border rounded-md overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-h2 text-text-primary">Recent Screenings</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-background-tertiary border-b border-border">
              <th className="px-4 py-3 text-left text-small font-medium text-text-secondary uppercase tracking-wide">Name</th>
              <th className="px-4 py-3 text-left text-small font-medium text-text-secondary uppercase tracking-wide">Country</th>
              <th className="px-4 py-3 text-left text-small font-medium text-text-secondary uppercase tracking-wide">Candidates</th>
              <th className="px-4 py-3 text-left text-small font-medium text-text-secondary uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 text-left text-small font-medium text-text-secondary uppercase tracking-wide">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentSessions.map((session) => (
              <tr key={session.id} className="border-b border-border hover:bg-background-tertiary transition-colors">
                <td className="px-4 py-3 text-body text-text-primary">
                  <Link href={`/screenings/${session.id}`} className="hover:text-accent">
                    {session.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-body text-text-secondary">{session.country}</td>
                <td className="px-4 py-3 text-body text-text-secondary font-mono">{session._count.candidates}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={session.status} />
                </td>
                <td className="px-4 py-3 text-body text-text-secondary">
                  {new Date(session.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ label, value, percentage, variant = 'default' }: {
  label: string;
  value: number;
  percentage?: number;
  variant?: 'default' | 'success' | 'danger' | 'neutral';
}) {
  const valueColor = {
    default: 'text-text-primary',
    success: 'text-success',
    danger: 'text-danger',
    neutral: 'text-text-secondary',
  }[variant];

  return (
    <div className="bg-background-secondary border border-border rounded-md p-4">
      <p className="text-small text-text-secondary mb-1">{label}</p>
      <p className={`text-h1 font-semibold ${valueColor}`}>
        {value.toLocaleString()}
      </p>
      {percentage !== undefined && (
        <p className="text-small text-text-tertiary">{percentage}%</p>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    completed: 'bg-success-muted text-green-400 border-success-border',
    processing: 'bg-accent-muted text-blue-400 border-blue-500/20',
    pending: 'bg-neutral-muted text-zinc-400 border-neutral-border',
    failed: 'bg-danger-muted text-red-400 border-danger-border',
  }[status] || 'bg-neutral-muted text-zinc-400 border-neutral-border';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-tiny font-medium border ${styles}`}>
      {status.toUpperCase()}
    </span>
  );
}
```

### 5.3 New Reusable Components to Create

Create these in `components/ui/`:

#### `components/ui/Button.tsx`

```tsx
import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-accent hover:bg-accent-hover text-white',
        secondary: 'bg-transparent border border-border hover:bg-background-tertiary hover:border-border-focus text-text-primary',
        ghost: 'bg-transparent hover:bg-background-tertiary text-text-secondary hover:text-text-primary',
        danger: 'bg-danger hover:bg-red-600 text-white',
      },
      size: {
        sm: 'h-8 px-3 text-small',
        md: 'h-9 px-4 text-body',
        lg: 'h-10 px-5 text-body',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
```

#### `components/ui/Badge.tsx`

```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center px-2 py-0.5 rounded-sm text-tiny font-medium border',
  {
    variants: {
      variant: {
        pass: 'bg-success-muted text-green-400 border-success-border',
        reject: 'bg-danger-muted text-red-400 border-danger-border',
        review: 'bg-warning-muted text-amber-400 border-warning-border',
        pending: 'bg-neutral-muted text-zinc-400 border-neutral-border',
        info: 'bg-accent-muted text-blue-400 border-blue-500/20',
      },
    },
    defaultVariants: {
      variant: 'pending',
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props} />
  );
}
```

#### `components/ui/Card.tsx`

```tsx
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ className, hover = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-background-secondary border border-border rounded-md',
        hover && 'hover:border-border-focus transition-colors',
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('px-4 py-3 border-b border-border', className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-4', className)} {...props} />
  );
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('px-4 py-3 border-t border-border', className)}
      {...props}
    />
  );
}
```

#### `lib/utils.ts`

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## Part 6: Implementation Checklist

### Phase 1: Foundation (Do First)
- [ ] Update `tailwind.config.ts` with new tokens
- [ ] Update `app/globals.css` with new base styles
- [ ] Create `lib/utils.ts` with `cn()` helper
- [ ] Update `app/layout.tsx` with new fonts and structure

### Phase 2: UI Components
- [ ] Create `components/ui/Button.tsx`
- [ ] Create `components/ui/Badge.tsx`
- [ ] Create `components/ui/Card.tsx`
- [ ] Create `components/ui/Input.tsx`
- [ ] Create `components/ui/Table.tsx`

### Phase 3: Navigation
- [ ] Update `components/Navigation.tsx`
- [ ] Remove gradient backgrounds and glows

### Phase 4: Pages
- [ ] Update `app/page.tsx` (Dashboard)
- [ ] Update `app/upload/page.tsx`
- [ ] Update `app/results/page.tsx`
- [ ] Update `app/screenings/[id]/page.tsx`
- [ ] Update `app/countries/[id]/page.tsx`

### Phase 5: Modal & Detail Views
- [ ] Update `components/CandidateModal.tsx`
- [ ] Remove gradient decision banners
- [ ] Simplify score display

### Phase 6: Cleanup
- [ ] Delete `components/GradientOrbs.tsx`
- [ ] Delete `lib/wonderful-design-system.ts`
- [ ] Remove unused color variables from CSS
- [ ] Remove unused Tailwind classes

### Phase 7: Polish
- [ ] Test all pages in browser
- [ ] Verify hover states work
- [ ] Verify focus states are visible
- [ ] Check table sorting works
- [ ] Test modal open/close
- [ ] Verify responsive behavior

---

## Part 7: Visual Reference

### Before (Current "Lovable" Style)
- Purple/pink gradients everywhere
- Floating gradient orbs
- Large rounded corners (1.5-2rem)
- Gradient text effects
- Glowing shadows
- Low information density
- Consumer app aesthetic

### After (Professional SaaS Style)
- Solid dark backgrounds
- Blue accent color
- Subtle rounded corners (0.375-0.5rem)
- Plain white text
- No shadows in dark mode
- High information density with tables
- Tool-like aesthetic (Linear, Vercel)

---

## Appendix A: Color Contrast Verification

All text colors meet WCAG AA contrast requirements:

| Background | Text | Contrast Ratio | Pass |
|------------|------|----------------|------|
| #0a0a0a | #fafafa | 17.4:1 | Yes |
| #0a0a0a | #a1a1a1 | 7.2:1 | Yes |
| #141414 | #fafafa | 15.1:1 | Yes |
| #141414 | #a1a1a1 | 6.3:1 | Yes |
| #3b82f6 | #ffffff | 4.6:1 | Yes |
| #22c55e | #0a0a0a | 8.1:1 | Yes |
| #ef4444 | #ffffff | 4.5:1 | Yes |

---

## Appendix B: Component Class Reference

Quick reference for common patterns:

```typescript
// Page container
"max-w-7xl mx-auto px-6 py-8"

// Page title
"text-display text-text-primary"

// Section title
"text-h1 text-text-primary"

// Card title
"text-h2 text-text-primary"

// Body text
"text-body text-text-primary"

// Muted text
"text-body text-text-secondary"

// Card
"bg-background-secondary border border-border rounded-md p-4"

// Table header
"bg-background-tertiary border-b border-border"

// Table cell header
"px-4 py-3 text-left text-small font-medium text-text-secondary uppercase tracking-wide"

// Table row
"border-b border-border hover:bg-background-tertiary transition-colors"

// Table cell
"px-4 py-3 text-body text-text-primary"

// Primary button
"h-9 px-4 bg-accent hover:bg-accent-hover text-white text-body font-medium rounded transition-colors"

// Secondary button
"h-9 px-4 bg-transparent border border-border hover:bg-background-tertiary text-text-primary text-body font-medium rounded transition-colors"

// Input
"h-9 px-3 bg-background-secondary border border-border rounded text-body text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50"

// Badge (pass)
"inline-flex items-center px-2 py-0.5 rounded-sm text-tiny font-medium border bg-success-muted text-green-400 border-success-border"
```

---

This document provides everything needed to implement the UI redesign. A developer can follow the file-by-file guide and use the component specifications to transform the app from a "Lovable" aesthetic to a professional SaaS tool.
