'use client';

import dynamic from 'next/dynamic';

// Client Component wrapper for ChatWidget
// This allows Server Components to use ChatWidget without 'use client' directive
const ChatWidget = dynamic(() => import('@/components/ChatWidget'), {
  ssr: false,
  loading: () => (
    <div className="fixed bottom-5 right-4 md:bottom-6 md:right-6 z-50">
      <div className="w-14 h-14 md:w-16 md:h-16 bg-gold-500 rounded-full shadow-2xl flex items-center justify-center animate-pulse">
        <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </div>
    </div>
  ),
});

export default function ChatWidgetWrapper() {
  return <ChatWidget />;
}

