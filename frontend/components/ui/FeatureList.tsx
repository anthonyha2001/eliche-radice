import React from 'react';

interface Feature {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface FeatureListProps {
  features: Feature[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export default function FeatureList({
  features,
  columns = 3,
  className = '',
}: FeatureListProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };
  
  return (
    <div className={`grid ${gridCols[columns]} gap-6 lg:gap-8 ${className}`}>
      {features.map((feature, index) => (
        <div key={index} className="flex items-start">
          {feature.icon && (
            <div className="flex-shrink-0 text-gold-500 mr-4 text-2xl">
              {feature.icon}
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-premium text-lg font-semibold mb-2">
              {feature.title}
            </h3>
            <p className="text-marine">
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

