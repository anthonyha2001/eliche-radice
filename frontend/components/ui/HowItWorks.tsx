import React from 'react';
import Card from './Card';

interface Step {
  label: string;
  title: string;
  description: string;
}

interface HowItWorksProps {
  steps: Step[];
  className?: string;
}

export default function HowItWorks({ steps, className = '' }: HowItWorksProps) {
  return (
    <section className={className}>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 lg:gap-8">
        {steps.map((step, index) => (
          <div key={step.label} className="flex flex-col items-center md:items-stretch">
            {/* Numbered circle + connector (desktop) */}
            <div className="hidden md:flex items-center w-full mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gold-500 text-white text-sm font-semibold">
                {index + 1}
              </div>
              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-px bg-gradient-to-r from-gold-500/60 to-gray-300 ml-3" />
              )}
            </div>

            {/* Step content */}
            <Card
              variant="luxury"
              className="relative w-full h-full text-center md:text-left hover-lift"
            >
              {/* Mobile badge: step number in the corner of the card */}
              <div className="md:hidden absolute -top-3 -left-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gold-500 text-white text-xs font-semibold shadow-md">
                  {index + 1}
                </div>
              </div>

              <p className="text-xs font-semibold tracking-wide text-gold-500 uppercase mb-1">
                {step.label}
              </p>
              <h3 className="text-premium text-lg font-semibold mb-2">
                {step.title}
              </h3>
              <p className="text-marine text-sm">
                {step.description}
              </p>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}


