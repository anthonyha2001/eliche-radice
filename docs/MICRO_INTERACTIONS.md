# Micro-Interactions Guide

**Eliche Radiche - Subtle & Elegant Interactions**

A guide to the premium micro-interactions available throughout the design system.

---

## Design Philosophy

All micro-interactions follow these principles:
- **Subtle**: Never flashy or distracting
- **Elegant**: Smooth, refined animations
- **Premium**: Luxury feel without being ostentatious
- **Purposeful**: Every interaction serves a function

---

## Hover States

### Button Interactions

Buttons include subtle ripple effect and scale on interaction:

```tsx
<Button variant="primary">Click Me</Button>
// Automatically includes:
// - Ripple effect on hover
// - Scale up (1.02x) on hover
// - Scale down (0.98x) on active
```

### Card Hover

Cards lift slightly on hover with enhanced shadow:

```tsx
<Card variant="luxury" onClick={handleClick}>
  {/* Automatically includes card-interactive class */}
</Card>

// Or manually:
<div className="card-interactive">
  {/* Lifts 4px, enhanced shadow, gold border */}
</div>
```

### Link Hover

Links have an elegant underline animation:

```tsx
<Link href="/about" className="link-luxury">
  About Us
</Link>
// Gold underline animates from left to right on hover
```

### Scale Hover

Subtle scale effects for images or icons:

```tsx
<div className="hover-scale">
  {/* Scales to 1.02x on hover */}
</div>

<div className="hover-scale-subtle">
  {/* Scales to 1.01x on hover - even more subtle */}
</div>
```

---

## Focus States

### Enhanced Focus Rings

All interactive elements have elegant gold focus rings:

```tsx
<button className="focus-luxury">
  {/* Gold ring with smooth transition */}
</button>
```

### Input Focus

Inputs have subtle gold glow on focus:

```tsx
<input className="input-focus" />
// Gold border + subtle glow shadow
```

---

## Scroll Animations

### RevealOnScroll Component

Gentle fade-in-up animation when element enters viewport:

```tsx
import { RevealOnScroll } from '@/components/ui';

<RevealOnScroll delay={100}>
  <SectionHeader title="Our Services" />
</RevealOnScroll>
```

**Props:**
- `delay?: number` - Delay in milliseconds before animation starts
- `threshold?: number` - Intersection threshold (0-1, default: 0.1)
- `className?: string` - Additional classes

### Manual Reveal Classes

Use CSS classes for scroll-triggered animations:

```tsx
<div className="reveal-on-scroll">
  {/* Add 'revealed' class via JavaScript when in viewport */}
</div>
```

### Animation Classes

Pre-defined animation classes:

```tsx
<div className="animate-reveal">
  {/* Fade in up immediately */}
</div>

<div className="animate-reveal-delay-1">
  {/* 100ms delay */}
</div>

<div className="animate-reveal-delay-2">
  {/* 200ms delay */}
</div>

<div className="animate-reveal-delay-3">
  {/* 300ms delay */}
</div>

<div className="animate-fade-in">
  {/* Simple fade in */}
</div>

<div className="animate-slide-in">
  {/* Slide in from right */}
</div>
```

---

## Transition Utilities

### Standard Transitions

```tsx
<div className="transition-luxury">
  {/* 200ms transition */}
</div>

<div className="transition-premium">
  {/* 300ms transition */}
</div>
```

### Specific Property Transitions

```tsx
<div className="hover-bg">
  {/* Smooth background color transition */}
</div>

<div className="hover-text">
  {/* Smooth text color transition */}
</div>

<div className="hover-border">
  {/* Smooth border color transition */}
</div>

<div className="hover-opacity">
  {/* Opacity transition (to 0.8 on hover) */}
</div>
```

---

## Special Effects

### Hover Lift

Subtle elevation on hover:

```tsx
<div className="hover-lift">
  {/* Lifts 2px with enhanced shadow */}
</div>
```

### Hover Glow

Gold glow effect:

```tsx
<div className="hover-glow">
  {/* Gold shadow glow on hover */}
</div>
```

---

## Usage Examples

### Service Card Grid

```tsx
<section className="section-light">
  <div className="container container-xl">
    <RevealOnScroll>
      <SectionHeader title="Our Services" />
    </RevealOnScroll>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-12">
      <RevealOnScroll delay={100}>
        <ServiceCard title="Maintenance" />
      </RevealOnScroll>
      <RevealOnScroll delay={200}>
        <ServiceCard title="Repairs" />
      </RevealOnScroll>
      <RevealOnScroll delay={300}>
        <ServiceCard title="Inspections" />
      </RevealOnScroll>
    </div>
  </div>
</section>
```

### Navigation Links

```tsx
<nav>
  <Link href="/services" className="link-luxury">
    Services
  </Link>
  <Link href="/about" className="link-luxury">
    About
  </Link>
</nav>
```

### Interactive Card

```tsx
<Card 
  variant="luxury" 
  onClick={() => navigate('/details')}
  className="hover-lift"
>
  <h3>Card Title</h3>
  <p>Card content...</p>
</Card>
```

---

## Animation Timing

All animations use consistent timing:

- **Fast**: 150ms - Instant feedback
- **Base**: 200ms - Standard interactions
- **Smooth**: 250ms - Premium feel (cubic-bezier easing)
- **Slow**: 300ms - Deliberate actions
- **Very Slow**: 500ms - Page transitions

---

## Best Practices

1. **Don't Overuse**: Use animations sparingly for maximum impact
2. **Stagger Delays**: Use delay classes for grid items (delay-1, delay-2, etc.)
3. **Respect Preferences**: Consider `prefers-reduced-motion` (future enhancement)
4. **Test Performance**: Ensure animations don't cause jank
5. **Consistent Timing**: Stick to the defined timing scale

---

## Accessibility

- All interactive elements have focus states
- Animations are subtle and don't cause motion sickness
- Keyboard navigation fully supported
- Screen reader announcements preserved

---

**Last Updated**: January 2026

