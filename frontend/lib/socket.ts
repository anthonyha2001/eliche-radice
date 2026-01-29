'use client';

import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

console.log('🔌 Socket configuration:');
console.log('   URL:', SOCKET_URL);
console.log('   Environment:', process.env.NODE_ENV);

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    console.log('🔌 Creating new Socket.io connection to:', SOCKET_URL);
    
    socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling'], // Try websocket first
      autoConnect: true,
      withCredentials: true,
      forceNew: false,
      timeout: 10000, // 10 second connection timeout
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
    
    socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', {
        message: error.message,
        description: error.toString(),
        stack: error.stack
      });
      console.log('🔍 Troubleshooting:');
      console.log('   1. Is backend running? Check http://localhost:3001/health');
      console.log('   2. Check .env.local has NEXT_PUBLIC_SOCKET_URL=http://localhost:3001');
      console.log('   3. Check backend CORS allows http://localhost:3000');
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
