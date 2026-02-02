import { Metadata } from 'next';
import {
  Navbar,
  Footer,
  SectionHeader,
  Card,
  FeatureList,
  Button,
} from '@/components/ui';
import ChatWidgetWrapper from '@/components/ChatWidgetWrapper';
import { Instagram, Facebook } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us - Eliche Radice LB | Yacht Maintenance Experts',
  description: 'Learn about Eliche Radice LB: craftsmanship built on reliability. Expert yacht maintenance team with 30+ years experience in Lebanon.',
  openGraph: {
    title: 'About Eliche Radice LB',
    description: 'Craftsmanship built on reliability. Expert yacht maintenance team.',
  },
};

export default function AboutPage() {
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

  const values = [
    {
      title: 'Craftsmanship first',
      description:
        'Every job is documented, inspected, and signed off as if the yacht were our own. No shortcuts.',
    },
    {
      title: 'Reliability over noise',
      description:
        'Calm, predictable maintenance plans so owners and captains always know what comes next.',
    },
    {
      title: 'Clear communication',
      description:
        'Plain-language updates, photos, and timelines. No technical overwhelm, just clarity.',
    },
    {
      title: 'Discretion & trust',
      description:
        'We work quietly in the background so owners and guests experience only seamless service.',
    },
  ];

  const team = [
    {
      name: 'Michel Kattoura',
      role: 'Founder & Lead Technician',
      bio: 'Over a decade in marine engineering, specializing in propulsion, power systems, and refits.',
    },
    {
      name: 'Marine Operations Lead',
      role: 'Service Coordination',
      bio: 'Keeps every intervention on schedule and aligned with the owner’s cruising plans.',
    },
    {
      name: 'Customer Support',
      role: 'Owner Care',
      bio: 'First point of contact for owners, making sure every request is heard and followed through.',
    },
  ];

  const trustReasons = [
    'Documented work with before/after photos and clear reports.',
    'Single point of contact from first message to completion.',
    'Respect for timelines, privacy, and the onboard experience.',
  ];

  return (
    <>
      <Navbar items={navItems} ctaLabel="Request Service" ctaHref="/request-service" />

      <main className="min-h-screen bg-white">
        {/* Origin story / hero */}
        <section className="section-light pb-0">
          <div className="container container-xl grid grid-cols-1 lg:grid-cols-[1.4fr,1fr] gap-10 items-center">
            <div>
              <SectionHeader
                title="Craftsmanship, built on reliability"
                subtitle="Eliche Radice LB started with a simple idea: yacht owners deserve quiet confidence every time they leave the dock."
                align="center"
              />
              <div className="mt-6 space-y-4 text-marine text-sm leading-relaxed">
                <p>
                  What began as a small, owner-led workshop supporting a handful of yachts in jounieh
                  has grown into a focused maintenance partner for demanding owners and captains.
                </p>
                <p>
                  From the first service, our goal has been the same: do the work properly, explain it clearly,
                  and be available when it matters most.
                </p>
              </div>
            </div>
            <div
              className="aspect-[4/3] rounded-lg bg-cover bg-center border border-gray-200"
              style={{
                backgroundImage: "url('/about.png')",
              }}
            />

          </div>
        </section>

        {/* Values */}
        <section className="section-light pt-10">
          <div className="container container-xl">
            <h2 className="text-premium text-2xl font-semibold mb-2">Our values</h2>
            <p className="text-marine text-sm mb-8">
              Every decision on board is guided by a simple balance: craftsmanship in the details, reliability in the result.
            </p>
            <FeatureList features={values} columns={2} />
          </div>
        </section>

        {/* Team */}
        <section className="section-light">
          <div className="container container-xl">
            <h2 className="text-premium text-2xl font-semibold mb-6">The team behind the work</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {team.map((member) => (
                <Card key={member.name} variant="luxury">
                  <div className="flex items-center gap-4 mb-4">
                    <div 
                      className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs"
                      aria-label="Team member photo"
                    >
                      <span className="sr-only">Photo placeholder</span>
                    </div>
                    <div>
                      <p className="text-premium font-semibold">{member.name}</p>
                      <p className="text-marine text-xs">{member.role}</p>
                    </div>
                  </div>
                  <p className="text-marine text-sm leading-relaxed">{member.bio}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications + Why clients trust us */}
        <section className="section-light">
          <div className="container container-xl grid grid-cols-1 lg:grid-cols-[1.1fr,1.2fr] gap-8 lg:gap-12 items-start">
            <Card variant="luxury">
              <h2 className="text-premium text-2xl font-semibold mb-4">
                Certifications & standards
              </h2>
              <p className="text-marine text-sm mb-4">
                We work in line with leading marine standards and manufacturer guidelines.
              </p>
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-500" aria-label="Certification logos">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i}
                    className="h-16 rounded-lg bg-gray-100 flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <span className="sr-only">Certification logo placeholder {i}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card variant="luxury-elevated">
              <h2 className="text-premium text-2xl font-semibold mb-4">
                Why clients trust us
              </h2>
              <ul className="space-y-3 text-marine text-sm">
                {trustReasons.map((reason) => (
                  <li key={reason} className="flex items-start gap-3">
                    <span className="text-gold-500 text-lg leading-none mt-[2px]">✓</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Button variant="primary" size="md" asChild href="/contact">
                  Talk to the team
                </Button>
              </div>
            </Card>
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

