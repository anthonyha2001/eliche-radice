import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  align = 'center',
  className = '',
}: SectionHeaderProps) {
  const alignStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };
  
  return (
    <div className={`${alignStyles[align]} ${className}`}>
      <h2 className="text-premium text-3xl lg:text-4xl font-semibold mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-marine text-lg lg:text-xl max-w-3xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}

