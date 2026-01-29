'use client';

import { useState } from 'react';
import AISuggestionPanel from '@/components/AISuggestionPanel';

export default function TestSuggestionsPage() {
  const [used, setUsed] = useState('');
  const [loading, setLoading] = useState(false);
  
  const mockSuggestions = [
    {
      id: '1',
      content: 'Thank you for contacting us about your engine concern. We can dispatch a technician to assess the situation within the next 2 hours.',
      confidence: 0.9,
    },
    {
      id: '2',
      content: 'I understand this is urgent. Our senior technician will contact you directly within 15 minutes to discuss immediate steps.',
      confidence: 0.85,
    },
    {
      id: '3',
      content: 'We appreciate your patience. Could you provide more details about the engine noise? This will help us prepare the right equipment.',
      confidence: 0.75,
    },
  ];
  
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };
  
  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="card-luxury mb-6">
          <h1 className="text-2xl font-bold mb-4">AI Suggestions Test</h1>
          <p className="text-sm text-charcoal mb-4">
            Test the AI suggestion panel component with mock suggestions.
          </p>
        </div>
        
        <div className="card-luxury">
          <AISuggestionPanel
            suggestions={loading ? [] : mockSuggestions}
            onUse={setUsed}
            onRefresh={handleRefresh}
            loading={loading}
          />
        </div>
        
        {used && (
          <div className="mt-6 card-luxury bg-green-50 border-green-200">
            <p className="text-sm font-semibold text-green-900 mb-2">Used Suggestion:</p>
            <p className="text-sm text-green-800">{used}</p>
          </div>
        )}
      </div>
    </div>
  );
}

