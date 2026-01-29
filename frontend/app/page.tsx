'use client';

import { useMemo } from 'react';
import {
  Navbar,
  Footer,
  SectionHeader,
  ServiceCard,
  TestimonialCard,
  FeatureList,
  Button,
  RevealOnScroll,
  HowItWorks,
} from '@/components/ui';
import ChatWidget from '@/components/ChatWidget';
import { useRouter } from 'next/navigation';
import { 
  Wrench, 
  AlertCircle, 
  ClipboardCheck, 
  Award, 
  Clock, 
  Shield, 
  Users,
} from 'lucide-react';

export default function Home() {
  const router = useRouter();
  // Memoize static data to prevent unnecessary re-renders
  const services = useMemo(() => [
    {
      title: 'Routine Maintenance',
      description: 'Regular maintenance to keep your yacht in pristine condition. Scheduled service plans tailored to your vessel.',
      icon: <Wrench className="w-10 h-10 md:w-12 md:h-12" strokeWidth={1.3} aria-hidden="true" />,
      features: [
        'Preventive care',
        'System diagnostics',
        'Documentation & reports',
      ],
    },
    {
      title: 'Emergency Repairs',
      description: '24/7 emergency response for urgent issues. Fast response time with expert technicians.',
      icon: <AlertCircle className="w-10 h-10 md:w-12 md:h-12" strokeWidth={1.3} aria-hidden="true" />,
      features: [
        '24/7 availability',
        '< 5 minute response',
        'Rapid diagnostics',
      ],
    },
    {
      title: 'Inspections & Surveys',
      description: 'Comprehensive yacht inspections and surveys. Pre-purchase, insurance, and annual checks.',
      icon: <ClipboardCheck className="w-10 h-10 md:w-12 md:h-12" strokeWidth={1.3} aria-hidden="true" />,
      features: [
        'Pre-purchase surveys',
        'Insurance inspections',
        'Detailed reports',
      ],
    },
  ], []);

  const features = useMemo(() => [
    {
      title: '15+ Years Experience',
      description: 'Trusted expertise in luxury yacht maintenance',
      icon: <Award className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.3} aria-hidden="true" />,
    },
    {
      title: '< 5min Response Time',
      description: 'Average response time for all inquiries',
      icon: <Clock className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.3} aria-hidden="true" />,
    },
    {
      title: '24/7 Availability',
      description: 'Always reachable when your vessel needs it',
      icon: <Shield className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.3} aria-hidden="true" />,
    },
    {
      title: 'Certified Technicians',
      description: 'Expert professionals with marine certifications',
      icon: <Users className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.3} aria-hidden="true" />,
    },
  ], []);

  const testimonials = useMemo(() => [
    {
      quote: 'Exceptional service and attention to detail. Eliche Radice LB keeps our yacht in perfect condition.',
      author: 'Michael Chen',
      role: 'Yacht Owner',
      company: 'Sea Breeze',
      rating: 5,
    },
    {
      quote: 'The fastest response time I\'ve experienced. Professional, reliable, and always available.',
      author: 'Sarah Johnson',
      role: 'Fleet Manager',
      company: 'Maritime Holdings',
      rating: 5,
    },
  ], []);

  const navItems = useMemo(() => [
    { label: 'Services', href: '/services' },
    { label: 'Projects', href: '/projects' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ], []);

  const footerSections = useMemo(() => [
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
  ], []);

  return (
    <>
      <Navbar items={navItems} ctaLabel="Request Service" ctaHref="/request-service" />
      
      <main className="min-h-screen">
        <section
          className="relative section-marine bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/hero.png')",
          }}
          aria-label="Hero section"
        >
          {/* Navy overlay */}
          <div className="absolute inset-0 bg-navy-900/65" aria-hidden="true" />

  {/* Content */}
  <div className="relative container container-xl">
    <RevealOnScroll>
      <div className="content-medium text-center">

        <h1 className="text-premium text-4xl lg:text-5xl font-bold mb-6 text-white">
          Professional Yacht Maintenance,<br className="hidden sm:inline" />
          <span className="sm:hidden"> </span>Always Reachable
        </h1>

        <p className="text-xl lg:text-2xl text-gray-300 mb-8">
          Expert support when your vessel needs it most. No missed calls. No confusion. Just professional service.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" size="lg" asChild href="/request-service">
            Request Service
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="bg-transparent border-white text-white hover:!bg-white hover:!text-navy-900"
          >
            Learn More
          </Button>
        </div>
      </div>
    </RevealOnScroll>
  </div>
</section>


        {/* Trust Indicators */}
        <section className="section-light bg-gray-50">
          <div className="container container-xl">
            <RevealOnScroll delay={100}>
              <FeatureList features={features} columns={4} />
            </RevealOnScroll>
          </div>
        </section>

        {/* How It Works */}
        <section className="section-light">
          <div className="container container-xl">
            <RevealOnScroll>
              <SectionHeader
                title="How It Works"
                subtitle="A clear, calm process from first request to completion"
                align="center"
              />
            </RevealOnScroll>

            <div className="mt-10">
              <RevealOnScroll delay={100}>
                <HowItWorks
                  steps={[
                    {
                      label: 'Step 1',
                      title: 'Request',
                      description:
                        'Tell us what you need via the Request Service form or live chat. Share basic yacht details and urgency.',
                    },
                    {
                      label: 'Step 2',
                      title: 'Assessment',
                      description:
                        'Our team reviews your request, asks any clarifying questions, and identifies the right technicians.',
                    },
                    {
                      label: 'Step 3',
                      title: 'Quote',
                      description:
                        'You receive a clear, transparent quote with scope, timelines, and any options if applicable.',
                    },
                    {
                      label: 'Step 4',
                      title: 'Schedule',
                      description:
                        'We agree on the best time and location for the work, coordinating with your marina where needed.',
                    },
                    {
                      label: 'Step 5',
                      title: 'Complete',
                      description:
                        'Work is completed, documented, and reviewed with you. We remain available for follow-up support.',
                    },
                  ]}
                />
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="section-light">
          <div className="container container-xl">
            <RevealOnScroll>
              <SectionHeader
                title="Our Services"
                subtitle="Premium yacht maintenance solutions tailored to your vessel's needs"
                align="center"
              />
            </RevealOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-12">
              {services.map((service, index) => (
                <RevealOnScroll key={index} delay={index * 100}>
                  <ServiceCard
                    title={service.title}
                    description={service.description}
                    icon={service.icon}
                    features={service.features}
                    onLearnMore={() => {
                      router.push('/request-service?service=' + encodeURIComponent(service.title));
                    }}
                  />
                </RevealOnScroll>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button variant="primary" size="lg" asChild href="/services">
                View All Services
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="section-light bg-gray-50">
          <div className="container container-xl">
            <RevealOnScroll>
              <SectionHeader
                title="What Our Clients Say"
                subtitle="Trusted by yacht owners and fleet managers"
                align="center"
              />
            </RevealOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mt-12">
              {testimonials.map((testimonial, index) => (
                <RevealOnScroll key={index} delay={index * 100}>
                  <TestimonialCard {...testimonial} />
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-marine" aria-labelledby="cta-heading">
          <div className="container container-xl">
            <RevealOnScroll>
              <div className="content-medium text-center">
                <h2 id="cta-heading" className="text-premium text-3xl lg:text-4xl font-bold mb-4 text-white">
                  Your yacht deserves professional care
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  Message us now for immediate assistance or request a service
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="primary" size="lg" asChild href="/request-service">
                    Request Service
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-transparent border-white text-white hover:!bg-white hover:!text-navy-900"
                  >
                    View Projects
                  </Button>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>
      </main>

      <Footer sections={footerSections} />
      <ChatWidget />
    </>
  );
}
