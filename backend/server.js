require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Database initialization
const pool = require('./db/connection');

// Initialize database on startup
async function initializeDatabase() {
  try {
    console.log('🔄 Initializing PostgreSQL database...');
    
    const schemaPath = path.join(__dirname, 'db', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    await pool.query(schema);
    
    console.log('✅ Database tables created/verified');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
}

// Call initialization
initializeDatabase();

// Load environment variables
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Create Express app
const app = express();

// Configure CORS for frontend - CRITICAL FOR SOCKET.IO
const corsOptions = {
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

console.log('🔧 CORS configured for:', FRONTEND_URL);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
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
const server = http.createServer(app);

// Initialize Socket.io with CORS configuration - MUST MATCH CORS
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling'], // Try websocket first, fallback to polling
  allowEIO3: true // Compatibility
});

// Make io available to routes
app.set('io', io);

console.log('🔌 Socket.io configured for:', FRONTEND_URL);
console.log('✅ Socket.io instance attached to app');

// Socket.io error handling
io.engine.on('connection_error', (err) => {
  console.error('❌ Socket.io connection error:', {
    code: err.code,
    message: err.message,
    context: err.context
  });
});

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('✅ Socket.io client connected:', socket.id);
  console.log('   Transport:', socket.conn.transport.name);
  console.log('   IP:', socket.handshake.address);
  
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
  
  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
  console.log(`Frontend URL: ${FRONTEND_URL}`);
  
  // Start conversation expiration job
  startConversationExpirationJob();
});

/**
 * Background job to expire conversations older than 24 hours
 * Runs every hour
 */
function startConversationExpirationJob() {
  const Conversation = require('./models/Conversation');
  
  // Run immediately on startup
  Conversation.expireOldConversations(24).catch(err => {
    console.error('Error expiring conversations on startup:', err);
  });
  
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
        console.error('❌ Error expiring conversations:', err);
      });
  }, EXPIRATION_INTERVAL);
  
  console.log('⏰ Conversation expiration job started (runs every hour)');
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
