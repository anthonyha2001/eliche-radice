'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Button from './Button';
import Logo from './Logo';

interface NavItem {
  label: string;
  href: string;
}

interface NavbarProps {
  logo?: React.ReactNode;
  items?: NavItem[];
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
  showLogo?: boolean;
}

export default function Navbar({
  logo,
  items = [],
  ctaLabel = 'Contact',
  ctaHref = '/contact',
  className = '',
  showLogo = true,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <nav className={`bg-white border-b border-gray-200 sticky top-0 z-[60] ${className}`}>
      <div className="container container-xl">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          {showLogo && (
            <div className="flex items-center">
              {logo || <Logo variant="default" />}
            </div>
          )}
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {items.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="link-luxury text-gray-700 font-medium"
              >
                {item.label}
              </Link>
            ))}
            <Button variant="primary" size="sm" asChild href={ctaHref}>
              {ctaLabel}
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-gray-700 hover:text-navy-900 focus-luxury"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              {items.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="link-luxury text-gray-700 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                asChild
                href={ctaHref}
              >
                {ctaLabel}
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

