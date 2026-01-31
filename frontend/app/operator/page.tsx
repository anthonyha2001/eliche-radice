'use client';

import { useState, useEffect } from 'react';
import { getSocket } from '@/lib/socket';
import { getConversation, updateConversationStatus, getSuggestions } from '@/lib/api';
import { cleanUrl } from '@/lib/utils';
import ConversationList from '@/components/ConversationList';
import MessageList from '@/components/MessageList';
import MessageInput from '@/components/MessageInput';
import AISuggestionPanel from '@/components/AISuggestionPanel';

export default function OperatorDashboard() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [aiAutoResponseEnabled, setAiAutoResponseEnabled] = useState(false);
  // Mobile view state: 'list' | 'messages' | 'suggestions'
  const [mobileView, setMobileView] = useState<'list' | 'messages' | 'suggestions'>('list');
  
  const loadConversations = async () => {
    try {
      const apiUrl = cleanUrl(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');
      const response = await fetch(`${apiUrl}/api/conversations/all`);
      const data = await response.json();
      setConversations(data.data || []);
      setLoading(false);
      console.log(`📊 Loaded ${data.data?.length || 0} conversations (including resolved)`);
    } catch (error) {
      console.error('Failed to load conversations:', error);
      setLoading(false);
    }
  };
  
  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Load AI setting on mount
  useEffect(() => {
    const loadAiSetting = async () => {
      try {
        const apiUrl = cleanUrl(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');
        const response = await fetch(`${apiUrl}/api/ai-setting`);
        const data = await response.json();
        setAiAutoResponseEnabled(data.enabled || false);
      } catch (error) {
        console.error('Failed to load AI setting:', error);
      }
    };

    loadAiSetting();
  }, []);

  const toggleAiAutoResponse = async () => {
    const newValue = !aiAutoResponseEnabled;

    try {
      const apiUrl = cleanUrl(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');
      const response = await fetch(`${apiUrl}/api/ai-setting`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: newValue }),
      });

      if (response.ok) {
        setAiAutoResponseEnabled(newValue);
        alert(
          newValue
            ? '🤖 AI AUTO-RESPONSE ENABLED\n\nAI will respond to non-critical messages automatically.'
            : '⚠️ AI AUTO-RESPONSE DISABLED\n\nOnly operators will respond to messages.'
        );
      }
    } catch (error) {
      console.error('Failed to toggle AI:', error);
      alert('Failed to update AI setting');
    }
  };
  
  // Setup socket listeners for messages (per selected conversation)
  useEffect(() => {
    const socket = getSocket();
    
    socket.on('connect', () => {
      setIsConnected(true);
    });
    
    socket.on('disconnect', () => {
      setIsConnected(false);
    });
    
    const handleMessageReceived = (data: any) => {
      console.log('📨 Operator received message:', data.message);
      
      // Only add if this is the selected conversation
      if (data.message.conversationId === selectedId) {
        setMessages(prev => {
          // Check for duplicate
          const exists = prev.some(msg => msg.id === data.message.id);
          if (exists) {
            console.log('⚠️ Duplicate message, skipping');
            return prev;
          }
          console.log('✅ Adding message to conversation');
          return [...prev, data.message];
        });
        
        // Reload suggestions when a new customer message arrives
        if (data.message.sender === 'customer' && selectedId) {
          loadSuggestions(selectedId);
        }
      }
      
      // Refresh conversation list to update last message
      loadConversations();
    };
    
    socket.on('message:received', handleMessageReceived);
    
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('message:received', handleMessageReceived);
    };
  }, [selectedId]);

  // Listen for new conversations
  useEffect(() => {
    const socket = getSocket();

    const handleConversationNew = async (data: any) => {
      console.log('🆕 New conversation event received:', data);
      
      // Send email notification
      try {
        const response = await fetch('/api/notify-new-conversation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId: data.conversationId,
            customerName: data.customerName,
            customerPhone: data.customerPhone,
            priority: data.priority,
          }),
        });
        
        if (response.ok) {
          console.log('✅ Email notification sent for new conversation');
        } else {
          console.error('❌ Failed to send email notification:', await response.text());
        }
      } catch (error) {
        console.error('❌ Error sending email notification:', error);
      }
      
      // Refresh conversation list so operators see it immediately
      loadConversations();
    };

    socket.on('conversation:new', handleConversationNew);

    return () => {
      socket.off('conversation:new', handleConversationNew);
    };
  }, []);
  
  // Load messages when conversation selected
  useEffect(() => {
    if (selectedId) {
      console.log('📥 Loading messages for conversation:', selectedId);
      loadConversationMessages(selectedId);
      
      const socket = getSocket();
      console.log('📡 Operator subscribing to conversation:', selectedId);
      socket.emit('conversation:subscribe', selectedId);
      
      // On mobile, switch to messages view when conversation is selected
      if (window.innerWidth < 768) {
        setMobileView('messages');
      }
    }
  }, [selectedId]);
  
  const loadConversationMessages = async (id: string) => {
    try {
      const response = await getConversation(id);
      setMessages(response.data.messages || []);
      
      // Load suggestions when messages are loaded
      await loadSuggestions(id);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };
  
  const loadSuggestions = async (conversationId: string) => {
    try {
      console.log('🤖 Loading AI suggestions for conversation:', conversationId);
      const response = await getSuggestions(conversationId);
      setSuggestions(response.data || []);
      console.log(`✅ Loaded ${response.data?.length || 0} suggestions`);
    } catch (error) {
      console.error('❌ Failed to load suggestions:', error);
      setSuggestions([]);
    }
  };
  
  const handleSendMessage = (content: string) => {
    if (!selectedId) {
      console.error('❌ Cannot send message: no conversation selected');
      return;
    }
    
    console.log('📤 Operator sending message:', content);
    
    const socket = getSocket();
    socket.emit('message:operator', {
      conversationId: selectedId,
      content,
    });
    
    // DO NOT add optimistically - wait for socket event
  };
  
  const handleUseSuggestion = (content: string) => {
    // Copy suggestion to clipboard
    navigator.clipboard.writeText(content);
    alert('Suggestion copied to clipboard!');
  };
  
  const handleCloseConversation = async () => {
    if (!selectedId) return;
    
    if (!confirm('Mark this conversation as resolved? The customer will be notified.')) {
      return;
    }
    
    try {
      console.log('🔒 Resolving conversation:', selectedId);
      await updateConversationStatus(selectedId, 'resolved');
      
      // Refresh conversations list
      await loadConversations();
      
      // Clear selected conversation
      setSelectedId(null);
      setMessages([]);
      
      console.log('✅ Conversation resolved successfully');
    } catch (error) {
      console.error('❌ Failed to close conversation:', error);
      alert('Failed to close conversation. Please try again.');
    }
  };
  
  if (loading) {
    return (
      <div className="h-screen flex flex-col">
        {/* Header skeleton */}
        <header className="bg-navy-900 text-white p-3 md:p-4 flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-5 md:h-6 bg-navy-800 rounded w-48 md:w-64 animate-pulse"></div>
            <div className="h-3 md:h-4 bg-navy-800 rounded w-24 md:w-32 animate-pulse"></div>
          </div>
        </header>
        
        {/* Content skeleton */}
        <div className="flex-1 flex overflow-hidden">
          {/* Conversation list skeleton */}
          <div className="hidden md:block w-80 border-r border-gray-200 bg-gray-50 p-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
          
          {/* Main content skeleton */}
          <div className="flex-1 flex flex-col">
            <div className="bg-white border-b border-gray-200 p-3 md:p-4">
              <div className="h-5 md:h-6 bg-gray-200 rounded w-32 md:w-48 animate-pulse"></div>
            </div>
            <div className="flex-1 bg-gray-50 p-3 md:p-4 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg p-3 md:p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              ))}
            </div>
          </div>
          
          {/* AI panel skeleton */}
          <div className="hidden lg:block w-80 border-l border-gray-200 bg-gray-50 p-4">
            <div className="bg-white rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-navy-900 text-white p-3 md:p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0 shrink-0">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-xl font-semibold truncate">Eliche Radice LB Operator Dashboard</h1>
          <p className="text-xs md:text-sm text-gray-300">
            {isConnected ? '● Online' : '○ Connecting...'}
          </p>
        </div>
        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          <div className="text-xs md:text-sm whitespace-nowrap">
            <p>
              Active:{' '}
              <span className="font-semibold">{conversations.filter((c) => c.status === 'active').length}</span>
            </p>
          </div>

          {/* AI TOGGLE */}
          <div className="flex items-center gap-1.5 md:gap-2 bg-navy-800 px-2 md:px-3 py-1.5 md:py-2 rounded-lg">
            <span className="text-xs font-semibold hidden sm:inline">🤖 AI Auto-Response</span>
            <span className="text-xs font-semibold sm:hidden">🤖</span>
            <button
              onClick={toggleAiAutoResponse}
              className={`relative inline-flex h-5 w-9 md:h-6 md:w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                aiAutoResponseEnabled ? 'bg-green-500' : 'bg-gray-600'
              }`}
              title={
                aiAutoResponseEnabled
                  ? 'AI is responding automatically'
                  : 'AI is disabled'
              }
              aria-label={aiAutoResponseEnabled ? 'Disable AI auto-response' : 'Enable AI auto-response'}
            >
              <span
                className={`inline-block h-3 w-3 md:h-4 md:w-4 transform rounded-full bg-white transition-transform ${
                  aiAutoResponseEnabled ? 'translate-x-5 md:translate-x-6' : 'translate-x-0.5 md:translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </header>
      
      {/* Mobile Navigation Bar */}
      <div className="md:hidden bg-navy-800 text-white flex items-center justify-around border-b border-navy-700 shrink-0">
        <button
          onClick={() => setMobileView('list')}
          className={`flex-1 py-3 px-2 text-center text-sm font-medium transition-colors ${
            mobileView === 'list' ? 'bg-navy-700 text-gold-400' : 'text-gray-300 hover:bg-navy-700'
          }`}
        >
          <div className="flex flex-col items-center gap-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>Conversations</span>
          </div>
        </button>
        <button
          onClick={() => selectedId && setMobileView('messages')}
          disabled={!selectedId}
          className={`flex-1 py-3 px-2 text-center text-sm font-medium transition-colors ${
            mobileView === 'messages' ? 'bg-navy-700 text-gold-400' : 'text-gray-300 hover:bg-navy-700'
          } ${!selectedId ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex flex-col items-center gap-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span>Messages</span>
          </div>
        </button>
        <button
          onClick={() => selectedId && setMobileView('suggestions')}
          disabled={!selectedId}
          className={`flex-1 py-3 px-2 text-center text-sm font-medium transition-colors ${
            mobileView === 'suggestions' ? 'bg-navy-700 text-gold-400' : 'text-gray-300 hover:bg-navy-700'
          } ${!selectedId ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex flex-col items-center gap-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span>AI</span>
          </div>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Conversation List */}
        <div className={`${mobileView === 'list' ? 'flex' : 'hidden'} md:flex w-full md:w-80 border-r border-gray-200 bg-gray-50 flex-col`}>
          <ConversationList
            conversations={conversations}
            selectedId={selectedId}
            onSelect={(id) => {
              setSelectedId(id);
              if (window.innerWidth < 768) {
                setMobileView('messages');
              }
            }}
          />
        </div>
        
        {/* Messages */}
        <div className={`${mobileView === 'messages' ? 'flex' : 'hidden'} md:flex flex-1 flex-col`}>
          {selectedId ? (
            <>
              {/* Conversation Header */}
              <div className="bg-white border-b border-gray-200 p-3 md:p-4 flex items-center justify-between shrink-0">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {/* Back button on mobile */}
                    <button
                      onClick={() => setMobileView('list')}
                      className="md:hidden p-1 hover:bg-gray-100 rounded"
                      aria-label="Back to conversations"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-semibold text-gray-900 text-sm md:text-base truncate">
                        {conversations.find(c => c.id === selectedId)?.customerName || 
                         `Conversation ${selectedId.substring(0, 8)}...`}
                      </h2>
                      <p className="text-xs text-gray-500 truncate">
                        {conversations.find(c => c.id === selectedId)?.customerPhone || ''}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleCloseConversation}
                  className="ml-2 px-3 md:px-4 py-1.5 md:py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs md:text-sm font-medium transition-colors whitespace-nowrap"
                  title="Mark conversation as resolved"
                >
                  <span className="hidden sm:inline">✓ Mark as Resolved</span>
                  <span className="sm:hidden">✓ Resolve</span>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <MessageList messages={messages} currentUser="operator" />
              </div>
              <div className="border-t border-gray-200 shrink-0">
                <MessageInput
                  onSend={handleSendMessage}
                  disabled={!isConnected}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 p-4">
              <p className="text-sm md:text-base">Select a conversation to start responding</p>
            </div>
          )}
        </div>
        
        {/* AI Suggestions */}
        <div className={`${mobileView === 'suggestions' ? 'flex' : 'hidden'} lg:flex w-full lg:w-80 border-l border-gray-200 bg-gray-50 p-3 md:p-4 flex-col`}>
          {selectedId ? (
            <>
              {/* Mobile header for AI panel */}
              <div className="lg:hidden mb-3 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">AI Suggestions</h3>
                <button
                  onClick={() => setMobileView('messages')}
                  className="p-1 hover:bg-gray-100 rounded"
                  aria-label="Back to messages"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <AISuggestionPanel
                  suggestions={suggestions}
                  onUse={handleUseSuggestion}
                  onRefresh={() => {
                    if (selectedId) {
                      loadSuggestions(selectedId);
                    }
                  }}
                  loading={false}
                />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              <p>Select a conversation to see suggestions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

