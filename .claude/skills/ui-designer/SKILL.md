---
name: ui-designer
description: Specializes in UI/UX design for professional SaaS applications. Activate when designing interfaces, creating design specifications, planning component architecture, selecting color palettes, or improving visual consistency. Targets technical users with clean, data-dense, professional aesthetics.
---

# UI Designer Skill - Professional SaaS for Technical Users

## Design Philosophy

This skill guides UI decisions for **Hire Me Wonderful AI** - a candidate screening tool for technical users (recruiters, hiring managers, CTOs). The design must be:

1. **Professional & Clean** - No playful gradients or "Lovable" aesthetics
2. **Data-Dense** - Efficiently display candidate information
3. **Scannable** - Quick visual hierarchy for decision-making
4. **Keyboard-Friendly** - Technical users expect shortcuts
5. **Dark Mode First** - Engineers prefer dark interfaces

## Target Aesthetic

Reference tools: **Linear**, **Raycast**, **Vercel Dashboard**, **GitHub**, **Notion**

### What We Want
- Muted, sophisticated color palette
- Clear visual hierarchy with proper spacing
- Data tables that are easy to scan
- Subtle hover states and transitions
- Monospace fonts for data/codes
- Dense but not cramped information display

### What We Avoid
- Bright gradients and playful colors
- Rounded "pill" shapes everywhere
- Excessive shadows and glows
- Decorative elements without purpose
- Low information density
- Consumer app aesthetics

## Color Palette Guidelines

### Dark Mode (Primary)
```
Background:     #0a0a0a (near black)
Surface:        #141414 (cards, panels)
Surface Hover:  #1a1a1a
Border:         #262626 (subtle dividers)
Border Focus:   #404040

Text Primary:   #fafafa (white-ish)
Text Secondary: #a1a1a1 (muted)
Text Tertiary:  #6b6b6b (disabled/hints)

Accent:         #3b82f6 (blue - primary actions)
Success:        #22c55e (green - PASS)
Danger:         #ef4444 (red - REJECT)
Warning:        #f59e0b (amber - needs review)
```

### Light Mode (Secondary)
```
Background:     #ffffff
Surface:        #fafafa
Surface Hover:  #f4f4f5
Border:         #e4e4e7
Border Focus:   #a1a1aa

Text Primary:   #09090b
Text Secondary: #52525b
Text Tertiary:  #a1a1aa

(Same accent colors, slightly adjusted for contrast)
```

## Typography Scale

```
Font Family:    Inter (UI), JetBrains Mono (code/data)

Display:        2.25rem (36px) - Page titles
Heading 1:      1.5rem (24px) - Section headers
Heading 2:      1.25rem (20px) - Card titles
Body:           0.875rem (14px) - Primary content
Small:          0.75rem (12px) - Labels, metadata
Tiny:           0.625rem (10px) - Badges, counts

Line Heights:   1.2 (headings), 1.5 (body)
Font Weights:   400 (normal), 500 (medium), 600 (semibold)
```

## Spacing System

Use 4px base unit (Tailwind default):
```
xs:   4px   (gap-1)
sm:   8px   (gap-2)
md:   16px  (gap-4)
lg:   24px  (gap-6)
xl:   32px  (gap-8)
2xl:  48px  (gap-12)
```

## Component Patterns

### Cards
- Background: surface color
- Border: 1px solid border color
- Border radius: 8px (rounded-lg)
- Padding: 16px-24px
- No shadows in dark mode, subtle shadow in light mode

### Buttons
```
Primary:    bg-blue-600 hover:bg-blue-700 text-white
Secondary:  bg-transparent border border-zinc-700 hover:bg-zinc-800
Ghost:      bg-transparent hover:bg-zinc-800 text-zinc-400
Danger:     bg-red-600 hover:bg-red-700 text-white

Height:     32px (sm), 36px (md), 40px (lg)
Padding:    px-3 (sm), px-4 (md)
Radius:     6px (rounded-md)
```

### Tables
- Header: sticky, bg-zinc-900, text-xs uppercase tracking-wide
- Rows: hover:bg-zinc-800/50, border-b border-zinc-800
- Cells: py-3 px-4, align based on content type
- Sortable columns with clear indicators

### Badges/Status
```
PASS:       bg-green-500/10 text-green-400 border-green-500/20
REJECT:     bg-red-500/10 text-red-400 border-red-500/20
PENDING:    bg-zinc-500/10 text-zinc-400 border-zinc-500/20
REVIEW:     bg-amber-500/10 text-amber-400 border-amber-500/20
```

### Forms
- Input height: 36px
- Background: bg-zinc-900
- Border: border-zinc-700 focus:border-blue-500
- Label: text-sm text-zinc-400 mb-1.5
- Focus ring: ring-1 ring-blue-500/50

## Layout Principles

### Page Structure
```
┌─────────────────────────────────────────────────┐
│ Navigation Bar (h-14, sticky)                   │
├─────────┬───────────────────────────────────────┤
│ Sidebar │ Main Content Area                     │
│ (w-64)  │                                       │
│         │ ┌─────────────────────────────────┐   │
│ - Nav   │ │ Page Header + Actions           │   │
│ - Links │ ├─────────────────────────────────┤   │
│         │ │                                 │   │
│         │ │ Content (max-w-6xl centered)    │   │
│         │ │                                 │   │
│         │ └─────────────────────────────────┘   │
└─────────┴───────────────────────────────────────┘
```

### Information Density
- Use tables for list views (not cards grid)
- Show key metrics inline, details on hover/click
- Collapsible sections for secondary info
- Keyboard shortcuts for power users

## Interaction Patterns

### Hover States
- Subtle background change (not dramatic)
- Transition duration: 150ms
- Show additional actions on row hover

### Focus States
- Clear ring outline (ring-2 ring-blue-500)
- Never remove focus indicators
- Skip to main content link

### Loading States
- Skeleton loaders matching content shape
- Subtle pulse animation
- Never block entire page

## File References

When implementing designs, reference:
- `tailwind.config.ts` - Extend with design tokens
- `lib/design-system.ts` - Existing (unused) tokens
- `components/ui/` - Reusable components

## Implementation Checklist

Before finalizing UI changes:
- [ ] Works in dark mode (primary)
- [ ] Works in light mode (secondary)
- [ ] Text is readable (contrast ratio 4.5:1+)
- [ ] Interactive elements have hover/focus states
- [ ] Tables are sortable where appropriate
- [ ] Loading states are implemented
- [ ] Keyboard navigation works
- [ ] Consistent spacing throughout
- [ ] No decorative-only elements
