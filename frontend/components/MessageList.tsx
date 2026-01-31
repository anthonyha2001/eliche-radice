'use client';

import { useEffect, useRef } from 'react';
import { formatMessageTime } from '@/lib/formatTime';

interface Message {
  id: string;
  sender: 'customer' | 'operator';
  content: string;
  timestamp: number;
  read?: boolean;
   isAI?: boolean;
}

interface MessageListProps {
  messages: Message[];
  currentUser: 'customer' | 'operator';
}

export default function MessageList({ messages, currentUser }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Auto-scroll to bottom on new messages
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm p-8 text-center">
        <p>Send a message to get started.<br/>Our team is here to help.</p>
      </div>
    );
  }
  
  return (
    <div className="p-3 md:p-4 space-y-3 md:space-y-4">
      {messages.map((message) => {
        const isOwnMessage = message.sender === currentUser;
        
        return (
          <div
            key={message.id}
            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] md:max-w-[75%] rounded-lg px-3 md:px-4 py-2 ${
                isOwnMessage
                  ? 'bg-navy-900 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm md:text-base whitespace-pre-wrap break-words">{message.content}</p>
              <div className="flex items-center justify-between mt-1.5 space-x-2">
                <div className="flex items-center space-x-2 flex-wrap">
                  <p className={`text-xs ${isOwnMessage ? 'text-gray-300' : 'text-gray-500'}`}>
                    {formatMessageTime(message.timestamp) || 'Just now'}
                  </p>
                  {/* AI Badge */}
                  {message.isAI && (
                    <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full font-semibold">
                      AI
                    </span>
                  )}
                </div>
                {isOwnMessage && message.read && (
                  <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-gold-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
