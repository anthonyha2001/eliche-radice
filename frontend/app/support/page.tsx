import { SectionHeader, FAQAccordion, Card, Button } from '@/components/ui';
import Link from 'next/link';

export default function SupportPage() {
  const faqs = [
    {
      question: 'How quickly can you respond to emergency requests?',
      answer: 'We aim to respond to all requests within 5 minutes. For emergency situations, our team is available 24/7 and can dispatch technicians immediately.',
    },
    {
      question: 'What services do you offer?',
      answer: 'We provide comprehensive yacht maintenance including routine maintenance, emergency repairs, engine service, inspections, and surveys. All services are tailored to your vessel\'s specific needs.',
    },
    {
      question: 'Do you work on all types of yachts?',
      answer: 'Yes, we work with all types of yachts including motor yachts, sailing yachts, and superyachts. Our technicians are experienced with various yacht sizes and systems.',
    },
    {
      question: 'How do I request a service?',
      answer: 'You can request service through our website using the "Request Service" form, contact us via phone or email, or start a conversation through our live chat widget available on every page.',
    },
    {
      question: 'What areas do you cover?',
      answer: 'We primarily serve Lebanon and the Mediterranean region. For specific locations, please contact us to confirm coverage in your area.',
    },
    {
      question: 'Do you provide documentation and reports?',
      answer: 'Yes, all services include detailed documentation and reports. For inspections and surveys, you\'ll receive comprehensive reports with photos and recommendations.',
    },
  ];

  return (
    <>
      <section className="section-light">
        <div className="container container-xl">
          <SectionHeader
            title="Support Center"
            subtitle="Find answers to common questions or chat with our support team"
            align="center"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mt-12">
            {/* FAQ Section */}
            <div className="lg:col-span-2">
              <Card variant="luxury">
                <h3 className="text-premium text-xl font-semibold mb-6">
                  Frequently Asked Questions
                </h3>
                <FAQAccordion items={faqs} />
              </Card>
            </div>

            {/* Support Options */}
            <div className="space-y-6">
              <Card variant="luxury-elevated">
                <h3 className="text-premium text-lg font-semibold mb-4">
                  Need Immediate Help?
                </h3>
                <p className="text-marine text-sm mb-6">
                  Start a live chat with our support team. Available 24/7.
                </p>
                <p className="text-muted text-xs mb-4">
                  Click the chat icon in the bottom-right corner of your screen.
                </p>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm font-semibold text-navy-900 mb-2">Emergency?</p>
                  <a href="tel:+9611234567" className="link-luxury text-gold-600 font-semibold">
                    Call +961 1 234 567
                  </a>
                </div>
              </Card>

              <Card variant="luxury">
                <h3 className="text-premium text-lg font-semibold mb-4">
                  Request Service
                </h3>
                <p className="text-marine text-sm mb-4">
                  Submit a service request and we'll get back to you within 5 minutes.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  asChild
                  href="/request-service"
                >
                  Request Service
                </Button>
              </Card>

              <Card variant="luxury">
                <h3 className="text-premium text-lg font-semibold mb-4">
                  Contact Support
                </h3>
                <p className="text-marine text-sm mb-2">
                  <strong>Email:</strong><br />
                  <a href="mailto:support@elicheradice.com" className="link-luxury">
                    support@elicheradice.com
                  </a>
                </p>
                <p className="text-marine text-sm mt-4">
                  <strong>Phone:</strong><br />
                  <a href="tel:+9611234567" className="link-luxury">
                    +961 1 234 567
                  </a>
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

