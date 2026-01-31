import React from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { Phone, Mail, MapPin, Clock, ShieldCheck, Instagram, Facebook } from 'lucide-react';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  logo?: React.ReactNode;
  sections?: FooterSection[];
  socialLinks?: { platform: string; href: string; icon: React.ReactNode }[];
  copyright?: string;
  className?: string;
  showLogo?: boolean;
}

export default function Footer({
  logo,
  sections = [],
  socialLinks = [],
  copyright = `© ${new Date().getFullYear()} Eliche Radice LB. All rights reserved.`,
  className = '',
  showLogo = true,
}: FooterProps) {
  return (
    <footer className={`bg-navy-900 text-white ${className}`}>
      <div className="container container-xl">
        <div className="py-10 lg:py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Logo & Description */}
            <div className="lg:col-span-1 text-center lg:text-left">
              {showLogo && (
                <div className="mb-4">
                  {logo || <Logo variant="footer" showText={false} />}
                </div>
              )}
              <p className="text-gray-300 text-sm mb-2">
                Premium yacht maintenance. Always reachable when your vessel needs it most.
              </p>

              {/* Compact Trust Block inline under brand */}
             

              {socialLinks.length > 0 && (
                <div className="flex items-center justify-center lg:justify-start space-x-4 mt-6">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover-text text-gray-300 hover:text-gold-400"
                      aria-label={social.platform}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              )}
            </div>
            
            {/* Footer Sections */}
            {sections.map((section, index) => (
              <div key={index} className="text-center lg:text-left">
                <h4 className="font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        className="link-luxury text-gray-300 text-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                {section.title.toLowerCase().includes('support') && (
                  <div className="mt-4 space-y-2 text-sm text-gray-300">
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                      <span className="inline-flex items-center gap-1">
                        <Phone className="w-3 h-3 text-gold-400" />
                        <a
                          href="tel:+96170186060"
                          className="link-luxury text-gray-300"
                        >
                          +961 70186060
                        </a>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Mail className="w-3 h-3 text-gold-400" />
                        <a
                          href="mailto:support@elicheradice.com"
                          className="link-luxury text-gray-300"
                        >
                          support@elicheradice.com
                        </a>
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gold-400" />
                        <span>Support · 24/7</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Copyright */}
          <div className="border-t border-navy-700 mt-12 pt-8">
            <p className="text-gray-400 text-sm text-center">
              {copyright}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

