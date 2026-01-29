import React from 'react';
import Link from 'next/link';

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
    default: 'h-10 w-auto', // Navbar: 40px height minimum
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
  
  const LogoContent = () => (
    <div className={`flex items-center ${sizeStyles[variant]} ${paddingStyles[variant]} ${className}`}>
      {/* Logo Icon/Image Placeholder */}
      <div className="flex-shrink-0">
        {/* Replace this with actual logo image */}
        <div className={`${sizeStyles[variant]} flex items-center justify-center rounded-md bg-navy-900 text-white font-bold`} style={{ background: 'linear-gradient(to bottom right, #0A1929, #1A2332)' }}>
          <span className="text-xs lg:text-sm">ER</span>
        </div>
        {/* Alternative: Use actual image
        <Image
          src="/logo.svg"
          alt="Eliche Radice LB"
          width={variant === 'watermark' ? 24 : variant === 'footer' ? 32 : 40}
          height={variant === 'watermark' ? 24 : variant === 'footer' ? 32 : 40}
          className={sizeStyles[variant]}
          priority={variant === 'default'}
        />
        */}
      </div>
      
      {/* Logo Text */}
      {showText && (
        <span className={`text-premium font-bold ml-3 ${textStyles[variant]} ${
          variant === 'footer' ? 'text-white' : 'text-navy-900'
        }`}>
          Eliche Radice LB
        </span>
      )}
    </div>
  );
  
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

