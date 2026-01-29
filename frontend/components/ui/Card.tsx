import React from 'react';

interface CardProps {
  variant?: 'luxury' | 'luxury-elevated' | 'marine';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({
  variant = 'luxury',
  children,
  className = '',
  onClick,
}: CardProps) {
  const baseStyles = 'rounded-lg';
  
  const variantStyles = {
    luxury: 'bg-white p-6 shadow-md border border-gray-200',
    'luxury-elevated': 'bg-white p-8 rounded-xl shadow-xl border border-gray-200',
    marine: 'bg-navy-800 text-white p-6 shadow-lg',
  };
  
  const interactiveStyles = onClick ? 'cursor-pointer card-interactive' : 'transition-shadow duration-200';
  
  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${interactiveStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

