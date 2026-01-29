import React from 'react';
import Card from './Card';
import Button from './Button';

interface ServiceCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  features?: string[];
  onLearnMore?: () => void;
  className?: string;
}

export default function ServiceCard({
  title,
  description,
  icon,
  features,
  onLearnMore,
  className = '',
}: ServiceCardProps) {
  return (
    <Card variant="luxury" className={`h-full flex flex-col hover-lift ${className}`}>
      {icon && (
        <div className="flex justify-center mb-4 text-gold-500">
          {icon}
        </div>
      )}
      <h3 className="text-premium text-xl font-semibold mb-3 text-center">
        {title}
      </h3>
      <p className="text-marine mb-4 flex-1 text-center md:text-left">
        {description}
      </p>
      {features && features.length > 0 && (
        <ul className="mb-6 space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start text-sm text-gray-700">
              <span className="text-gold-500 mr-2">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      )}
      {onLearnMore && (
        <Button variant="outline" size="sm" onClick={onLearnMore}>
          Learn More
        </Button>
      )}
    </Card>
  );
}

