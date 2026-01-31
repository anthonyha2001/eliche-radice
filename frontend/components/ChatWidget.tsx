'use client';

import { useState, useEffect, useRef } from 'react';
import { getSocket } from '@/lib/socket';
import { createConversation } from '@/lib/api';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

type CollectionStep = 'idle' | 'collecting_name' | 'collecting_phone' | 'complete';

export default function ChatWidget() {
  console.log('🌐 API URL:', process.env.NEXT_PUBLIC_API_URL);
  
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [conversationStatus, setConversationStatus] = useState<string>('active');
  const [collectionStep, setCollectionStep] = useState<CollectionStep>('idle');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const socketRef = useRef<any>(null);
  const isOpenRef = useRef<boolean>(false);
  
  // Keep ref in sync with state for notification checks
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);
  
  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      if (Notification.permission === 'default') {
        console.log('🔔 Requesting notification permission...');
        Notification.requestPermission().then((permission) => {
          console.log('🔔 Notification permission:', permission);
        });
      } else {
        console.log('🔔 Notification permission:', Notification.permission);
      }
    } else {
      console.log('⚠️ Browser does not support notifications');
    }
  }, []);

  useEffect(() => {
    const storedId = localStorage.getItem('eliche_conversation_id');
    const storedInfo = localStorage.getItem('eliche_customer_info');
    
    console.log('💾 Loading stored data:', { storedId, storedInfo });
    
    // Load conversation if exists
    if (storedId) {
      setConversationId(storedId);
      loadConversationMessages(storedId);
      setCollectionStep('complete');
    }
    
    // Load customer info if exists
    if (storedInfo) {
      try {
        const info = JSON.parse(storedInfo);
        setCustomerName(info.name);
        setCustomerPhone(info.phone);
        setCollectionStep('complete');
        console.log('✅ Customer info loaded:', info.name);
      } catch (error) {
        console.error('Failed to parse customer info:', error);
      }
    }
    
    // If no conversation, start collection flow
    if (!storedId && !storedInfo && isOpen) {
      setCollectionStep('idle');
    }
    
    // Initialize socket
    socketRef.current = getSocket();
    
    socketRef.current.on('connect', () => {
      console.log('✅ Socket connected');
      setIsConnected(true);
    });
    
    socketRef.current.on('disconnect', () => {
      console.log('⚠️ Socket disconnected');
      setIsConnected(false);
    });
    
    socketRef.current.on('message:received', (data: any) => {
      console.log('📨 Message received via socket:', data.message);
      
      // Only notify if message is from operator (not customer's own messages)
      if (data.message.sender === 'operator') {
        const isWidgetOpen = isOpenRef.current;
        const isPageFocused = document.hasFocus();
        
        console.log('🔔 Notification check:', {
          hasNotificationAPI: 'Notification' in window,
          permission: 'Notification' in window ? Notification.permission : 'N/A',
          isWidgetOpen,
          isPageFocused,
          shouldNotify: !isWidgetOpen || !isPageFocused
        });
        
        // Show browser notification if widget is closed or page is not focused
        if ('Notification' in window && Notification.permission === 'granted') {
          // Always show notification for operator messages (even if widget is open, user might be on another tab)
          // But we can make it smarter: only notify if widget is closed OR page is not focused
          if (!isWidgetOpen || !isPageFocused) {
            try {
              const notification = new Notification('Eliche Radice LB', {
                body: data.message.content.length > 100 
                  ? data.message.content.substring(0, 100) + '...'
                  : data.message.content,
                icon: '/favicon.ico',
                tag: `message-${data.message.id}`, // Prevent duplicate notifications
                requireInteraction: false,
                badge: '/favicon.ico',
              });
              
              console.log('✅ Browser notification shown');
              
              // Auto-close notification after 5 seconds
              setTimeout(() => {
                notification.close();
              }, 5000);
              
              // Click notification to open chat widget
              notification.onclick = () => {
                window.focus();
                setIsOpen(true);
                notification.close();
              };
            } catch (error) {
              console.error('❌ Failed to show notification:', error);
            }
          } else {
            console.log('⏭️ Skipping notification: widget is open and page is focused');
          }
        } else if ('Notification' in window && Notification.permission === 'default') {
          console.log('⚠️ Notification permission not yet granted, requesting...');
          Notification.requestPermission().then((permission) => {
            console.log('🔔 Notification permission result:', permission);
            if (permission === 'granted' && (!isWidgetOpen || !isPageFocused)) {
              // Retry showing notification after permission granted
              try {
                const notification = new Notification('Eliche Radice LB', {
                  body: data.message.content.length > 100 
                    ? data.message.content.substring(0, 100) + '...'
                    : data.message.content,
                  icon: '/favicon.ico',
                  tag: `message-${data.message.id}`,
                });
                setTimeout(() => notification.close(), 5000);
                notification.onclick = () => {
                  window.focus();
                  setIsOpen(true);
                  notification.close();
                };
              } catch (error) {
                console.error('❌ Failed to show notification after permission:', error);
              }
            }
          });
        } else if ('Notification' in window && Notification.permission === 'denied') {
          console.log('⚠️ Notification permission denied by user');
        }
      }
      
      // Add message with deduplication check
      setMessages(prev => {
        // Check if message already exists by ID
        const exists = prev.some(msg => msg.id === data.message.id);
        if (exists) {
          console.log('⚠️ Duplicate message detected, skipping:', data.message.id);
          return prev;
        }
        console.log('✅ Adding new message:', data.message.id);
        return [...prev, data.message];
      });
    });

    socketRef.current.on('conversation:status', (data: any) => {
      console.log('📊 Conversation status changed:', data.status);
      setConversationStatus(data.status);

      if (data.status === 'resolved') {
        alert('Your request has been resolved. Thank you for contacting Eliche Radice LB! You can start a new conversation anytime.');

        // Clear conversation from customer side only
        localStorage.removeItem('eliche_conversation_id');
        setConversationId(null);
        setMessages([]);
        setConversationStatus('active');

        // Close widget after 2 seconds
        setTimeout(() => {
          setIsOpen(false);
        }, 2000);

        console.log('✅ Customer conversation cleared after resolve');
      }
    });
    
    socketRef.current.on('message:error', (error: any) => {
      console.error('❌ Message error:', error);
      alert('Failed to send message. Please try again.');
    });
    
    return () => {
      socketRef.current?.off('connect');
      socketRef.current?.off('disconnect');
      socketRef.current?.off('message:received');
      socketRef.current?.off('message:error');
      socketRef.current?.off('conversation:status');
    };
  }, []);
  
  // Load messages when conversation exists
  const loadConversationMessages = async (convId: string) => {
    try {
      console.log('📥 Loading conversation history for:', convId);
      const { getConversation } = await import('@/lib/api');
      const response = await getConversation(convId);
      
      if (response.data && response.data.messages) {
        console.log(`✅ Loaded ${response.data.messages.length} messages`);
        setMessages(response.data.messages);
      } else {
        console.log('⚠️ No messages found for conversation');
        setMessages([]);
      }
    } catch (error) {
      console.error('❌ Failed to load messages:', error);
      // Don't clear localStorage - conversation might still exist
      setMessages([]);
    }
  };
  
  useEffect(() => {
    if (conversationId && socketRef.current?.connected) {
      console.log('🔔 Subscribing to conversation:', conversationId);
      socketRef.current.emit('conversation:subscribe', conversationId);
    }
  }, [conversationId, isConnected]);
  
  // Initialize welcome message when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      console.log('✅ Adding welcome message');
      const welcomeMessage = {
        id: 'welcome',
        sender: 'operator',
        content: 'Welcome to Eliche Radice LB! How can we help you today?',
        timestamp: Date.now(),
        isSystem: true
      };
      setMessages([welcomeMessage]);
      console.log('✅ Welcome message added to state');
    }
  }, [isOpen, messages.length]);

  const addSystemMessage = (content: string) => {
    console.log('📨 Adding system message:', content);
    const systemMsg = {
      id: `system-${Date.now()}`,
      sender: 'operator',
      content,
      timestamp: Date.now(),
      isSystem: true
    };
    setMessages(prev => {
      console.log('📨 Previous messages:', prev.length);
      const newMessages = [...prev, systemMsg];
      console.log('📨 New messages:', newMessages.length);
      return newMessages;
    });
    // Scroll will be handled by MessageList component's auto-scroll
  };

  const createConversationWithInfo = async (name: string, phone: string) => {
    console.log('🔵 createConversationWithInfo called');
    console.log('🔵 Name:', name);
    console.log('🔵 Phone:', phone);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const cleanUrl = apiUrl.replace(/\/$/, '');
      const url = `${cleanUrl}/api/conversations`;
      
      console.log('🔵 Fetching:', url);
      
      const customerId = 'customer-' + Date.now();
      const requestBody = {
        customerId,
        customerName: name,
        customerPhone: phone,
        priority: 'normal'
      };
      
      console.log('🔵 Request body:', requestBody);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('🔵 Response status:', response.status);
      console.log('🔵 Response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', errorText);
        console.error('❌ Status:', response.status);
        throw new Error(`API returned ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ API Response:', data);
      
      if (data.data?.id) {
        const convId = data.data.id;
        console.log('✅✅✅ Setting conversation ID:', convId);
        
        // Set the conversation ID in state
        setConversationId(convId);
        console.log('✅ setConversationId called with:', convId);
        
        // Save to localStorage
        localStorage.setItem('eliche_conversation_id', convId);
        localStorage.setItem('eliche_customer_info', JSON.stringify({ name, phone }));
        console.log('✅ Saved to localStorage');
        
        // Subscribe to conversation
        if (socketRef.current?.connected) {
          console.log('📡 Subscribing to conversation via socket');
          socketRef.current.emit('conversation:subscribe', convId);
          console.log('✅ Subscription event emitted');
        } else {
          console.warn('⚠️ Socket not connected, cannot subscribe');
        }
        
        // Verify it was set (check after a brief delay)
        setTimeout(() => {
          console.log('🔍 Verifying conversation ID was set...');
          const storedId = localStorage.getItem('eliche_conversation_id');
          console.log('🔍 Stored ID:', storedId);
        }, 100);
        
        // Send email notification (non-blocking)
        sendAdminNotification(name, phone, convId).catch(err => {
          console.warn('⚠️ Email notification failed:', err);
        });
        
        // Return the ID so caller can verify
        console.log('✅✅✅ Returning conversation ID:', convId);
        return convId;
      } else {
        console.error('❌ No ID in response data:', data);
        throw new Error('No conversation ID in response');
      }
    } catch (error) {
      console.error('❌ createConversationWithInfo error:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  };

  const sendAdminNotification = async (name: string, phone: string, convId: string) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const cleanUrl = API_URL.replace(/\/$/, '');
      
      await fetch(`${cleanUrl}/api/notifications/new-customer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          customerPhone: phone,
          conversationId: convId
        })
      });
      console.log('✅ Admin notification sent');
    } catch (error) {
      console.error('⚠️ Failed to send admin notification:', error);
      // Don't show error to user - notification failure shouldn't block conversation
    }
  };
  
  const handleSendMessage = async (content: string) => {
    console.log('🔵 handleSendMessage called');
    console.log('🔵 Input content:', content);
    console.log('🔵 Collection step:', collectionStep);
    console.log('🔵 Conversation ID:', conversationId);
    console.log('🔵 Customer name:', customerName);
    console.log('🔵 Customer phone:', customerPhone);
    console.log('🔵 Is connected:', isConnected);
    
    if (!content.trim()) {
      console.log('❌ Empty input, returning');
      return;
    }

    const messageContent = content.trim();
    console.log('🔵 Message content (trimmed):', messageContent);
    console.log('🔵 Current step:', collectionStep);

    // Handle customer info collection flow
    if (collectionStep === 'idle') {
      console.log('✅ Step: idle → asking for name');
      addSystemMessage('Can we please have your name to serve you better?');
      setCollectionStep('collecting_name');
      console.log('✅ Step changed to: collecting_name');
      return;
    }

    if (collectionStep === 'collecting_name') {
      console.log('✅ Step: collecting_name → saving name and asking for phone');
      console.log('✅ Name received:', messageContent);
      setCustomerName(messageContent);
      addSystemMessage(`Thank you, ${messageContent}! And your phone number please?`);
      setCollectionStep('collecting_phone');
      console.log('✅ Step changed to: collecting_phone');
      console.log('✅ Customer name set to:', messageContent);
      return;
    }

    if (collectionStep === 'collecting_phone') {
      console.log('✅ Step: collecting_phone');
      
      if (isCreatingConversation) {
        console.log('⏳ Already creating conversation, ignoring');
        return;
      }
      
      console.log('✅ Phone received:', messageContent);
      console.log('✅ Customer name (from state):', customerName);
      
      setCustomerPhone(messageContent);
      setIsCreatingConversation(true);
      
      // Show loading message
      addSystemMessage('Thank you! Creating your conversation...');
      
      // Use setTimeout to allow state updates to process
      setTimeout(async () => {
        try {
          console.log('🔄 Creating conversation with info...');
          const convId = await createConversationWithInfo(customerName, messageContent);
          
          if (convId) {
            console.log('✅✅✅ SUCCESS! Conversation ID:', convId);
            console.log('✅✅✅ Verifying conversation ID in state...');
            
            // Double-check the ID was set
            setTimeout(() => {
              console.log('🔍 Final verification - conversationId state should be:', convId);
            }, 200);
            
            // Only change step AFTER conversation is created and ID is confirmed
            setCollectionStep('complete');
            setIsCreatingConversation(false);
            addSystemMessage('All set! How can we help you today?');
            console.log('✅✅✅ Step changed to: complete');
          } else {
            console.error('❌ No conversation ID returned');
            throw new Error('No conversation ID returned');
          }
        } catch (error) {
          console.error('❌ Failed:', error);
          setIsCreatingConversation(false);
          addSystemMessage('Sorry, there was an error. Please try again.');
          setCollectionStep('idle');
          console.log('🔄 Reset to idle step');
        }
      }, 100);
      
      return;
    }

    console.log('🔵 Normal message flow, conversationId:', conversationId);
    if (conversationId) {
      console.log('✅ Sending message to conversation:', conversationId);
      // Add message optimistically
      const tempMessage = {
        id: `temp-${Date.now()}`,
        conversationId,
        sender: 'customer',
        content: messageContent,
        timestamp: Date.now()
      };
      console.log('📤 Adding temp message to UI:', tempMessage);
      setMessages(prev => {
        const newMessages = [...prev, tempMessage];
        console.log('📤 Messages after adding temp:', newMessages.length);
        return newMessages;
      });
      
      // Send via Socket.io
      console.log('📡 Emitting message:new via socket');
      console.log('📡 Socket connected?', socketRef.current?.connected);
      console.log('📡 Socket exists?', !!socketRef.current);
      socketRef.current?.emit('message:new', {
        conversationId,
        content: messageContent,
      });
      console.log('✅ message:new event emitted');
    } else {
      console.error('❌ No conversation ID, cannot send message');
      console.error('❌ Collection step:', collectionStep);
      console.error('❌ Conversation ID state:', conversationId);
    }
  };
  
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-4 md:bottom-6 md:right-6 w-14 h-14 md:w-16 md:h-16 bg-gold-500 hover:bg-gold-400 rounded-full shadow-2xl flex items-center justify-center transition-all z-50"
        aria-label="Open chat"
      >
        <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
    );
  }
  
  return (
    <div className="fixed inset-x-2 bottom-4 md:bottom-6 md:right-6 md:inset-x-auto w-auto md:w-96 h-[90vh] bg-white rounded-lg shadow-2xl flex flex-col z-50">
      {/* Header */}
      <div className="bg-navy-900 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
        <div className="flex-1">
          <h3 className="font-semibold">Eliche Radice LB Support</h3>
          <p className="text-xs text-gray-300">
            {isConnected ? '● Online' : '○ Connecting...'}
          </p>
          {conversationStatus === 'resolved' && (
            <span className="inline-flex items-center text-xs bg-green-500 text-white px-2 py-1 rounded-full mt-1">
              ✓ Resolved
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {conversationId && (
            <button
              onClick={() => {
                if (confirm('Start a new conversation? Current conversation will be cleared.')) {
                  localStorage.removeItem('eliche_conversation_id');
                  localStorage.removeItem('eliche_customer_info');
                  setConversationId(null);
                  setCustomerName('');
                  setCustomerPhone('');
                  setCollectionStep('idle');
                  setMessages([]);
                  console.log('🗑️ Conversation cleared');
                }
              }}
              className="text-xs text-gray-300 hover:text-white transition-colors"
              aria-label="Start new conversation"
              title="Start new conversation"
            >
              New Conversation
            </button>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-gray-300 transition-colors"
            aria-label="Close chat"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Content */}
      <>
        <div className="flex-1 overflow-y-auto">
          <MessageList messages={messages} currentUser="customer" />
        </div>
        <div className="border-t border-gray-200">
          <MessageInput 
            onSend={handleSendMessage} 
            disabled={!isConnected || isCreatingConversation}
            placeholder={
              isCreatingConversation
                ? 'Creating conversation...'
                : collectionStep === 'collecting_name' 
                ? 'Enter your name...'
                : collectionStep === 'collecting_phone'
                ? 'Enter your phone number...'
                : 'Type your message...'
            }
          />
        </div>
      </>
    </div>
  );
}
