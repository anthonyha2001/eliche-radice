import { cleanUrl } from './utils';

// Normalize API URL - remove trailing slash to prevent double slashes
const API_URL = cleanUrl(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');

/**
 * Fetch with timeout
 */
async function fetchWithTimeout(url: string, options: RequestInit, timeout = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

/**
 * Get all active conversations
 */
export async function getConversations() {
  const response = await fetchWithTimeout(`${API_URL}/api/conversations`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch conversations');
  }
  
  return response.json();
}

/**
 * Get conversation by ID (includes messages)
 */
export async function getConversation(id: string) {
  const response = await fetchWithTimeout(`${API_URL}/api/conversations/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch conversation');
  }
  
  return response.json();
}

/**
 * Create a new conversation
 */
export async function createConversation(customerId: string, priority = 'normal') {
  const response = await fetchWithTimeout(`${API_URL}/api/conversations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customerId, priority }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create conversation');
  }
  
  return response.json();
}

/**
 * Send a message
 */
export async function sendMessage(conversationId: string, sender: string, content: string) {
  const response = await fetchWithTimeout(`${API_URL}/api/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ conversationId, sender, content }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to send message');
  }
  
  return response.json();
}

/**
 * Get messages for a conversation
 */
export async function getMessages(conversationId: string) {
  const response = await fetchWithTimeout(
    `${API_URL}/api/messages?conversationId=${conversationId}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }
  
  return response.json();
}

/**
 * Update conversation status
 */
export async function updateConversationStatus(id: string, status: string) {
  const response = await fetchWithTimeout(
    `${API_URL}/api/conversations/${id}/status`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to update status');
  }
  
  return response.json();
}

/**
 * Update conversation priority
 */
export async function updateConversationPriority(id: string, priority: string) {
  const response = await fetchWithTimeout(
    `${API_URL}/api/conversations/${id}/priority`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priority }),
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to update priority');
  }
  
  return response.json();
}

/**
 * Mark message as read
 */
export async function markMessageAsRead(messageId: string) {
  const response = await fetchWithTimeout(
    `${API_URL}/api/messages/${messageId}/read`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to mark message as read');
  }
  
  return response.json();
}

/**
 * Update customer information for a conversation
 */
export async function updateCustomerInfo(conversationId: string, customerName: string, customerPhone: string) {
  const response = await fetchWithTimeout(
    `${API_URL}/api/conversations/${conversationId}/customer-info`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerName, customerPhone }),
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to update customer info');
  }
  
  return response.json();
}

/**
 * Get AI suggestions for a conversation
 */
export async function getSuggestions(conversationId: string) {
  const response = await fetchWithTimeout(
    `${API_URL}/api/conversations/${conversationId}/suggestions`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch suggestions');
  }
  
  return response.json();
}

