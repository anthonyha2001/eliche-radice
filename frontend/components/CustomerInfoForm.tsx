'use client';

import { useState } from 'react';

interface CustomerInfoFormProps {
  onSubmit: (name: string, phone: string) => void;
}

export default function CustomerInfoForm({ onSubmit }: CustomerInfoFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  
  const validatePhone = (phone: string) => {
    // Accept various formats: +1234567890, 123-456-7890, (123) 456-7890
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { name?: string; phone?: string } = {};
    
    // Validate name
    if (!name.trim() || name.trim().length < 2) {
      newErrors.name = 'Please enter your full name';
    }
    
    // Validate phone
    if (!phone.trim()) {
      newErrors.phone = 'Please enter your phone number';
    } else if (!validatePhone(phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit(name.trim(), phone.trim());
  };
  
  return (
    <div className="p-6 bg-white">
      <h3 className="font-serif text-2xl text-navy-900 mb-2">
        Welcome to Eliche Radice LB
      </h3>
      <p className="text-gray-600 mb-6">
        Before we begin, may we have your contact information?
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="customer-name" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <input
            id="customer-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors(prev => ({ ...prev, name: undefined }));
            }}
            placeholder="Your name"
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="customer-phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            id="customer-phone"
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setErrors(prev => ({ ...prev, phone: undefined }));
            }}
            placeholder="Your phone number"
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </div>
        
        <button
          type="submit"
          className="w-full btn-primary"
        >
          Start Conversation
        </button>
      </form>
      
      <p className="text-xs text-gray-500 mt-4">
        Your information is used solely to provide you with professional yacht maintenance services.
      </p>
    </div>
  );
}

