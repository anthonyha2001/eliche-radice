# Eliche Radiche Design System

**Premium • Marine • Minimal • Confident**

A compact design system for luxury yacht maintenance company Eliche Radiche.

---

## Brand Colors

### Navy (Deep Ocean)
The primary brand color representing depth, professionalism, and maritime excellence.

- `navy-950` - `#050B14` - Deepest navy (backgrounds, dark surfaces)
- `navy-900` - `#0A1929` - Primary navy (headers, primary elements)
- `navy-800` - `#1A2332` - Secondary navy (cards, elevated surfaces)
- `navy-700` - `#2A3441` - Tertiary navy (borders, dividers)
- `navy-600` - `#3A4450` - Disabled states

### Gold (Luxury Accent)
The accent color representing premium service, excellence, and luxury.

- `gold-600` - `#B8941F` - Dark gold (hover states)
- `gold-500` - `#D4AF37` - Primary gold (CTAs, highlights)
- `gold-400` - `#E5C158` - Light gold (hover, secondary)
- `gold-300` - `#F0D17A` - Lighter gold (subtle accents)
- `gold-100` - `#F9F5E8` - Gold tint (backgrounds)
- `gold-50` - `#FDFBF5` - Lightest gold (subtle backgrounds)

### White
Pure and clean, representing clarity and professionalism.

- `white` - `#FFFFFF` - Pure white (content, cards)
- `white-off` - `#FEFEFE` - Off-white (subtle backgrounds)

---

## Neutral Palette

Marine-inspired grays for text, backgrounds, and UI elements.

- `gray-900` - `#1F2937` - Charcoal (primary text)
- `gray-800` - `#374151` - Dark gray (secondary text)
- `gray-700` - `#4B5563` - Medium gray (tertiary text)
- `gray-600` - `#6B7280` - Muted text
- `gray-500` - `#9CA3AF` - Placeholder text
- `gray-400` - `#D1D5DB` - Borders, dividers
- `gray-300` - `#E5E7EB` - Light borders
- `gray-200` - `#F3F4F6` - Subtle backgrounds
- `gray-100` - `#F9FAFB` - Backgrounds
- `gray-50` - `#FAFBFC` - Lightest backgrounds

---

## Status Colors

Contextual colors for priority and status indicators.

- `critical` - `#C62828` - Red (urgent/emergency)
- `high` - `#F57C00` - Orange (high priority)
- `normal` - `#2E7D32` - Green (normal/resolved)
- `info` - `#1976D2` - Blue (informational)

---

## Typography Scale

### Font Families
- **Sans-serif**: Inter (UI, body text, interfaces)
- **Serif**: Playfair Display (headings, premium content)

### Font Sizes
- `xs` - `0.75rem` (12px) - Labels, captions
- `sm` - `0.875rem` (14px) - Small text, metadata
- `base` - `1rem` (16px) - Body text
- `lg` - `1.125rem` (18px) - Emphasized text
- `xl` - `1.25rem` (20px) - Subheadings
- `2xl` - `1.5rem` (24px) - Section headings
- `3xl` - `1.875rem` (30px) - Page headings
- `4xl` - `2.25rem` (36px) - Hero headings
- `5xl` - `3rem` (48px) - Display text

### Font Weights
- `light` - 300
- `normal` - 400
- `medium` - 500
- `semibold` - 600
- `bold` - 700

### Line Heights
- `tight` - 1.25 (headings)
- `normal` - 1.5 (body text)
- `relaxed` - 1.75 (long-form content)

---

## Spacing Scale

4px base unit for consistent, precise spacing.

- `0` - `0`
- `1` - `0.25rem` (4px)
- `2` - `0.5rem` (8px)
- `3` - `0.75rem` (12px)
- `4` - `1rem` (16px)
- `5` - `1.25rem` (20px)
- `6` - `1.5rem` (24px)
- `8` - `2rem` (32px)
- `10` - `2.5rem` (40px)
- `12` - `3rem` (48px)
- `16` - `4rem` (64px)
- `20` - `5rem` (80px)
- `24` - `6rem` (96px)

---

## Border Radius

Subtle elegance with consistent rounding.

- `none` - `0`
- `sm` - `0.25rem` (4px) - Small elements
- `base` - `0.375rem` (6px) - Default
- `md` - `0.5rem` (8px) - Cards, buttons
- `lg` - `0.75rem` (12px) - Large cards
- `xl` - `1rem` (16px) - Modals, containers
- `full` - `9999px` - Pills, avatars

---

## Shadows

Depth and elevation with navy-tinted shadows.

- `sm` - Subtle elevation
- `base` - Default elevation
- `md` - Medium elevation (cards)
- `lg` - Large elevation (modals)
- `xl` - Extra large elevation
- `2xl` - Maximum elevation
- `gold` - Gold glow for premium elements

---

## Reusable UI Tokens

### Buttons
- `.btn-primary` - Gold primary button with hover glow
- `.btn-secondary` - Navy secondary button
- `.btn-outline` - Outlined button
- `.btn-ghost` - Ghost button (minimal)

### Cards
- `.card-luxury` - Standard luxury card
- `.card-luxury-elevated` - Elevated luxury card
- `.card-marine` - Navy-themed card

### Inputs
- `.input-luxury` - Premium input with gold focus ring

### Badges
- `.badge-critical` - Critical priority badge
- `.badge-high` - High priority badge
- `.badge-normal` - Normal priority badge
- `.badge-gold` - Gold accent badge

### Dividers
- `.divider-marine` - Light gray divider
- `.divider-navy` - Navy divider

### Text Styles
- `.text-premium` - Serif premium text
- `.text-marine` - Marine gray text
- `.text-muted` - Muted gray text

### Containers
- `.container-luxury` - Max-width container with padding
- `.section-marine` - Navy section background
- `.section-light` - White section background

### Focus States
- `.focus-luxury` - Gold focus ring for accessibility

### Transitions
- `.transition-luxury` - Standard transition (200ms)
- `.transition-premium` - Slow transition (300ms)

---

## Usage Examples

### Button
```tsx
<button className="btn-primary">
  Contact Us
</button>
```

### Card
```tsx
<div className="card-luxury">
  <h3 className="text-premium">Service Details</h3>
  <p className="text-marine">Premium yacht maintenance...</p>
</div>
```

### Input
```tsx
<input 
  type="text" 
  className="input-luxury" 
  placeholder="Enter your name"
/>
```

### Badge
```tsx
<span className="badge-critical">Urgent</span>
```

---

## Layout System

### Max-Width Containers

Prevent content sprawl with constrained widths for optimal readability and focus.

- `.container-sm` - `640px` - Narrow content
- `.container-md` - `768px` - Medium content
- `.container-lg` - `1024px` - Standard content
- `.container-xl` - `1280px` - Wide content (default luxury)
- `.container-2xl` - `1536px` - Extra wide content
- `.container-full` - `100%` - Full width

**Usage:**
```tsx
<div className="container container-xl">
  {/* Content constrained to 1280px max */}
</div>
```

### Responsive Breakpoints

Consistent breakpoints across all components:

- **Mobile**: `< 640px` (default)
- **Tablet**: `640px - 1024px` (`sm`, `md`)
- **Desktop**: `1024px - 1280px` (`lg`)
- **Large Desktop**: `> 1280px` (`xl`, `2xl`)

### Section Padding

Consistent vertical spacing for sections:

- **Mobile**: `64px` (4rem) top and bottom
- **Desktop**: `96px` (6rem) top and bottom
- **Spacious**: `80px` mobile, `128px` desktop

**Usage:**
```tsx
<section className="section-light">
  {/* Automatic padding applied */}
</section>

<section className="section-marine">
  {/* Navy background with padding */}
</section>

<section className="section-spacious">
  {/* Extra generous spacing */}
</section>
```

### Vertical Rhythm

Consistent spacing between elements for visual harmony:

- Headings + paragraphs: `16px` gap
- Paragraph + paragraph: `16px` gap
- Sections: No margin (padding handles spacing)

### Grid Conventions

Use Tailwind's built-in grid utilities with consistent gap sizes:

**Base Grid:**
```tsx
<div className="grid grid-cols-1 gap-6">
  {/* Mobile: 1 column, 24px gap */}
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
  {/* Responsive: 1 → 2 → 3 columns, larger gap on desktop */}
</div>
```

**Gap Sizes (Tailwind):**
- `gap-2` - `8px` - Tight spacing
- `gap-4` - `16px` - Small spacing
- `gap-6` - `24px` - Medium spacing (default)
- `gap-8` - `32px` - Large spacing
- `gap-12` - `48px` - Extra large spacing

**Grid Columns (Tailwind):**
- `grid-cols-1` through `grid-cols-12`
- Responsive: `sm:grid-cols-*`, `md:grid-cols-*`, `lg:grid-cols-*`, `xl:grid-cols-*`

**Premium Grid Helper:**
```tsx
<div className="grid-luxury grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Automatic responsive gap sizing */}
</div>
```

### Safe Areas

Prevent content from feeling cramped with safe area insets:

- `.safe-area-top` - Top safe area (notch, status bar)
- `.safe-area-bottom` - Bottom safe area (home indicator)
- `.safe-area-left` - Left safe area
- `.safe-area-right` - Right safe area

**Usage:**
```tsx
<div className="safe-area-top safe-area-bottom">
  {/* Content respects device safe areas */}
</div>
```

### Content Width Constraints

Optimal reading widths for different content types:

- `.content-narrow` - `65ch` - Optimal reading width (body text)
- `.content-medium` - `85ch` - Medium content width
- `.content-wide` - `120ch` - Wide content width

**Usage:**
```tsx
<article className="content-narrow">
  {/* Text constrained to optimal reading width */}
</article>
```

### Layout Examples

**Standard Page Layout:**
```tsx
<div className="container container-xl">
  <section className="section-light">
    <div className="content-narrow">
      <h1>Page Title</h1>
      <p>Content here...</p>
    </div>
  </section>
</div>
```

**Grid Layout:**
```tsx
<section className="section-light">
  <div className="container container-xl">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
      <div className="card-luxury">Card 1</div>
      <div className="card-luxury">Card 2</div>
      <div className="card-luxury">Card 3</div>
    </div>
  </div>
</section>
```

**Full-Width Hero:**
```tsx
<section className="section-marine">
  <div className="container container-xl">
    <div className="content-medium">
      <h1>Hero Title</h1>
      <p>Hero content...</p>
    </div>
  </div>
</section>
```

---

## Design Principles

1. **Premium** - Every element reflects luxury and quality
2. **Marine** - Colors and tones evoke maritime excellence
3. **Minimal** - Clean, uncluttered, focused design
4. **Confident** - Bold choices, clear hierarchy, strong presence

---

## Accessibility

- All interactive elements have focus states
- Color contrast ratios meet WCAG AA standards
- Text sizes are readable (minimum 16px for body)
- Focus indicators use gold ring for visibility

---

**Last Updated**: January 2026

