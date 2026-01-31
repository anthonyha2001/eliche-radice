'use client';

import { useState } from 'react';
import { Navbar, Footer, SectionHeader, Card, Button, Badge } from '@/components/ui';
import ChatWidget from '@/components/ChatWidget';
import { Instagram, Facebook } from 'lucide-react';

// Note: Metadata cannot be exported from client components
// SEO metadata is handled in layout.tsx for this page

export default function ProjectsPage() {
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

  const projects = [
    {
      title: '80ft Motor Yacht – Full Systems Overhaul',
      scope: 'Complete maintenance, electrical upgrades, and propulsion tuning in Beirut Marina.',
      categories: ['maintenance', 'engine'],
      tags: ['80ft motor yacht', 'Full overhaul', 'Beirut Marina'],
    },
    {
      title: '65ft Sailing Yacht – Engine Restoration',
      scope: 'Engine rebuild, fuel system cleaning, and sea trial verification.',
      categories: ['engine'],
      tags: ['65ft sailing yacht', 'Engine service', 'Performance'],
    },
    {
      title: '90ft Superyacht – Pre-Purchase Survey',
      scope: 'Full condition survey for buyer and insurer, with prioritized findings.',
      categories: ['inspection'],
      tags: ['90ft superyacht', 'Pre-purchase', 'Survey & report'],
    },
    {
      title: '55ft Motor Yacht – Emergency Repair at Sea',
      scope: 'On-site diagnosis and stabilizing repair to safely return to port.',
      categories: ['emergency', 'maintenance'],
      tags: ['55ft motor yacht', 'Emergency response', 'At-sea support'],
    },
  ];

  const filters = [
    { id: 'all', label: 'All projects' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'engine', label: 'Engine & propulsion' },
    { id: 'inspection', label: 'Inspections & surveys' },
    { id: 'emergency', label: 'Emergency response' },
  ] as const;

  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]['id']>('all');

  const filteredProjects =
    activeFilter === 'all'
      ? projects
      : projects.filter((project) => project.categories.includes(activeFilter));

  return (
    <>
      <Navbar items={navItems} ctaLabel="Request Service" ctaHref="/request-service" />

      <main className="min-h-screen">
        <section className="section-light">
          <div className="container container-xl">
            <SectionHeader
              title="Selected Projects"
              subtitle="A calm, clear view of recent work – so you can see the type of problems we solve every day."
              align="center"
            />

            {/* Filters */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-1.5 rounded-full border text-sm transition-all duration-150 focus-luxury ${
                    activeFilter === filter.id
                      ? 'bg-navy-900 text-white border-navy-900'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gold-400 hover:text-navy-900'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Portfolio grid */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {filteredProjects.map((project) => (
                <Card
                  key={project.title}
                  variant="luxury-elevated"
                  className="overflow-hidden flex flex-col h-full"
                >
                  {/* Category tags */}
                  <div className="mb-3 flex flex-wrap gap-2">
                    {project.categories.map((category) => (
                      <Badge key={category} variant="gold" size="sm">
                        {category === 'maintenance' && 'Maintenance'}
                        {category === 'engine' && 'Engine & propulsion'}
                        {category === 'inspection' && 'Inspection & survey'}
                        {category === 'emergency' && 'Emergency response'}
                      </Badge>
                    ))}
                  </div>

                  <h3 className="text-premium text-lg font-semibold mb-1">
                    {project.title}
                  </h3>
                  <p className="text-marine text-sm mb-3">{project.scope}</p>

                  {/* Detail tags */}
                  <div className="mb-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Before / After preview placeholders */}
                  <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-500">
                    <div>
                      <p className="mb-1 font-semibold uppercase tracking-wide text-[11px] text-gray-500">
                        Before
                      </p>
                      <div className="aspect-video rounded-md bg-gray-100 flex items-center justify-center text-gray-400 text-[11px]">
                        Photo placeholder
                      </div>
                    </div>
                    <div>
                      <p className="mb-1 font-semibold uppercase tracking-wide text-[11px] text-gray-500">
                        After
                      </p>
                      <div className="aspect-video rounded-md bg-gray-100 flex items-center justify-center text-gray-400 text-[11px]">
                        Photo placeholder
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center mt-12">
              <p className="text-marine mb-4">
                If your situation feels similar, we can walk through it together.
              </p>
              <Button variant="primary" size="lg" asChild href="/request-service">
                Request Service
              </Button>
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
      <ChatWidget />
    </>
  );
}

