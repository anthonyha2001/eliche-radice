'use client';

import React, { useEffect } from 'react';
import Badge from './Badge';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose: () => void;
  className?: string;
}

export default function Toast({
  message,
  type = 'info',
  duration = 5000,
  onClose,
  className = '',
}: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);
  
  const typeStyles = {
    success: 'bg-normal text-white border-l-4 border-normal',
    error: 'bg-critical text-white border-l-4 border-critical',
    info: 'bg-info text-white border-l-4 border-info',
    warning: 'bg-high text-white border-l-4 border-high',
  };
  
  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };
  
  return (
    <div
      className={`fixed bottom-4 right-4 z-tooltip flex items-center gap-3 px-6 py-4 rounded-lg shadow-xl ${typeStyles[type]} ${className} animate-in slide-in-from-bottom-5`}
      role="alert"
    >
      <span className="text-xl font-bold">{icons[type]}</span>
      <p className="font-medium">{message}</p>
      <button
        onClick={onClose}
        className="ml-4 text-white hover:text-gray-200 transition-colors"
        aria-label="Close notification"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

