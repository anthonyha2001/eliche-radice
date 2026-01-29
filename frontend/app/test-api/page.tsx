'use client';

import { useState } from 'react';
import {
  getConversations,
  createConversation,
  getConversation,
  sendMessage,
  updateConversationStatus,
} from '@/lib/api';

export default function TestAPIPage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState('');

  const testGetConversations = async () => {
    setLoading(true);
    setResult('Testing...');
    try {
      const data = await getConversations();
      setResult(`✅ Got ${data.data?.length || 0} conversations`);
    } catch (error: any) {
      setResult(`❌ Error: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  const testCreateConversation = async () => {
    setLoading(true);
    setResult('Testing...');
    try {
      const data = await createConversation('test-customer-api', 'normal');
      const id = data.data?.id || 'unknown';
      setConversationId(id);
      setResult(`✅ Created conversation: ${id}`);
    } catch (error: any) {
      setResult(`❌ Error: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  const testGetConversation = async () => {
    if (!conversationId) {
      setResult('❌ Please create a conversation first');
      return;
    }
    setLoading(true);
    setResult('Testing...');
    try {
      const data = await getConversation(conversationId);
      const messagesCount = data.data?.messages?.length || 0;
      setResult(`✅ Got conversation with ${messagesCount} messages`);
    } catch (error: any) {
      setResult(`❌ Error: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  const testSendMessage = async () => {
    if (!conversationId) {
      setResult('❌ Please create a conversation first');
      return;
    }
    setLoading(true);
    setResult('Testing...');
    try {
      const data = await sendMessage(conversationId, 'customer', 'Test message from API');
      setResult(`✅ Message sent: ${data.data?.id || 'unknown'}`);
    } catch (error: any) {
      setResult(`❌ Error: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  const testUpdateStatus = async () => {
    if (!conversationId) {
      setResult('❌ Please create a conversation first');
      return;
    }
    setLoading(true);
    setResult('Testing...');
    try {
      const data = await updateConversationStatus(conversationId, 'resolved');
      setResult(`✅ Status updated to: ${data.data?.status || 'unknown'}`);
    } catch (error: any) {
      setResult(`❌ Error: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="card-luxury mb-6">
          <h1 className="text-2xl font-bold mb-4">API Client Test</h1>
          <p className="text-sm text-charcoal mb-6">
            Test the API utility functions. Make sure the backend server is running on port 3001.
          </p>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={testGetConversations}
                disabled={loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Get Conversations
              </button>
              <button
                onClick={testCreateConversation}
                disabled={loading}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Conversation
              </button>
              <button
                onClick={testGetConversation}
                disabled={loading || !conversationId}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Get Conversation
              </button>
              <button
                onClick={testSendMessage}
                disabled={loading || !conversationId}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Message
              </button>
              <button
                onClick={testUpdateStatus}
                disabled={loading || !conversationId}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Status
              </button>
            </div>

            <div className="mt-4 p-4 bg-gray-100 rounded-lg border border-gray-200">
              <p className="text-sm text-charcoal mb-2">Result:</p>
              <p className={`font-semibold ${result.includes('✅') ? 'text-green-600' : result.includes('❌') ? 'text-red-600' : 'text-charcoal'}`}>
                {result || 'Click a button to test'}
              </p>
              {conversationId && (
                <p className="text-xs text-charcoal mt-2">
                  Conversation ID: <span className="font-mono">{conversationId}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

