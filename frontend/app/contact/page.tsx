'use client';

import {
  Navbar,
  Footer,
  SectionHeader,
  ContactForm,
  Card,
  Button,
} from '@/components/ui';
import ChatWidget from '@/components/ChatWidget';

// Note: Metadata for client components should be handled in layout.tsx or via generateMetadata
// SEO: Contact page - Eliche Radice LB yacht maintenance support in Lebanon

export default function ContactPage() {
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

  return (
    <>
      <Navbar items={navItems} ctaLabel="Request Service" ctaHref="/request-service" />

      <main className="min-h-screen bg-white">
        <section className="section-light">
          <div className="container container-xl">
            <SectionHeader
              title="Contact Eliche Radice LB"
              subtitle="A calm, direct line to the team that looks after your yacht."
              align="center"
            />

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1.4fr,1.1fr] gap-8 lg:gap-12">
              {/* Left column: form + helper */}
              <div className="space-y-6">
                <Card variant="luxury">
                  <h3 className="text-premium text-xl font-semibold mb-4">
                    Send us a message
                  </h3>
                  <p className="text-marine text-sm mb-6">
                    Share a few details about your yacht and what you need. We&apos;ll review and respond within a few minutes
                    during service hours.
                  </p>
                  <ContactForm />
                </Card>

                {/* Helper panel */}
                <Card variant="luxury-elevated">
                  <h3 className="text-premium text-lg font-semibold mb-3">
                    What to include in your request
                  </h3>
                  <ul className="space-y-2 text-sm text-marine">
                    <li>• Yacht type and size (e.g., 70ft motor yacht)</li>
                    <li>• Where the yacht is currently located</li>
                    <li>• The main issue or service you have in mind</li>
                    <li>• How urgent the situation feels</li>
                    <li>• Best way and time to reach you</li>
                  </ul>
                </Card>
              </div>

              {/* Right column: contact cards + map placeholder */}
              <div className="space-y-6">
                {/* Contact cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card variant="luxury">
                    <h4 className="font-semibold text-navy-900 mb-1">Phone</h4>
                    <p className="text-marine text-sm">
                      <a href="tel:+9611234567" className="link-luxury">
                        +961 1 234 567
                      </a>
                    </p>
                    <p className="text-muted text-xs mt-2">
                      For urgent situations, call anytime. We&apos;re available 24/7.
                    </p>
                  </Card>

                  <Card variant="luxury">
                    <h4 className="font-semibold text-navy-900 mb-1">Email</h4>
                    <p className="text-marine text-sm">
                      <a href="mailto:info@elicheradice.com" className="link-luxury">
                        info@elicheradice.com
                      </a>
                    </p>
                    <p className="text-muted text-xs mt-2">
                      We respond to written requests within 5 minutes during service hours.
                    </p>
                  </Card>
                </div>

                <Card variant="luxury">
                  <h4 className="font-semibold text-navy-900 mb-1">Service hours</h4>
                  <p className="text-marine text-sm">
                    Monday – Friday: 09:00 – 18:00<br />
                    Saturday: 10:00 – 16:00
                  </p>
                  <p className="text-muted text-xs mt-2">
                    Emergency support is available 24/7 for critical issues.
                  </p>
                </Card>

                {/* Map placeholder */}
                <div className="rounded-2xl bg-gray-100 aspect-[4/3] flex items-center justify-center text-gray-400 text-sm">
                  Map / marina location placeholder
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer sections={footerSections} />
      <ChatWidget />
    </>
  );
}

