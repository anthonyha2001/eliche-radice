require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { ensureSchema } = require('./db/init');

// Load environment variables
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Create Express app
const app = express();

// Parse allowed origins from environment variable
const allowedOriginsString = process.env.FRONTEND_URL || 'http://localhost:3000';
const allowedOrigins = allowedOriginsString.split(',').map(url => url.trim()).filter(Boolean);

console.log('🔧 CORS configured for origins:', allowedOrigins);

// Express CORS - MUST be before routes
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, server-to-server)
    if (!origin) {
      return callback(null, true);
    }
    
    // Normalize origin (remove trailing slash)
    const normalizedOrigin = origin.replace(/\/$/, '');
    
    // Check if origin is in allowed list (exact match)
    const isAllowed = allowedOrigins.some(allowed => {
      const normalizedAllowed = allowed.replace(/\/$/, '');
      return normalizedOrigin === normalizedAllowed;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

// Body parser
app.use(express.json());

// Explicit CORS headers for all responses (backup)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  if (origin) {
    const normalizedOrigin = origin.replace(/\/$/, '');
    const isAllowed = allowedOrigins.some(allowed => {
      const normalizedAllowed = allowed.replace(/\/$/, '');
      return normalizedOrigin === normalizedAllowed;
    });
    
    if (isAllowed) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
  }
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// Health check endpoint (defined before Socket.IO, so no io reference)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    cors: allowedOrigins,
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime())
  });
});

// AI setting endpoints
app.get('/api/ai-setting', (req, res) => {
  const configPath = path.join(__dirname, 'ai-auto-response-enabled.json');

  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      res.json(config);
    } catch (error) {
      console.error('Failed to read AI config:', error);
      res.json({ enabled: false });
    }
  } else {
    res.json({ enabled: false });
  }
});

app.post('/api/ai-setting', (req, res) => {
  const { enabled } = req.body;
  const configPath = path.join(__dirname, 'ai-auto-response-enabled.json');

  const config = { enabled: enabled === true };

  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`🤖 AI auto-response ${config.enabled ? 'ENABLED ✅' : 'DISABLED ❌'}`);
    res.json(config);
  } catch (error) {
    console.error('Failed to write AI config:', error);
    res.status(500).json({ error: 'Failed to update AI setting' });
  }
});

// API routes
const conversationsRouter = require('./routes/conversations');
const messagesRouter = require('./routes/messages');
app.use('/api/conversations', conversationsRouter);
app.use('/api/messages', messagesRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: NODE_ENV === 'development' ? err.message : 'Internal server error',
  });
});

// Create HTTP server
// IMPORTANT: Socket.IO must be attached to this server instance
// Socket.IO will handle WebSocket upgrades automatically
const server = http.createServer(app);

// Initialize Socket.io with CORS configuration - MUST MATCH Express CORS
// Use array of origins directly (more reliable than function)
const io = new Server(server, {
  cors: {
    origin: allowedOrigins, // Use array directly - Socket.IO handles normalization
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  },
  transports: ['polling', 'websocket'], // Try polling first (more reliable), then websocket
  allowEIO3: true, // Compatibility
  path: '/socket.io/', // Default path (explicit for clarity)
  pingTimeout: 60000,
  pingInterval: 25000
});

// Make io available to routes
app.set('io', io);

// Update health endpoint to include Socket.IO stats (now that io is defined)
// Note: This overrides the earlier /health endpoint definition
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    cors: allowedOrigins,
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    socketIo: {
      connected: io.engine.clientsCount || 0,
      path: '/socket.io/'
    }
  });
});

console.log('🔌 Socket.io configured for origins:', allowedOrigins);
console.log('✅ Socket.io instance attached to HTTP server');
console.log('✅ Socket.io will handle WebSocket upgrades on /socket.io/');

// Socket.io error handling with detailed logging
io.engine.on('connection_error', (err) => {
  console.error('❌ Socket.io connection error:');
  console.error('   Code:', err.code);
  console.error('   Message:', err.message);
  console.error('   Description:', err.description);
  console.error('   Context:', err.context);
  console.error('   Type:', err.type);
  if (err.req) {
    console.error('   Request origin:', err.req.headers?.origin);
    console.error('   Request URL:', err.req.url);
    console.error('   Request method:', err.req.method);
    console.error('   Request headers:', JSON.stringify(err.req.headers, null, 2));
  }
  if (err.context) {
    console.error('   Error context:', JSON.stringify(err.context, null, 2));
  }
});

// Additional error handlers for WebSocket-specific errors
io.engine.on('upgrade_error', (err) => {
  console.error('❌ Socket.io upgrade error:');
  console.error('   Message:', err.message);
  console.error('   Stack:', err.stack);
});

io.engine.on('upgrade', (req) => {
  console.log('🔄 Socket.io upgrade successful:');
  console.log('   Origin:', req.headers.origin || '(no origin)');
  console.log('   Path:', req.url);
});

// Socket.io connection handler with detailed logging
io.on('connection', (socket) => {
  const origin = socket.handshake.headers.origin;
  const userAgent = socket.handshake.headers['user-agent'];
  
  console.log('✅ Socket.io client connected:');
  console.log('   Socket ID:', socket.id);
  console.log('   Origin:', origin || '(no origin)');
  console.log('   Transport:', socket.conn.transport.name);
  console.log('   IP:', socket.handshake.address);
  console.log('   User-Agent:', userAgent?.substring(0, 50) || '(unknown)');
  console.log('   Headers:', JSON.stringify(socket.handshake.headers, null, 2));
  
  // Track which conversations this socket is subscribed to
  socket.conversationRooms = new Set();
  
  socket.on('conversation:subscribe', (conversationId) => {
    if (!conversationId) {
      console.error('❌ No conversation ID provided');
      return;
    }
    
    const roomName = `conversation:${conversationId}`;
    socket.join(roomName);
    socket.conversationRooms.add(conversationId);
    
    console.log(`✅ Socket ${socket.id} joined ${roomName}`);
    console.log(`📋 Rooms for socket ${socket.id}:`, Array.from(socket.rooms));
  });
  
  socket.on('message:new', async (data) => {
    try {
      const { conversationId, content } = data;
      console.log(`📨 Customer message: "${content}" for conversation ${conversationId}`);
      
      if (!conversationId || !content) {
        socket.emit('message:error', { error: 'Missing conversationId or content' });
        return;
      }
      
      // Analyze priority
      const { analyzePriority } = require('./services/prioritizer');
      const { priority } = analyzePriority(content);
      
      // Save customer message
      const Message = require('./models/Message');
      const message = await Message.create(conversationId, 'customer', content);
      
      // Update conversation
      const Conversation = require('./models/Conversation');
      await Conversation.updateLastMessageTime(conversationId);
      if (priority !== 'normal') {
        await Conversation.updatePriority(conversationId, priority);
      }
      
      const responseData = {
        message: {
          ...message,
          timestamp: message.timestamp || Date.now()
        },
        priority
      };
      
      // Broadcast to ALL clients in this conversation room (including sender)
      const roomName = `conversation:${conversationId}`;
      console.log(`📤 Broadcasting customer message to room: ${roomName}`);
      io.to(roomName).emit('message:received', responseData);
      
      console.log(`✅ Customer message ${message.id} broadcast successfully`);

      // AI AUTO-RESPONSE (if enabled and not critical)
      const aiConfigPath = path.join(__dirname, 'ai-auto-response-enabled.json');
      let aiEnabled = false;

      if (fs.existsSync(aiConfigPath)) {
        try {
          const config = JSON.parse(fs.readFileSync(aiConfigPath, 'utf8'));
          aiEnabled = config.enabled === true;
        } catch (error) {
          console.error('Failed to read AI config:', error);
        }
      }

      if (aiEnabled && priority !== 'critical') {
        console.log('🤖 AI auto-response enabled, generating...');

        try {
          const messages = await Message.findByConversationId(conversationId);
          const { generateCustomerResponse } = require('./services/ai-assistant');
          const aiResponse = await generateCustomerResponse(messages, content);

          if (aiResponse) {
            // Wait 2 seconds (simulate typing)
            setTimeout(async () => {
              try {
                const aiMessage = await Message.create(conversationId, 'operator', aiResponse);
                await Conversation.updateLastMessageTime(conversationId);

                io.to(roomName).emit('message:received', {
                  message: {
                    ...aiMessage,
                    timestamp: aiMessage.timestamp || Date.now(),
                    isAI: true,
                  },
                });

                console.log(`🤖 AI responded: "${aiResponse.substring(0, 80)}..."`);
              } catch (error) {
                console.error('❌ Failed to send AI response:', error);
              }
            }, 2000);
          } else {
            console.log('🤖 AI did not return a response');
          }
        } catch (error) {
          console.error('❌ Error during AI auto-response:', error);
        }
      } else if (priority === 'critical') {
        console.log('🚨 CRITICAL - AI disabled, human response required');
      } else {
        console.log('🤖 AI auto-response disabled');
      }
    } catch (error) {
      console.error('❌ Error handling customer message:', error);
      socket.emit('message:error', { error: 'Failed to save message' });
    }
  });
  
  socket.on('message:operator', async (data) => {
    try {
      const { conversationId, content } = data;
      console.log(`👤 Operator message: "${content}" for conversation ${conversationId}`);
      
      if (!conversationId || !content) {
        socket.emit('message:error', { error: 'Missing conversationId or content' });
        return;
      }
      
      // Save message
      const Message = require('./models/Message');
      const message = await Message.create(conversationId, 'operator', content);
      
      // Update conversation
      const Conversation = require('./models/Conversation');
      await Conversation.updateLastMessageTime(conversationId);
      
      const responseData = {
        message: {
          ...message,
          timestamp: message.timestamp || Date.now()
        }
      };
      
      // Broadcast to ALL clients in this conversation room (including sender)
      const roomName = `conversation:${conversationId}`;
      console.log(`📤 Broadcasting operator message to room: ${roomName}`);
      io.to(roomName).emit('message:received', responseData);
      
      console.log(`✅ Message ${message.id} broadcast successfully`);
    } catch (error) {
      console.error('❌ Error handling operator message:', error);
      socket.emit('message:error', { error: 'Failed to send message' });
    }
  });
  
  // Typing indicator
  socket.on('operator:typing', (conversationId) => {
    try {
      if (!conversationId || typeof conversationId !== 'string') {
        return;
      }
      
      socket.to(`conversation:${conversationId}`).emit('operator:typing', true);
    } catch (error) {
      console.error('Error handling typing indicator:', error);
    }
  });
  
  // Stop typing indicator
  socket.on('operator:typing:stop', (conversationId) => {
    try {
      if (!conversationId || typeof conversationId !== 'string') {
        return;
      }
      
      socket.to(`conversation:${conversationId}`).emit('operator:typing', false);
    } catch (error) {
      console.error('Error handling typing stop:', error);
    }
  });
  
  socket.on('disconnect', (reason) => {
    console.log('🔌 Client disconnected:');
    console.log('   Socket ID:', socket.id);
    console.log('   Reason:', reason);
  });
});

// Start server - IMPORTANT: Only ONE listener on PORT
server.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📦 Environment: ${NODE_ENV}`);
  console.log(`🌐 CORS origins: ${allowedOrigins.join(', ')}`);
  console.log(`🔌 Socket.IO path: /socket.io/`);
  console.log(`🔌 Socket.IO transports: websocket, polling`);
  console.log(`✅ HTTP server listening on port ${PORT}`);
  console.log(`✅ Socket.IO server attached to HTTP server`);
  console.log(`✅ Health endpoint available at: http://localhost:${PORT}/health`);

  try {
    // Ensure PostgreSQL schema exists before background jobs
    // This will retry on connection errors (DB may start after app)
    await ensureSchema();
    console.log('✅ Database schema verified, starting background jobs...');
    
    // Start conversation expiration job (only after schema is confirmed)
    startConversationExpirationJob();
  } catch (error) {
    console.error('❌ CRITICAL: Failed to initialize database schema');
    console.error('   Error:', error.message);
    console.error('   Exiting with code 1 to trigger Railway restart...');
    // Exit with non-zero to trigger Railway restart
    process.exit(1);
  }
});

/**
 * Background job to expire conversations older than 24 hours
 * Runs every hour
 */
function startConversationExpirationJob() {
  const Conversation = require('./models/Conversation');
  
  // Delay initial run by 5 seconds to ensure schema is fully ready
  setTimeout(() => {
    Conversation.expireOldConversations(24).catch(err => {
      console.error('Error expiring conversations on startup:', err.message);
    });
  }, 5000);
  
  // Then run every hour (3600000 milliseconds)
  const EXPIRATION_INTERVAL = 60 * 60 * 1000; // 1 hour
  
  setInterval(() => {
    console.log('🕐 Running conversation expiration check...');
    Conversation.expireOldConversations(24)
      .then(count => {
        if (count > 0) {
          console.log(`✅ Expired ${count} conversation(s)`);
        }
      })
      .catch(err => {
        console.error('❌ Error expiring conversations:', err.message);
      });
  }, EXPIRATION_INTERVAL);
  
  console.log('⏰ Conversation expiration job started (runs every hour, initial run delayed 5s)');
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
