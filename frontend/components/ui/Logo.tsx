import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  variant?: 'default' | 'footer' | 'watermark';
  href?: string;
  className?: string;
  showText?: boolean;
}

export default function Logo({
  variant = 'default',
  href = '/',
  className = '',
  showText = true,
}: LogoProps) {
  // Logo sizing rules based on variant
  const sizeStyles = {
    default: 'h-full w-auto', // Navbar: Fit parent height
    footer: 'h-8 w-auto', // Footer: 32px height
    watermark: 'h-6 w-auto opacity-20', // Watermark: 24px height, subtle
  };
  
  // Padding rules
  const paddingStyles = {
    default: 'pr-4', // Navbar: padding-right for spacing
    footer: 'mb-4', // Footer: margin-bottom
    watermark: '', // Watermark: no padding
  };
  
  // Text sizing based on variant
  const textStyles = {
    default: 'text-2xl', // Navbar: larger text
    footer: 'text-xl', // Footer: medium text
    watermark: 'text-sm', // Watermark: small text
  };
  
  const LogoContent = () => {
    // Size mapping for the logo image - no background container
    const logoSizes = {
      default: { width: 180, height: 60 }, // Will be constrained by parent height
      footer: { width: 150, height: 50 },
      watermark: { width: 120, height: 40 },
    };
    
    const logoSize = logoSizes[variant];
    
    return (
      <div className={`flex items-center gap-0 ${sizeStyles[variant]} ${paddingStyles[variant]} ${className}`}>
        {/* Logo Image - No Background, no spacing, fits parent height */}
        <div className={`flex-shrink-0 -mr-0 ${variant === 'default' ? 'h-full' : ''}`}>
          <Image
            src="/images/Logo white-01.png"
            alt="Eliche Radice LB"
            width={logoSize.width}
            height={logoSize.height}
            className={`object-contain block ${variant === 'default' ? 'h-full w-auto' : ''}`}
            priority={variant === 'default'}
          />
        </div>
        
        {/* Logo Text - No spacing, directly adjacent */}
        {showText && (
          <span className={`text-premium font-bold leading-none ${textStyles[variant]} ${
            variant === 'footer' ? 'text-white' : 'text-navy-900'
          }`}>
            Eliche Radice LB
          </span>
        )}
      </div>
    );
  };
  
  // Watermark variant doesn't link
  if (variant === 'watermark') {
    return (
      <div className="fixed bottom-4 left-4 z-10 pointer-events-none">
        <LogoContent />
      </div>
    );
  }
  
  // Footer variant with optional link
  if (variant === 'footer') {
    return (
      <Link href={href} className="inline-block hover-opacity">
        <LogoContent />
      </Link>
    );
  }
  
  // Default (Navbar) variant
  return (
    <Link href={href} className="inline-block hover-opacity">
      <LogoContent />
    </Link>
  );
}

