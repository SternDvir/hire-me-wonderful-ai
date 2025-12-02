# Wonderful AI Design System

A comprehensive, industry-standard design system inspired by Apple's clean aesthetic and Wonderful AI's sophisticated brand identity.

## Overview

This design system provides a consistent, scalable foundation for building beautiful, accessible user interfaces. All components follow modern best practices and maintain visual harmony across the application.

---

## Design Principles

### 1. **Clarity Over Cleverness**
Every element serves a purpose. Remove unnecessary decorations and focus on content.

### 2. **Consistency is King**
Use the same patterns, colors, and spacing throughout the app. Predictability builds trust.

### 3. **Progressive Disclosure**
Show only what's necessary. Reveal complexity gradually as users need it.

### 4. **Delight in Details**
Smooth transitions, hover states, and micro-interactions create a premium feel.

---

## Color Palette

### Primary Purple
Our signature color for primary actions and brand elements.

```typescript
primary-50  → #f5f3ff (lightest)
primary-600 → #7c3aed (main)
primary-700 → #6d28d9 (hover)
```

### Neutral Grays
High-contrast grays for better readability.

```typescript
neutral-50  → #fafafa (backgrounds)
neutral-600 → #525252 (secondary text)
neutral-900 → #171717 (primary text)
```

### Semantic Colors
```typescript
Success (Green): #10b981
Error (Red):     #ef4444
Warning (Orange): #f59e0b
Info (Blue):     #3b82f6
```

---

## Typography

### Font Stack
- **Sans:** Geist Sans (primary), SF Pro, Inter (fallback)
- **Mono:** Geist Mono, SF Mono, Cascadia Code

### Type Scale
```
xs   → 12px (labels, captions)
sm   → 14px (secondary text)
base → 16px (body text)
lg   → 18px (subheadings)
xl   → 20px (headings)
2xl  → 24px (page titles)
3xl  → 30px (hero text)
4xl  → 36px (display text)
```

### Font Weights
- **Regular (400):** Body text
- **Medium (500):** Emphasized text
- **Semibold (600):** Subheadings
- **Bold (700):** Headings
- **Black (900):** Display numbers

---

## Spacing System

Based on 4px grid (0.25rem increments).

```
1  → 4px   (tight spacing)
2  → 8px   (default gap)
3  → 12px  (small padding)
4  → 16px  (base unit)
6  → 24px  (section spacing)
8  → 32px  (large spacing)
12 → 48px  (page sections)
16 → 64px  (major divisions)
```

**Golden Rule:** Use multiples of 4px for all spacing.

---

## Components

### Buttons

```tsx
import { Button } from '@/components/ui/Button';

// Primary action
<Button variant="primary">Save Changes</Button>

// Secondary action
<Button variant="secondary">Cancel</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button> // default
<Button size="lg">Large</Button>

// Loading state
<Button loading>Processing...</Button>
```

**Button Variants:**
- `primary` → Purple gradient, white text
- `secondary` → White background, gray border
- `ghost` → Transparent, hover background
- `danger` → Red background for destructive actions

### Cards

```tsx
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

<Card variant="elevated">
  <CardHeader>
    <CardTitle>Candidate Details</CardTitle>
    <CardDescription>View complete evaluation</CardDescription>
  </CardHeader>
  {/* Card content */}
</Card>
```

**Card Variants:**
- `default` → Border, subtle shadow
- `elevated` → Prominent shadow, no border
- `flat` → Gray background, no shadow
- `interactive` → Hover effects, clickable

### Badges

```tsx
import { Badge } from '@/components/ui/Badge';

<Badge variant="success">Passed</Badge>
<Badge variant="error">Rejected</Badge>
<Badge variant="purple" size="lg">Featured</Badge>
```

---

## Layout Patterns

### Container Widths
```tsx
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
  {/* Responsive container with padding */}
</div>
```

### Grid Layouts
```tsx
{/* 2-column grid on desktop, stack on mobile */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Grid items */}
</div>

{/* Stats grid */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {/* Stat cards */}
</div>
```

---

## Animation Guidelines

### Durations
- **Fast (150ms):** Hover states, tooltips
- **Default (200ms):** Most transitions
- **Slow (300ms):** Modal entry/exit
- **Slower (500ms):** Page transitions

### Timing Functions
```css
ease-out     → Start fast, end slow (best for entry)
ease-in      → Start slow, end fast (best for exit)
ease-in-out  → Smooth both ends (general purpose)
```

### Common Patterns
```tsx
// Hover transition
className="transition-all duration-200 hover:shadow-lg"

// Fade in
className="animate-in fade-in duration-200"

// Slide up
className="animate-slide-in-from-bottom-4 duration-300"
```

---

## Shadows & Depth

```tsx
shadow-sm   → Subtle elevation
shadow-md   → Card hover states
shadow-lg   → Modals, dropdowns
shadow-xl   → Hero elements
shadow-2xl  → Maximum elevation
```

**Layering Strategy:**
1. Base layer: `shadow-sm`
2. Hover state: `shadow-md`
3. Active/Focus: `shadow-lg`
4. Modals: `shadow-2xl`

---

## Border Radius

```
rounded-lg  → 12px (default)
rounded-xl  → 16px (cards)
rounded-2xl → 24px (modals, large cards)
rounded-full → Pills, avatars
```

---

## Accessibility

### Color Contrast
All text meets WCAG AA standards:
- Gray-900 on white: 16.

:1 (excellent)
- Gray-700 on white: 8.59:1 (excellent)
- Gray-600 on white: 4.69:1 (good)

### Focus States
All interactive elements have visible focus rings:
```tsx
focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
```

### Keyboard Navigation
- All buttons/links are keyboard accessible
- Modal trap focus within them
- ESC key closes modals

---

## Usage Examples

### Page Header
```tsx
<div className="mb-12">
  <h1 className="text-4xl font-bold text-gray-900 mb-2">
    Dashboard
  </h1>
  <p className="text-gray-700">
    Overview of your screening sessions
  </p>
</div>
```

### Stat Card
```tsx
<Card variant="flat" padding="md">
  <div className="text-sm text-gray-600 font-medium mb-1">
    Total Candidates
  </div>
  <div className="text-3xl font-bold text-gray-900">
    {count}
  </div>
</Card>
```

### Table Header
```tsx
<th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
  Candidate Name
</th>
```

---

## Best Practices

### DO ✅
- Use the design tokens from `lib/design-system.ts`
- Maintain consistent spacing with the 4px grid
- Use semantic color names (success, error, warning)
- Add hover states to interactive elements
- Test on mobile and desktop
- Use font-medium or font-semibold for emphasis

### DON'T ❌
- Use arbitrary color values (use palette)
- Mix different border radius sizes in one section
- Skip hover states on clickable elements
- Use light gray text (text-gray-500 or lighter) for body copy
- Create custom shadows (use the scale)
- Use animations longer than 500ms

---

## Maintenance

### Adding New Colors
1. Add to `lib/design-system.ts`
2. Update this documentation
3. Ensure WCAG AA contrast
4. Test in light/dark contexts

### Creating New Components
1. Use existing components as templates
2. Follow naming conventions (PascalCase)
3. Export from `components/ui/`
4. Document usage in this file
5. Include TypeScript types

---

## Migration Guide

### Updating Old Components
1. Replace custom colors with design tokens
2. Update spacing to 4px grid
3. Add hover/focus states
4. Use new Button/Card components
5. Test responsiveness

### Common Replacements
```tsx
// Old
<div className="bg-blue-600"> → <div className="bg-purple-600">
<div className="p-5">          → <div className="p-6"> // 24px
<div className="rounded">      → <div className="rounded-xl">
```

---

## Support

For questions or suggestions about the design system:
1. Check this documentation first
2. Review existing component implementations
3. Maintain consistency with established patterns

**Remember:** A good design system is living documentation. Update this file as the system evolves.
