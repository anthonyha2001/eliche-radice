import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  asChild?: boolean;
  href?: string;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  asChild = false,
  href,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-md transition-all duration-200 focus-luxury disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center btn-interactive';
  
  const variantStyles = {
    primary: 'bg-gold-500 hover:bg-gold-600 text-white shadow-sm hover:shadow-gold hover:scale-[1.02] active:scale-[0.98]',
    secondary: 'bg-navy-900 hover:bg-navy-800 text-white shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]',
    ghost: 'text-navy-900 hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98]',
    outline: 'border-2 border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white hover:scale-[1.02] active:scale-[0.98]',
  };
  
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;
  
  // When asChild + href are provided, render a styled Link
  if (asChild && href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  
  return (
    <button
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}

