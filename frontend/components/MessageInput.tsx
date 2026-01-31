'use client';

import { useState, useRef, KeyboardEvent } from 'react';

interface MessageInputProps {
  onSend: (content: string) => void | Promise<void>;
  disabled?: boolean;
  onTyping?: () => void;
}

export default function MessageInput({ onSend, disabled, onTyping }: MessageInputProps) {
  const [content, setContent] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const MAX_LENGTH = 500;
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_LENGTH) {
      setContent(value);
      setCharCount(value.length);
      onTyping?.();
      
      // Auto-resize textarea
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`;
      }
    }
  };
  
  const handleSend = async () => {
    const trimmed = content.trim();
    if (trimmed && !disabled && !isSending) {
      setIsSending(true);
      try {
        await onSend(trimmed);
        setContent('');
        setCharCount(0);
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
      } catch (error) {
        console.error('Failed to send message:', error);
      } finally {
        setIsSending(false);
      }
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <div className="p-4">
      <div className="flex items-end space-x-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Type your message..."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            rows={1}
            style={{ minHeight: '44px', maxHeight: '100px' }}
          />
          {charCount > 400 && (
            <p className="absolute bottom-1 right-2 text-xs text-gray-400">
              {charCount}/{MAX_LENGTH}
            </p>
          )}
        </div>
        <button
          onClick={handleSend}
          disabled={disabled || !content.trim() || isSending}
          className={`btn-primary h-11 px-4 disabled:opacity-50 disabled:cursor-not-allowed ${
            isSending ? 'animate-pulse' : ''
          }`}
          aria-label="Send message"
        >
          {isSending ? (
            <span className="text-sm">Sending...</span>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </div>
      {disabled && (
        <p className="text-xs text-gray-500 mt-2">Connecting...</p>
      )}
    </div>
  );
}
