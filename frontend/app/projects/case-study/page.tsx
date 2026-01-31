'use client';

import {
  Navbar,
  Footer,
  SectionHeader,
  Card,
  Button,
} from '@/components/ui';
import ChatWidget from '@/components/ChatWidget';
import { Instagram, Facebook } from 'lucide-react';

export default function CaseStudyPage() {
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
        {/* Hero / header with main image */}
        <section className="section-light pb-0">
          <div className="container container-xl">
            <SectionHeader
              title="Case Study: 80ft Motor Yacht – Full Systems Overhaul"
              subtitle="How we stabilized a complex vessel, reduced downtime, and gave the owner a calm, predictable maintenance plan."
              align="left"
            />

            <div className="mt-8 rounded-2xl overflow-hidden bg-gray-100">
              <div className="aspect-video w-full flex items-center justify-center text-gray-400 text-sm">
                Hero image placeholder
              </div>
            </div>
          </div>
        </section>

        {/* Problem / Approach / Work / Result */}
        <section className="section-light pt-10">
          <div className="container container-xl space-y-10 lg:space-y-14">
            {/* Problem */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr,1fr] gap-8 lg:gap-12 items-start">
              <Card variant="luxury" className="h-full">
                <h2 className="text-premium text-2xl font-semibold mb-4">
                  The problem
                </h2>
                <p className="text-marine text-sm leading-relaxed mb-4">
                  An 80ft motor yacht was experiencing recurring electrical issues, engine alarms,
                  and inconsistent maintenance history. The owner needed a calm, structured way
                  to regain confidence in the vessel before the next season.
                </p>
                <ul className="list-disc list-inside text-sm text-marine space-y-2">
                  <li>Unclear maintenance records across multiple providers</li>
                  <li>Intermittent engine alarms during departures</li>
                  <li>Owner concerned about reliability with guests on board</li>
                </ul>
              </Card>
              <div className="rounded-2xl bg-gray-100 aspect-[4/3] flex items-center justify-center text-gray-400 text-xs">
                Pre-inspection photo placeholder
              </div>
            </div>

            {/* Approach */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr,1.3fr] gap-8 lg:gap-12 items-start">
              <div className="rounded-2xl bg-gray-100 aspect-[4/3] flex items-center justify-center text-gray-400 text-xs order-last lg:order-first">
                Planning / diagram image placeholder
              </div>
              <Card variant="luxury" className="h-full">
                <h2 className="text-premium text-2xl font-semibold mb-4">
                  Our approach
                </h2>
                <p className="text-marine text-sm leading-relaxed mb-4">
                  We started with a structured discovery phase: listening to the owner,
                  reviewing logs, and mapping every critical system on board. From there,
                  we outlined a phased plan that could be executed without disrupting
                  the owner’s schedule.
                </p>
                <ul className="list-disc list-inside text-sm text-marine space-y-2">
                  <li>Single point of contact and clear communication rhythm</li>
                  <li>Prioritized risk-based checklist across power, propulsion, and safety</li>
                  <li>Defined work windows aligned with the owner’s cruising plans</li>
                </ul>
              </Card>
            </div>

            {/* Work done */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr,1fr] gap-8 lg:gap-12 items-start">
              <Card variant="luxury-elevated" className="h-full">
                <h2 className="text-premium text-2xl font-semibold mb-4">
                  Work completed
                </h2>
                <div className="space-y-3 text-sm text-marine">
                  <p>
                    Over a focused three-week window, we executed a full systems overhaul,
                    documenting each step so the owner and captain could follow along
                    without technical noise.
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Complete engine service and calibration for both mains</li>
                    <li>Electrical panel clean-up, labeling, and load testing</li>
                    <li>Battery bank health check and replacement where required</li>
                    <li>Bilge, safety, and navigation systems verification</li>
                  </ul>
                </div>
              </Card>
              <div className="space-y-4">
                <div className="rounded-2xl bg-gray-100 aspect-[4/3] flex items-center justify-center text-gray-400 text-xs">
                  Engine room “before” placeholder
                </div>
                <div className="rounded-2xl bg-gray-100 aspect-[4/3] flex items-center justify-center text-gray-400 text-xs">
                  Engine room “after” placeholder
                </div>
              </div>
            </div>

            {/* Result */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr,1.3fr] gap-8 lg:gap-12 items-start">
              <div className="rounded-2xl bg-gray-100 aspect-[4/3] flex items-center justify-center text-gray-400 text-xs order-last lg:order-first">
                Sea trial / underway image placeholder
              </div>
              <Card variant="luxury" className="h-full">
                <h2 className="text-premium text-2xl font-semibold mb-4">
                  The result
                </h2>
                <p className="text-marine text-sm leading-relaxed mb-4">
                  The yacht completed multiple guest trips without a single unplanned interruption.
                  Systems were documented, labeled, and brought back to a predictable baseline.
                </p>
                <ul className="list-disc list-inside text-sm text-marine space-y-2">
                  <li>No repeat engine alarms across the first three months</li>
                  <li>Owner and captain aligned on a simple, annual maintenance plan</li>
                  <li>Clear digital record of all work for future resale and insurance</li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Client quote + CTA */}
        <section className="section-marine">
          <div className="container container-xl grid grid-cols-1 lg:grid-cols-[2fr,1.2fr] gap-10 items-center">
            <div>
              <h2 className="text-white text-2xl font-semibold mb-4">
                Client perspective
              </h2>
              <Card variant="luxury" className="bg-white/5 border-white/10 text-white">
                <p className="text-lg leading-relaxed mb-4">
                  “Eliche Radice LB took a complicated situation and made it calm and predictable.
                  I know exactly what has been done, what comes next, and who to call when I need support.”
                </p>
                <p className="text-sm text-gray-200">
                  Yacht Owner, 80ft Motor Yacht
                </p>
              </Card>
            </div>
            <Card variant="luxury" className="bg-white text-navy-900">
              <h3 className="text-xl font-semibold mb-2">
                Have a similar situation?
              </h3>
              <p className="text-marine text-sm mb-4">
                Share a few details about your yacht and the issues you’re seeing. We’ll respond within five minutes
                during service hours.
              </p>
              <Button variant="primary" size="lg" asChild href="/request-service" className="w-full">
                Request Service
              </Button>
              <p className="text-xs text-marine mt-3">
                Prefer to speak first? Call{' '}
                <a href="tel:+9611234567" className="underline underline-offset-2">
                  +961 70186060
                </a>
                .
              </p>
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
      <ChatWidget />
    </>
  );
}


