'use client';

import { useState, useEffect } from 'react';
import { getSocket } from '@/lib/socket';
import { getConversation, updateConversationStatus } from '@/lib/api';
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
  
  const loadConversations = async () => {
    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/$/, '');
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
        const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/$/, '');
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
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/$/, '');
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
    }
  }, [selectedId]);
  
  const loadConversationMessages = async (id: string) => {
    try {
      const response = await getConversation(id);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
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
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-navy-900 text-white p-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Eliche Radice LB Operator Dashboard</h1>
          <p className="text-sm text-gray-300">
            {isConnected ? '● Online' : '○ Connecting...'}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm">
            <p>
              Active:{' '}
              {conversations.filter((c) => c.status === 'active').length}
            </p>
          </div>

          {/* AI TOGGLE */}
          <div className="flex items-center space-x-2 bg-navy-800 px-3 py-2 rounded-lg">
            <span className="text-xs font-semibold">🤖 AI Auto-Response</span>
            <button
              onClick={toggleAiAutoResponse}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                aiAutoResponseEnabled ? 'bg-green-500' : 'bg-gray-600'
              }`}
              title={
                aiAutoResponseEnabled
                  ? 'AI is responding automatically'
                  : 'AI is disabled'
              }
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  aiAutoResponseEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Conversation List */}
        <div className="w-80 border-r border-gray-200 bg-gray-50">
          <ConversationList
            conversations={conversations}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>
        
        {/* Messages */}
        <div className="flex-1 flex flex-col">
          {selectedId ? (
            <>
              {/* Conversation Header */}
              <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {conversations.find(c => c.id === selectedId)?.customerName || 
                     `Conversation ${selectedId.substring(0, 8)}...`}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {conversations.find(c => c.id === selectedId)?.customerPhone || ''}
                  </p>
                </div>
                <button
                  onClick={handleCloseConversation}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                  title="Mark conversation as resolved"
                >
                  ✓ Mark as Resolved
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <MessageList messages={messages} currentUser="operator" />
              </div>
              <div className="border-t border-gray-200">
                <MessageInput
                  onSend={handleSendMessage}
                  disabled={!isConnected}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <p>Select a conversation to start responding</p>
            </div>
          )}
        </div>
        
        {/* AI Suggestions */}
        <div className="w-80 border-l border-gray-200 bg-gray-50 p-4">
          {selectedId ? (
            <AISuggestionPanel
              suggestions={suggestions}
              onUse={handleUseSuggestion}
              onRefresh={() => {
                // TODO: Generate suggestions via API
                setSuggestions([
                  {
                    id: '1',
                    content: 'Thank you for reaching out. We can assist with that immediately.',
                  },
                  {
                    id: '2',
                    content: 'I understand your concern. Let me connect you with our senior technician.',
                  },
                ]);
              }}
              loading={false}
            />
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

