# UI Component Inventory

**Eliche Radiche - Premium Component Library**

A comprehensive collection of reusable UI components following the design system principles: Premium • Marine • Minimal • Confident.

---

## Components

### Navigation

#### Navbar
Responsive navigation bar with mobile menu support.

```tsx
import { Navbar } from '@/components/ui';

<Navbar
  logo={<Logo />}
  items={[
    { label: 'Services', href: '/services' },
    { label: 'About', href: '/about' },
  ]}
  ctaLabel="Contact"
  ctaHref="/contact"
/>
```

**Props:**
- `logo?: React.ReactNode` - Custom logo component
- `items?: NavItem[]` - Navigation items
- `ctaLabel?: string` - CTA button label (default: "Contact")
- `ctaHref?: string` - CTA button href
- `className?: string` - Additional classes

---

#### Footer
Multi-column footer with links and social media.

```tsx
import { Footer } from '@/components/ui';

<Footer
  logo={<Logo />}
  sections={[
    {
      title: 'Services',
      links: [
        { label: 'Maintenance', href: '/services/maintenance' },
        { label: 'Repairs', href: '/services/repairs' },
      ],
    },
  ]}
  socialLinks={[
    {
      platform: 'LinkedIn',
      href: 'https://linkedin.com/company/eliche-radiche',
      icon: <LinkedInIcon />,
    },
  ]}
/>
```

**Props:**
- `logo?: React.ReactNode` - Custom logo
- `sections?: FooterSection[]` - Footer sections with links
- `socialLinks?: SocialLink[]` - Social media links
- `copyright?: string` - Copyright text
- `className?: string` - Additional classes

---

### Buttons & Badges

#### Button
Primary, secondary, ghost, and outline button variants.

```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="md">Contact Us</Button>
<Button variant="secondary">Learn More</Button>
<Button variant="ghost">Cancel</Button>
<Button variant="outline">View Details</Button>
```

**Props:**
- `variant?: 'primary' | 'secondary' | 'ghost' | 'outline'`
- `size?: 'sm' | 'md' | 'lg'`
- `asChild?: boolean` - Render as Link when href provided
- `href?: string` - Link href (when asChild is true)
- Standard button HTML attributes

---

#### Badge
Status and priority indicators.

```tsx
import { Badge } from '@/components/ui';

<Badge variant="critical">Urgent</Badge>
<Badge variant="high">High Priority</Badge>
<Badge variant="normal">Normal</Badge>
<Badge variant="gold">Premium</Badge>
```

**Props:**
- `variant?: 'critical' | 'high' | 'normal' | 'info' | 'gold'`
- `size?: 'sm' | 'md'`
- `className?: string`

---

### Cards & Containers

#### Card
Luxury card variants for content display.

```tsx
import { Card } from '@/components/ui';

<Card variant="luxury">
  <h3>Card Title</h3>
  <p>Card content...</p>
</Card>

<Card variant="luxury-elevated">
  {/* Elevated card with more padding and shadow */}
</Card>

<Card variant="marine">
  {/* Navy-themed card */}
</Card>
```

**Props:**
- `variant?: 'luxury' | 'luxury-elevated' | 'marine'`
- `onClick?: () => void` - Makes card clickable
- `className?: string`

---

#### ServiceCard
Specialized card for service listings.

```tsx
import { ServiceCard } from '@/components/ui';

<ServiceCard
  title="Engine Maintenance"
  description="Comprehensive engine service and inspection."
  icon={<EngineIcon />}
  features={[
    'Oil change',
    'Filter replacement',
    'System diagnostics',
  ]}
  onLearnMore={() => console.log('Learn more')}
/>
```

**Props:**
- `title: string`
- `description: string`
- `icon?: React.ReactNode`
- `features?: string[]`
- `onLearnMore?: () => void`
- `className?: string`

---

#### TestimonialCard
Customer testimonial display card.

```tsx
import { TestimonialCard } from '@/components/ui';

<TestimonialCard
  quote="Exceptional service and attention to detail."
  author="John Smith"
  role="Yacht Owner"
  company="Sea Breeze"
  rating={5}
/>
```

**Props:**
- `quote: string`
- `author: string`
- `role?: string`
- `company?: string`
- `rating?: number` (1-5)
- `className?: string`

---

### Layout Components

#### SectionHeader
Consistent section headings with optional subtitle.

```tsx
import { SectionHeader } from '@/components/ui';

<SectionHeader
  title="Our Services"
  subtitle="Premium yacht maintenance solutions"
  align="center"
/>
```

**Props:**
- `title: string`
- `subtitle?: string`
- `align?: 'left' | 'center' | 'right'`
- `className?: string`

---

#### FeatureList
Grid-based feature list with icons.

```tsx
import { FeatureList } from '@/components/ui';

<FeatureList
  features={[
    {
      title: '24/7 Support',
      description: 'Always available when you need us.',
      icon: <SupportIcon />,
    },
    {
      title: 'Expert Technicians',
      description: 'Certified professionals.',
      icon: <TechnicianIcon />,
    },
  ]}
  columns={3}
/>
```

**Props:**
- `features: Feature[]`
- `columns?: 1 | 2 | 3 | 4`
- `className?: string`

---

### Interactive Components

#### FAQAccordion
Expandable FAQ items.

```tsx
import { FAQAccordion } from '@/components/ui';

<FAQAccordion
  items={[
    {
      question: 'What services do you offer?',
      answer: 'We provide comprehensive yacht maintenance...',
    },
    {
      question: 'How quickly can you respond?',
      answer: 'We aim to respond within 5 minutes...',
    },
  ]}
/>
```

**Props:**
- `items: FAQItem[]`
- `className?: string`

---

#### Tabs
Tabbed interface component.

```tsx
import { Tabs } from '@/components/ui';

<Tabs
  tabs={[
    {
      id: 'services',
      label: 'Services',
      content: <ServicesContent />,
    },
    {
      id: 'pricing',
      label: 'Pricing',
      content: <PricingContent />,
    },
  ]}
  defaultTab="services"
/>
```

**Props:**
- `tabs: Tab[]`
- `defaultTab?: string`
- `className?: string`

---

#### Modal
Modal dialog component.

```tsx
import { Modal } from '@/components/ui';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Contact Us"
  size="md"
>
  <ContactForm />
</Modal>
```

**Props:**
- `isOpen: boolean`
- `onClose: () => void`
- `title?: string`
- `size?: 'sm' | 'md' | 'lg' | 'xl'`
- `showCloseButton?: boolean`
- `className?: string`

---

#### Toast
Notification toast component.

```tsx
import { Toast } from '@/components/ui';

{showToast && (
  <Toast
    message="Message sent successfully!"
    type="success"
    duration={5000}
    onClose={() => setShowToast(false)}
  />
)}
```

**Props:**
- `message: string`
- `type?: 'success' | 'error' | 'info' | 'warning'`
- `duration?: number` (milliseconds, 0 = no auto-close)
- `onClose: () => void`
- `className?: string`

---

### Forms

#### ContactForm
Contact form with validation.

```tsx
import { ContactForm } from '@/components/ui';

<ContactForm
  onSubmit={async (data) => {
    // Handle form submission
    console.log(data);
  }}
/>
```

**Props:**
- `onSubmit?: (data: ContactFormData) => void`
- `className?: string`

**Form Data:**
```typescript
{
  name: string;
  email: string;
  phone?: string;
  message: string;
}
```

---

### Navigation Helpers

#### Breadcrumbs
Breadcrumb navigation.

```tsx
import { Breadcrumbs } from '@/components/ui';

<Breadcrumbs
  items={[
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Maintenance', href: '/services/maintenance' },
  ]}
/>
```

**Props:**
- `items: BreadcrumbItem[]`
- `className?: string`

---

## Usage Examples

### Complete Page Layout

```tsx
import {
  Navbar,
  Footer,
  SectionHeader,
  ServiceCard,
  Button,
} from '@/components/ui';

export default function ServicesPage() {
  return (
    <>
      <Navbar
        items={[
          { label: 'Services', href: '/services' },
          { label: 'About', href: '/about' },
        ]}
      />
      
      <section className="section-light">
        <div className="container container-xl">
          <SectionHeader
            title="Our Services"
            subtitle="Premium yacht maintenance solutions"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-12">
            <ServiceCard
              title="Engine Maintenance"
              description="Comprehensive engine service..."
              features={['Oil change', 'Filter replacement']}
            />
            {/* More cards... */}
          </div>
        </div>
      </section>
      
      <Footer
        sections={[
          {
            title: 'Services',
            links: [
              { label: 'Maintenance', href: '/services/maintenance' },
            ],
          },
        ]}
      />
    </>
  );
}
```

---

## Design System Integration

All components follow the Eliche Radiche design system:

- **Colors**: Navy, Gold, White palette
- **Typography**: Inter (sans) and Playfair Display (serif)
- **Spacing**: 4px base unit scale
- **Shadows**: Navy-tinted with gold glow for premium elements
- **Radius**: Consistent border radius scale
- **Accessibility**: WCAG AA compliant with focus states

---

## Component Guidelines

1. **Consistency**: All components use the same design tokens
2. **Accessibility**: ARIA labels, keyboard navigation, focus states
3. **Responsive**: Mobile-first design with breakpoint variants
4. **Type Safety**: Full TypeScript support with proper interfaces
5. **Composability**: Components can be combined and customized

---

**Last Updated**: January 2026

