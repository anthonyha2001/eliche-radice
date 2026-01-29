'use client';

import { useState } from 'react';
import ConversationList from '@/components/ConversationList';

export default function TestConversationsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const mockConversations = [
    {
      id: '1',
      customerId: 'customer-abc-123',
      status: 'active',
      priority: 'critical' as const,
      createdAt: Date.now() - 60000,
      lastMessageAt: Date.now() - 30000,
      lastMessage: 'URGENT: Engine failure!',
      unreadCount: 2,
    },
    {
      id: '2',
      customerId: 'customer-def-456',
      status: 'active',
      priority: 'high' as const,
      createdAt: Date.now() - 120000,
      lastMessageAt: Date.now() - 60000,
      lastMessage: 'Need maintenance soon',
      unreadCount: 1,
    },
    {
      id: '3',
      customerId: 'customer-ghi-789',
      status: 'active',
      priority: 'normal' as const,
      createdAt: Date.now() - 180000,
      lastMessageAt: Date.now() - 90000,
      lastMessage: 'General inquiry about services',
      unreadCount: 0,
    },
  ];
  
  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="card-luxury mb-6">
          <h1 className="text-2xl font-bold mb-4">Conversation List Test</h1>
          <p className="text-sm text-charcoal mb-4">
            Test the conversation list component with mock data.
          </p>
        </div>
        
        <div className="card-luxury">
          <div className="h-[500px] border border-gray-300 rounded-lg overflow-hidden">
            <ConversationList
              conversations={mockConversations}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>
          
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-charcoal">
              <span className="font-semibold">Selected:</span>{' '}
              {selectedId || 'None'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

