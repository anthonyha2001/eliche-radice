const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

// Valid sender values
const VALID_SENDERS = ['customer', 'operator'];

/**
 * POST /messages
 * Create a new message
 */
router.post('/', async (req, res) => {
  try {
    const { conversationId, sender, content } = req.body;

    // Validate conversationId
    if (!conversationId || typeof conversationId !== 'string' || conversationId.trim().length === 0) {
      return res.status(400).json({ error: 'conversationId is required and must be a non-empty string' });
    }

    // Validate sender
    if (!sender || typeof sender !== 'string') {
      return res.status(400).json({ error: 'sender is required and must be a string' });
    }

    if (!VALID_SENDERS.includes(sender)) {
      return res.status(400).json({
        error: `Invalid sender. Must be one of: ${VALID_SENDERS.join(', ')}`,
      });
    }

    // Validate content
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return res.status(400).json({ error: 'content is required and must be a non-empty string' });
    }

    // Check if conversation exists
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Create message
    const message = await Message.create(
      conversationId.trim(),
      sender,
      content.trim()
    );

    // Update conversation's lastMessageAt
    await Conversation.updateLastMessageTime(conversationId);

    res.status(201).json({ data: message });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Failed to create message' });
  }
});

/**
 * GET /messages?conversationId=:id
 * Get all messages for a conversation
 */
router.get('/', async (req, res) => {
  try {
    const { conversationId } = req.query;

    if (!conversationId || typeof conversationId !== 'string' || conversationId.trim().length === 0) {
      return res.status(400).json({ error: 'conversationId query parameter is required' });
    }

    // Check if conversation exists
    const conversation = await Conversation.findById(conversationId.trim());
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Fetch messages
    const messages = await Message.findByConversationId(conversationId.trim());

    res.status(200).json({ data: messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

/**
 * PATCH /messages/:id/read
 * Mark a message as read
 */
router.patch('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Message ID is required' });
    }

    // Update message
    const message = await Message.markAsRead(id);

    res.status(200).json({ data: message });
  } catch (error) {
    if (error.message === 'Message not found') {
      return res.status(404).json({ error: 'Message not found' });
    }
    console.error('Error marking message as read:', error);
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
});

module.exports = router;
