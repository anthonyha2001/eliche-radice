'use client';

import { useState, useEffect, Suspense } from 'react';
import { SectionHeader, Card, Button, Navbar, Footer } from '@/components/ui';
import { useSearchParams } from 'next/navigation';
import ChatWidget from '@/components/ChatWidget';

function RequestServiceContent() {
  const searchParams = useSearchParams();
  const [preSelectedService, setPreSelectedService] = useState<string | null>(null);
  
  useEffect(() => {
    setPreSelectedService(searchParams.get('service'));
  }, [searchParams]);
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    serviceType: '',
    yachtType: '',
    yachtSize: '',
    location: '',
    urgency: 'normal',
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const serviceTypes = [
    'Routine Maintenance',
    'Emergency Repairs',
    'Inspections & Surveys',
    'Engine Service',
    'Other',
  ];

  const yachtTypes = [
    'Motor Yacht',
    'Sailing Yacht',
    'Superyacht',
    'Catamaran',
    'Other',
  ];

  const urgencyLevels = [
    { value: 'normal', label: 'Normal', description: 'Within 24-48 hours' },
    { value: 'high', label: 'High Priority', description: 'Within 12 hours' },
    { value: 'critical', label: 'Emergency', description: 'Immediate response' },
  ];

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    // Handle form submission
    console.log('Service request submitted:', formData);
    // In production: Send to API endpoint
    setStep(6); // Show confirmation
  };

  useEffect(() => {
    if (preSelectedService) {
      setFormData((prev) => ({ ...prev, serviceType: preSelectedService }));
    }
  }, [preSelectedService]);

  const updateFormData = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

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
      <Navbar items={navItems} ctaLabel="Contact" ctaHref="/contact" />
      
      <section className="section-light">
        <div className="container container-xl">
          <SectionHeader
            title="Request Service"
            subtitle="Tell us about your yacht maintenance needs"
            align="center"
          />

          <div className="max-w-2xl mx-auto mt-12">
            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div
                    key={s}
                    className={`flex-1 h-2 rounded-full mx-1 ${
                      s <= step ? 'bg-gold-500' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-center text-sm text-muted">
                Step {step} of 5
              </p>
            </div>

            <Card variant="luxury-elevated">
              {/* Step 1: Service Type */}
              {step === 1 && (
                <div>
                  <h3 className="text-premium text-xl font-semibold mb-6">
                    What service do you need?
                  </h3>
                  <div className="space-y-3">
                    {serviceTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          updateFormData('serviceType', type);
                          setTimeout(handleNext, 300);
                        }}
                        className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
                          formData.serviceType === type
                            ? 'border-gold-500 bg-gold-50'
                            : 'border-gray-200 hover:border-gold-300'
                        }`}
                      >
                        <span className="font-semibold text-navy-900">{type}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Yacht Details */}
              {step === 2 && (
                <div>
                  <h3 className="text-premium text-xl font-semibold mb-6">
                    Tell us about your yacht
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-navy-900 mb-2">
                        Yacht Type
                      </label>
                      <select
                        value={formData.yachtType}
                        onChange={(e) => updateFormData('yachtType', e.target.value)}
                        className="input-luxury input-focus w-full"
                      >
                        <option value="">Select yacht type</option>
                        {yachtTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-navy-900 mb-2">
                        Yacht Size (feet)
                      </label>
                      <input
                        type="text"
                        value={formData.yachtSize}
                        onChange={(e) => updateFormData('yachtSize', e.target.value)}
                        placeholder="e.g., 65"
                        className="input-luxury input-focus w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-navy-900 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => updateFormData('location', e.target.value)}
                        placeholder="Marina or location"
                        className="input-luxury input-focus w-full"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 mt-8">
                    <Button variant="outline" onClick={handleBack} className="flex-1">
                      Back
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleNext}
                      className="flex-1"
                      disabled={!formData.yachtType || !formData.yachtSize}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Urgency */}
              {step === 3 && (
                <div>
                  <h3 className="text-premium text-xl font-semibold mb-6">
                    How urgent is this request?
                  </h3>
                  <div className="space-y-3">
                    {urgencyLevels.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => {
                          updateFormData('urgency', level.value);
                          setTimeout(handleNext, 300);
                        }}
                        className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
                          formData.urgency === level.value
                            ? 'border-gold-500 bg-gold-50'
                            : 'border-gray-200 hover:border-gold-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-semibold text-navy-900 block">
                              {level.label}
                            </span>
                            <span className="text-sm text-muted">
                              {level.description}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <Button variant="outline" onClick={handleBack} className="mt-8 w-full">
                    Back
                  </Button>
                </div>
              )}

              {/* Step 4: Contact Information */}
              {step === 4 && (
                <div>
                  <h3 className="text-premium text-xl font-semibold mb-6">
                    Your contact information
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-navy-900 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => updateFormData('name', e.target.value)}
                        required
                        className="input-luxury input-focus w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-navy-900 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                        required
                        className="input-luxury input-focus w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-navy-900 mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateFormData('phone', e.target.value)}
                        required
                        className="input-luxury input-focus w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-navy-900 mb-2">
                        Additional Details
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => updateFormData('message', e.target.value)}
                        rows={4}
                        className="input-luxury input-focus w-full resize-none"
                        placeholder="Tell us more about your needs..."
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 mt-8">
                    <Button variant="outline" onClick={handleBack} className="flex-1">
                      Back
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleNext}
                      className="flex-1"
                      disabled={!formData.name || !formData.email || !formData.phone}
                    >
                      Review
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 5: Review */}
              {step === 5 && (
                <div>
                  <h3 className="text-premium text-xl font-semibold mb-6">
                    Review your request
                  </h3>
                  <div className="space-y-4 mb-8">
                    <div className="border-b border-gray-200 pb-4">
                      <p className="text-sm text-muted mb-1">Service Type</p>
                      <p className="font-semibold">{formData.serviceType}</p>
                    </div>
                    <div className="border-b border-gray-200 pb-4">
                      <p className="text-sm text-muted mb-1">Yacht Details</p>
                      <p className="font-semibold">
                        {formData.yachtType} • {formData.yachtSize}ft
                      </p>
                      <p className="text-sm text-muted">{formData.location}</p>
                    </div>
                    <div className="border-b border-gray-200 pb-4">
                      <p className="text-sm text-muted mb-1">Urgency</p>
                      <p className="font-semibold">
                        {urgencyLevels.find((l) => l.value === formData.urgency)?.label}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted mb-1">Contact</p>
                      <p className="font-semibold">{formData.name}</p>
                      <p className="text-sm">{formData.email}</p>
                      <p className="text-sm">{formData.phone}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={handleBack} className="flex-1">
                      Back
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} className="flex-1">
                      Submit Request
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 6: Confirmation */}
              {step === 6 && (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">✓</div>
                  <h3 className="text-premium text-2xl font-semibold mb-4">
                    Request Submitted!
                  </h3>
                  <p className="text-marine mb-6">
                    We've received your service request and will respond within 5 minutes.
                  </p>
                  <p className="text-muted text-sm mb-8">
                    You can track your request through our live chat widget or check your email for updates.
                  </p>
                  <Button variant="primary" asChild>
                    <a href="/">Return Home</a>
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </section>

      <Footer sections={footerSections} />
      <ChatWidget />
    </>
  );
}

export default function RequestServicePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto mb-4"></div>
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    }>
      <RequestServiceContent />
    </Suspense>
  );
}

