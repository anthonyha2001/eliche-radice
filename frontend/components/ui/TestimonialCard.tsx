import React from 'react';
import Card from './Card';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role?: string;
  company?: string;
  rating?: number;
  className?: string;
}

export default function TestimonialCard({
  quote,
  author,
  role,
  company,
  rating = 5,
  className = '',
}: TestimonialCardProps) {
  return (
    <Card variant="luxury-elevated" className={`hover-scale-subtle ${className}`}>
      {rating > 0 && (
        <div className="flex items-center mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`w-5 h-5 ${
                i < rating ? 'text-gold-500' : 'text-gray-300'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      )}
      <blockquote className="text-marine text-lg mb-6 italic">
        "{quote}"
      </blockquote>
      <div className="border-t border-gray-200 pt-4">
        <p className="font-semibold text-navy-900">{author}</p>
        {(role || company) && (
          <p className="text-sm text-gray-600">
            {role}
            {role && company && ', '}
            {company}
          </p>
        )}
      </div>
    </Card>
  );
}

