const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { generateSuggestions } = require('../services/ai-assistant');

// Valid status values
const VALID_STATUSES = ['active', 'resolved', 'waiting'];

// Valid priority values
const VALID_PRIORITIES = ['critical', 'high', 'normal'];

/**
 * GET /conversations
 * Get all active conversations, sorted by lastMessageAt DESC
 */
router.get('/', async (req, res) => {
  try {
    const conversations = await Conversation.findActive();
    res.status(200).json({ data: conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

/**
 * GET /conversations/all
 * Get all conversations (active, waiting, resolved)
 */
router.get('/all', async (req, res) => {
  try {
    const conversations = await Conversation.findAllWithStatus();
    res.status(200).json({ data: conversations });
  } catch (error) {
    console.error('Error fetching all conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

/**
 * GET /conversations/:id
 * Get conversation by ID, including messages
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Conversation ID is required' });
    }

    const conversation = await Conversation.findById(id);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Fetch messages for this conversation
    const messages = await Message.findByConversationId(id);

    res.status(200).json({
      data: {
        ...conversation,
        messages,
      },
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
});

/**
 * POST /conversations
 * Create a new conversation
 */
router.post('/', async (req, res) => {
  try {
    const { customerId, priority, customerName, customerPhone } = req.body;

    console.log('📨 Creating conversation:', { customerId, customerName, customerPhone, priority });

    if (!customerId || typeof customerId !== 'string' || customerId.trim().length === 0) {
      console.error('❌ Customer ID required');
      return res.status(400).json({ error: 'Customer ID required' });
    }

    // Validate priority if provided
    if (priority && !VALID_PRIORITIES.includes(priority)) {
      console.error('❌ Invalid priority:', priority);
      return res.status(400).json({
        error: `Invalid priority. Must be one of: ${VALID_PRIORITIES.join(', ')}`,
      });
    }

    console.log('🔄 Calling Conversation.create...');
    const conversation = await Conversation.create(
      customerId.trim(),
      priority || 'normal',
      customerName || null,
      customerPhone || null
    );

    console.log('✅ Conversation created:', conversation.id);
    console.log('✅ Conversation data:', {
      id: conversation.id,
      customerId: conversation.customerId,
      customerName: conversation.customerName,
      customerPhone: conversation.customerPhone,
      priority: conversation.priority
    });

    // Broadcast to ALL operators via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.emit('conversation:new', {
        conversationId: conversation.id,
        customerId: conversation.customerId,
        customerName: conversation.customerName,
        customerPhone: conversation.customerPhone,
        priority: conversation.priority,
      });
      console.log('📢 Broadcast conversation:new event to all operators');
    } else {
      console.warn('⚠️ Socket.io not available, cannot broadcast');
    }

    res.status(201).json({ data: conversation });
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

/**
 * PATCH /conversations/:id/status
 * Update conversation status
 */
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const result = await Conversation.updateStatus(id, status);

    // If marking as resolved, send auto-message to customer
    if (status === 'resolved') {
      const resolvedMessage = await Message.create(
        id,
        'operator',
        'Thank you for contacting Eliche Radice LB. Your request has been resolved. If you need further assistance, please feel free to reach out again.'
      );

      // Broadcast resolved message and status via Socket.io
      const io = req.app.get('io');
      if (io) {
        const roomName = `conversation:${id}`;

        io.to(roomName).emit('message:received', {
          message: resolvedMessage,
        });

        io.to(roomName).emit('conversation:status', {
          conversationId: id,
          status: 'resolved',
        });
      } else {
        console.warn('⚠️ Socket.io instance not found on app when updating status');
      }

      console.log(`✅ Conversation ${id} marked as resolved, customer notified`);
    }

    res.status(200).json({ data: result });
  } catch (error) {
    console.error('Error updating conversation status:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

/**
 * PATCH /conversations/:id/priority
 * Update conversation priority
 */
router.patch('/:id/priority', async (req, res) => {
  try {
    const { id } = req.params;
    const { priority } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Conversation ID is required' });
    }

    if (!priority || typeof priority !== 'string') {
      return res.status(400).json({ error: 'priority is required and must be a string' });
    }

    if (!VALID_PRIORITIES.includes(priority)) {
      return res.status(400).json({
        error: `Invalid priority. Must be one of: ${VALID_PRIORITIES.join(', ')}`,
      });
    }

    // Check if conversation exists
    const existingConversation = await Conversation.findById(id);
    if (!existingConversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Update priority
    const updatedConversation = await Conversation.updatePriority(id, priority);

    res.status(200).json({ data: updatedConversation });
  } catch (error) {
    if (error.message === 'Conversation not found') {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    console.error('Error updating conversation priority:', error);
    res.status(500).json({ error: 'Failed to update conversation priority' });
  }
});

/**
 * PATCH /conversations/:id/customer-info
 * Update customer information for a conversation
 */
router.patch('/:id/customer-info', async (req, res) => {
  try {
    const { id } = req.params;
    const { customerName, customerPhone } = req.body;
    
    if (!customerName || !customerPhone) {
      return res.status(400).json({ error: 'Name and phone required' });
    }
    
    const result = await Conversation.updateCustomerInfo(id, customerName, customerPhone);
    
    res.status(200).json({ data: result });
  } catch (error) {
    console.error('Error updating customer info:', error);
    res.status(500).json({ error: 'Failed to update customer info' });
  }
});

/**
 * GET /conversations/:id/suggestions
 * Generate AI response suggestions for a conversation
 */
router.get('/:id/suggestions', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Conversation ID is required' });
    }

    // Check if conversation exists
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Get the last message from the conversation
    const messages = await Message.findByConversationId(id);
    
    if (messages.length === 0) {
      return res.status(200).json({ data: [] });
    }

    // Get the last customer message
    const lastCustomerMessage = messages
      .filter(msg => msg.sender === 'customer')
      .pop();

    if (!lastCustomerMessage) {
      return res.status(200).json({ data: [] });
    }

    // Generate suggestions
    console.log(`🤖 Generating AI suggestions for conversation ${id}`);
    const suggestions = await generateSuggestions(messages, lastCustomerMessage.content);

    // Format suggestions for frontend
    const formattedSuggestions = suggestions.map((content, index) => ({
      id: `suggestion-${index}`,
      content: content,
    }));

    console.log(`✅ Generated ${formattedSuggestions.length} suggestions`);
    
    res.status(200).json({ data: formattedSuggestions });
  } catch (error) {
    console.error('Error generating suggestions:', error);
    res.status(500).json({ error: 'Failed to generate suggestions' });
  }
});

module.exports = router;
