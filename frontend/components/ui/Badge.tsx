import React from 'react';

interface BadgeProps {
  variant?: 'critical' | 'high' | 'normal' | 'info' | 'gold';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

export default function Badge({
  variant = 'normal',
  size = 'md',
  children,
  className = '',
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center rounded-full font-semibold';
  
  const variantStyles = {
    critical: 'bg-critical text-white',
    high: 'bg-high text-white',
    normal: 'bg-normal text-white',
    info: 'bg-info text-white',
    gold: 'bg-gold-500 text-white',
  };
  
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };
  
  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {children}
    </span>
  );
}

