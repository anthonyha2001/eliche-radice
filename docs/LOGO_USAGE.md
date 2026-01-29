# Logo Usage Guidelines

**Eliche Radiche - Premium Brand Identity**

Clear rules for logo placement, sizing, and usage across the application.

---

## Logo Variants

### 1. Default (Navbar)
**Location**: Top-left of navigation bar

**Specifications:**
- **Minimum Height**: 40px (h-10)
- **Padding**: 16px right padding (pr-4) for spacing from nav items
- **Text Size**: 24px (text-2xl)
- **Background**: Light backgrounds (white, gray-50, gray-100)
- **Colors**: Navy-900 text, gold accents

**Usage:**
```tsx
import { Logo } from '@/components/ui';

<Logo variant="default" />
// or
<Navbar showLogo={true} />
```

---

### 2. Footer
**Location**: Footer section, top-left of footer content

**Specifications:**
- **Minimum Height**: 32px (h-8)
- **Padding**: 16px bottom margin (mb-4) for spacing from description
- **Text Size**: 20px (text-xl)
- **Background**: Dark backgrounds (navy-900)
- **Colors**: White text, gold accents

**Usage:**
```tsx
<Logo variant="footer" />
// or
<Footer showLogo={true} />
```

---

### 3. Watermark
**Location**: Fixed bottom-left corner of page

**Specifications:**
- **Height**: 24px (h-6)
- **Padding**: None
- **Text Size**: 14px (text-sm)
- **Opacity**: 20% (opacity-20)
- **Position**: Fixed, bottom-4 left-4
- **Pointer Events**: None (non-interactive)
- **Z-Index**: 10 (behind main content)

**Usage:**
```tsx
<Logo variant="watermark" />
```

**When to Use:**
- Premium pages (landing, about)
- Full-width hero sections
- Marketing pages
- Not recommended for: forms, dashboards, admin pages

---

## Logo Component API

```tsx
interface LogoProps {
  variant?: 'default' | 'footer' | 'watermark';
  href?: string; // Default: '/'
  className?: string;
  showText?: boolean; // Default: true
}
```

### Props

- **variant**: Logo size variant (default: 'default')
- **href**: Link destination (ignored for watermark)
- **className**: Additional CSS classes
- **showText**: Show/hide "Eliche Radiche" text (default: true)

---

## Size Rules

### Minimum Sizes
- **Navbar**: 40px height (never smaller)
- **Footer**: 32px height (never smaller)
- **Watermark**: 24px height (never smaller)

### Scaling
- Logo scales proportionally
- Text scales with logo size
- Maintain aspect ratio at all times

---

## Background Rules

### Light Backgrounds
**Use Default Variant:**
- White (#FFFFFF)
- Gray-50 (#FAFBFC)
- Gray-100 (#F9FAFB)
- Gray-200 (#F3F4F6)

**Logo Colors:**
- Icon: Navy-900 background, white text
- Text: Navy-900

### Dark Backgrounds
**Use Footer Variant (or custom):**
- Navy-900 (#0A1929)
- Navy-800 (#1A2332)
- Navy-950 (#050B14)

**Logo Colors:**
- Icon: Navy-800 background, white text
- Text: White

### Custom Backgrounds
For custom backgrounds, ensure:
- Minimum contrast ratio: 4.5:1 (WCAG AA)
- Logo remains clearly visible
- No overlapping with similar colors

---

## Spacing Rules

### Navbar Logo
- **Left Padding**: 16px (container padding)
- **Right Padding**: 16px (pr-4) - spacing to nav items
- **Vertical**: Centered vertically in navbar

### Footer Logo
- **Top**: No padding (starts at top of footer column)
- **Bottom**: 16px (mb-4) - spacing to description text
- **Left**: No padding (aligned with footer content)

### Watermark Logo
- **Bottom**: 16px (bottom-4)
- **Left**: 16px (left-4)
- **No margins**: Fixed positioning handles spacing

---

## Integration Examples

### Navbar Integration
```tsx
import { Navbar, Logo } from '@/components/ui';

// Option 1: Use default logo
<Navbar 
  items={navItems}
  showLogo={true} // Default
/>

// Option 2: Custom logo
<Navbar 
  logo={<CustomLogo />}
  items={navItems}
/>

// Option 3: Logo only (no text)
<Navbar 
  logo={<Logo variant="default" showText={false} />}
  items={navItems}
/>
```

### Footer Integration
```tsx
import { Footer, Logo } from '@/components/ui';

// Option 1: Use default footer logo
<Footer 
  sections={footerSections}
  showLogo={true} // Default
/>

// Option 2: Custom logo
<Footer 
  logo={<CustomLogo />}
  sections={footerSections}
/>

// Option 3: Logo only (no text)
<Footer 
  logo={<Logo variant="footer" showText={false} />}
  sections={footerSections}
/>
```

### Watermark Usage
```tsx
import { Logo } from '@/components/ui';

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <Logo variant="watermark" />
    </>
  );
}
```

---

## Logo Asset Requirements

### SVG Format (Recommended)
- Vector format for crisp scaling
- Optimized file size
- Transparent background
- Named: `logo.svg`

### PNG Format (Alternative)
- High resolution (2x for retina)
- Transparent background
- Named: `logo.png` and `logo@2x.png`

### Placement
```
frontend/
  public/
    logo.svg (or logo.png)
    logo-white.svg (for dark backgrounds, optional)
```

---

## Implementation Notes

### Current Implementation
The Logo component uses a placeholder div with "ER" initials. Replace with actual logo asset:

```tsx
// In Logo.tsx, replace the placeholder div with:
import Image from 'next/image';

<div className="flex-shrink-0">
  <Image
    src="/logo.svg"
    alt="Eliche Radiche"
    width={variant === 'watermark' ? 24 : variant === 'footer' ? 32 : 40}
    height={variant === 'watermark' ? 24 : variant === 'footer' ? 32 : 40}
    className={sizeStyles[variant]}
    priority={variant === 'default'}
  />
</div>
```

### Dark Background Variant
For dark backgrounds, use a white/light logo:

```tsx
<Image
  src={variant === 'footer' ? '/logo-white.svg' : '/logo.svg'}
  alt="Eliche Radiche"
  // ... rest of props
/>
```

---

## Do's and Don'ts

### ✅ Do
- Use appropriate variant for context
- Maintain minimum sizes
- Ensure proper contrast
- Use watermark sparingly
- Keep logo visible and clear

### ❌ Don't
- Scale logo below minimum sizes
- Use watermark on functional pages
- Overlap logo with important content
- Use low contrast colors
- Distort logo aspect ratio
- Add effects (shadows, filters) to logo

---

## Accessibility

- Logo always includes alt text: "Eliche Radiche"
- Logo links to homepage (except watermark)
- Keyboard navigable
- Screen reader friendly
- Maintains focus states

---

## Brand Consistency

The logo represents:
- **Premium**: Luxury yacht maintenance
- **Marine**: Maritime excellence
- **Professional**: Trust and reliability
- **Confident**: Strong brand presence

Always use the logo consistently across all touchpoints.

---

**Last Updated**: January 2026

