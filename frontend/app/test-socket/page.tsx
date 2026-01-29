'use client';

import { useEffect, useState } from 'react';
import { getSocket } from '@/lib/socket';

export default function TestSocketPage() {
  const [status, setStatus] = useState('Connecting...');
  const [socketId, setSocketId] = useState('');
  
  useEffect(() => {
    const socket = getSocket();
    
    socket.on('connect', () => {
      setStatus('✅ Connected');
      setSocketId(socket.id || '');
    });
    
    socket.on('disconnect', () => {
      setStatus('❌ Disconnected');
      setSocketId('');
    });
    
    socket.on('connect_error', () => {
      setStatus('❌ Connection Error');
    });
    
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
    };
  }, []);
  
  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-2xl mx-auto">
        <div className="card-luxury">
          <h1 className="text-2xl font-bold mb-4">Socket.io Connection Test</h1>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-charcoal mb-1">Status:</p>
              <p className="text-lg font-semibold">{status}</p>
            </div>
            {socketId && (
              <div>
                <p className="text-sm text-charcoal mb-1">Socket ID:</p>
                <p className="text-sm font-mono bg-gray-200 p-2 rounded">{socketId}</p>
              </div>
            )}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-charcoal">
                This page tests the Socket.io client connection. 
                Check the browser console for connection logs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

