import { Metadata } from 'next';
import { Navbar, Footer, SectionHeader, ServiceCard, Button, Tabs, Card } from '@/components/ui';
import ChatWidgetWrapper from '@/components/ChatWidgetWrapper';
import { Instagram, Facebook } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Yacht Maintenance Services - Eliche Radice LB | Lebanon',
  description: 'Professional yacht maintenance services: routine maintenance, emergency repairs, inspections, engine service. 24/7 availability in Lebanon.',
  keywords: ['yacht maintenance', 'boat repair', 'marine service', 'engine maintenance', 'yacht inspection', 'Lebanon'],
  openGraph: {
    title: 'Yacht Maintenance Services - Eliche Radice LB',
    description: 'Professional yacht maintenance solutions tailored to your vessel\'s needs.',
  },
};

export default function ServicesPage() {
  const navItems = [
    { label: 'Services', href: '/services' },
    { label: 'Projects', href: '/projects' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const footerSections = [
    {
      title: 'Services',
      links: [
        { label: 'Routine Maintenance', href: '/services' },
        { label: 'Emergency Repairs', href: '/services' },
        { label: 'Inspections', href: '/services' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Our Work', href: '/projects' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Support Center', href: '/support' },
        { label: 'Request Service', href: '/request-service' },
      ],
    },
  ];

  const maintenanceServices = [
    {
      title: 'Routine Maintenance',
      description:
        'Planned maintenance to keep your yacht in pristine condition – from fluids and filters to system checks.',
      features: [
        'Scheduled maintenance plans',
        'Preventive inspections',
        'System diagnostics',
        'Detailed documentation & reports',
      ],
    },
    {
      title: 'Seasonal Preparation',
      description:
        'Pre-season and post-season care to prepare your yacht for safe departures and secure layups.',
      features: [
        'Pre-departure inspections',
        'Winterization & de-winterization',
        'Battery & power system checks',
        'Safety equipment review',
      ],
    },
  ];

  const emergencyServices = [
    {
      title: 'Emergency Repairs',
      description:
        '24/7 response for urgent issues on board, with clear communication and rapid on-site intervention.',
      features: [
        '24/7 availability',
        '< 5 minute initial response',
        'On-site diagnostics',
        'Temporary & permanent repair options',
      ],
    },
    {
      title: 'At-Sea Support',
      description:
        'Remote guidance and coordination when issues arise while underway, until technicians can be deployed.',
      features: [
        'Phone & live chat support',
        'Step-by-step guidance',
        'Coordination with jounieh',
        'Follow-up inspection on arrival',
      ],
    },
  ];

  const inspectionServices = [
    {
      title: 'Inspections & Surveys',
      description:
        'Comprehensive yacht inspections for buyers, owners, and insurers, with clear, structured reporting.',
      features: [
        'Pre-purchase surveys',
        'Insurance & condition reports',
        'Annual safety inspections',
        'High-resolution photo documentation',
      ],
    },
    {
      title: 'System Health Checks',
      description:
        'Targeted inspections of key systems – electrical, propulsion, and safety – to detect issues early.',
      features: [
        'Electrical system review',
        'Propulsion & steering checks',
        'Safety & compliance review',
        'Prioritized recommendations',
      ],
    },
  ];

  const engineServices = [
    {
      title: 'Engine Service',
      description:
        'Full engine care for all major brands and configurations, focused on reliability and longevity.',
      features: [
        'Engine diagnostics',
        'Overhaul & repair',
        'Parts sourcing & replacement',
        'Performance optimization',
      ],
    },
    {
      title: 'Drive & Propulsion',
      description:
        'Maintenance and repair of shafts, props, and drives to ensure smooth, efficient performance.',
      features: [
        'Propeller inspection & balancing',
        'Shaft alignment checks',
        'Seal & bearing replacement',
        'Vibration troubleshooting',
      ],
    },
  ];

  const tabs = [
    {
      id: 'maintenance',
      label: 'Maintenance',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mt-6">
          {maintenanceServices.map((service) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              description={service.description}
              features={service.features}
            />
          ))}
        </div>
      ),
    },
    {
      id: 'emergency',
      label: 'Emergency',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mt-6">
          {emergencyServices.map((service) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              description={service.description}
              features={service.features}
            />
          ))}
        </div>
      ),
    },
    {
      id: 'inspections',
      label: 'Inspections',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mt-6">
          {inspectionServices.map((service) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              description={service.description}
              features={service.features}
            />
          ))}
        </div>
      ),
    },
    {
      id: 'engine',
      label: 'Engine & Propulsion',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mt-6">
          {engineServices.map((service) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              description={service.description}
              features={service.features}
            />
          ))}
        </div>
      ),
    },
  ];

  return (
    <>
      <Navbar items={navItems} ctaLabel="Request Service" ctaHref="/request-service" />

      <main className="min-h-screen">
        <section className="section-light">
          <div className="container container-xl">
            {/* Intro header */}
            <SectionHeader
              title="Our Services"
              subtitle="Calm, professional support for every stage of your yacht’s life – from routine maintenance to urgent repairs."
              align="center"
            />

            <div className="mt-10 lg:mt-12 lg:grid lg:grid-cols-[3fr,1.2fr] lg:gap-10">
              {/* Main content: tabs + deep service cards */}
              <div>
                <Tabs tabs={tabs} defaultTab="maintenance" />
              </div>

              {/* Sticky Request Service box (desktop) */}
              <div className="mt-10 lg:mt-0 lg:sticky lg:top-28 h-fit">
                <Card variant="marine" className="text-white space-y-4">
                  <h3 className="text-lg font-semibold">Request Service</h3>
                  <p className="text-sm text-gray-100">
                    Share a few details about your yacht and your situation. Our team will review and respond within
                    five minutes.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-100">
                    <li>• Calm, professional first contact</li>
                    <li>• Clear next steps and timelines</li>
                    <li>• No commitment until you approve the plan</li>
                  </ul>
                  <div className="pt-2">
                    <Button
                      variant="primary"
                      size="md"
                      asChild
                      href="/request-service"
                      className="w-full"
                    >
                      Request Service
                    </Button>
                  </div>
                  <p className="text-xs text-gray-200 mt-2">
                    Prefer to talk? Call{' '}
                    <a href="tel:+9611234567" className="underline underline-offset-2">
                      +961 1 234 567
                    </a>
                    .
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer 
        sections={footerSections}
        socialLinks={[
          {
            platform: 'Instagram',
            href: 'https://www.instagram.com/eliche_radice_lb/',
            icon: <Instagram className="w-5 h-5" />,
          },
          {
            platform: 'Facebook',
            href: 'https://www.facebook.com/people/Eliche-Radice-LB/100092440629080/',
            icon: <Facebook className="w-5 h-5" />,
          },
          {
            platform: 'TikTok',
            href: 'https://www.tiktok.com/@elicheradicelb',
            icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>,
          },
        ]}
      />
      <ChatWidgetWrapper />
    </>
  );
}

