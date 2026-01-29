'use client';

import { io, Socket } from 'socket.io-client';
import { cleanUrl } from './utils';

// Remove trailing slash to prevent double slashes in URLs
const SOCKET_URL = cleanUrl(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001');

console.log('🔌 Socket configuration:');
console.log('   URL:', SOCKET_URL);
console.log('   Environment:', process.env.NODE_ENV);

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    console.log('🔌 Creating new Socket.io connection to:', SOCKET_URL);
    
    // Use polling only to avoid websocket issues (can enable websocket later if needed)
    socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['polling'], // Use polling only for now (more reliable)
      autoConnect: true,
      withCredentials: true,
      forceNew: false,
      timeout: 20000, // 20 second connection timeout
      upgrade: false, // Disable transport upgrade (stay on polling)
    });
    
    socket.on('connect', () => {
      console.log('✅ Socket connected successfully');
      console.log('   Socket ID:', socket?.id);
      console.log('   Transport:', socket?.io.engine.transport.name);
    });
    
    socket.on('disconnect', (reason) => {
      console.log('⚠️ Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        // Server disconnected, manually reconnect
        console.log('🔄 Attempting manual reconnection...');
        socket?.connect();
      }
    });
    
    socket.on('connect_error', (error: Error & { type?: string; description?: string }) => {
      console.error('❌ Socket connection error:', {
        message: error.message,
        description: error.description || error.toString(),
        type: error.type || 'unknown',
        transport: socket?.io?.engine?.transport?.name || 'unknown',
        url: SOCKET_URL
      });
      
      console.log('🔍 Troubleshooting:');
      console.log('   1. Is backend running? Check', `${SOCKET_URL}/health`);
      console.log('   2. Check NEXT_PUBLIC_SOCKET_URL is set correctly (current:', SOCKET_URL, ')');
      console.log('   3. Check backend CORS allows your origin');
      console.log('   4. Current transport:', socket?.io?.engine?.transport?.name || 'unknown');
      console.log('   5. Try opening', `${SOCKET_URL}/health`, 'in browser to verify backend is accessible');
    });
    
    socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`🔄 Reconnection attempt ${attemptNumber}/5...`);
    });
    
    socket.on('reconnect_failed', () => {
      console.error('❌ Failed to reconnect after 5 attempts');
      console.error('   Please check backend server and restart frontend');
    });
    
    socket.on('reconnect', (attemptNumber) => {
      console.log(`✅ Reconnected successfully after ${attemptNumber} attempts`);
    });
    
    // Keep-alive ping every 30 seconds
    setInterval(() => {
      if (socket?.connected) {
        socket.emit('ping');
      }
    }, 30000);
  }
  
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    console.log('🔌 Disconnecting socket...');
    socket.disconnect();
    socket = null;
  }
}
