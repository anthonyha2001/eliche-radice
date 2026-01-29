const { randomUUID } = require('crypto');
const { getDatabase } = require('../db/connection');

/**
 * Message model - handles all database operations for messages
 */
class Message {
  /**
   * Create a new message
   * @param {string} conversationId - ID of the conversation
   * @param {string} sender - 'customer' or 'operator'
   * @param {string} content - Message content
   * @returns {Promise<Object>} Complete message object
   */
  static async create(conversationId, sender, content) {
    try {
      const db = await getDatabase();
      const id = randomUUID();
      const timestamp = Date.now();
      const read = 0;

      return new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO messages (id, conversation_id, sender, content, timestamp, read) VALUES (?, ?, ?, ?, ?, ?)',
          [id, conversationId, sender, content, timestamp, read],
          function(err) {
            if (err) {
              console.error('Failed to create message:', err.message);
              reject(err);
              return;
            }

            const message = {
              id,
              conversationId,
              sender,
              content,
              timestamp,
              read: read === 1,
            };

            resolve(message);
          }
        );
      });
    } catch (error) {
      console.error('Error in Message.create:', error);
      throw error;
    }
  }

  /**
   * Find all messages for a conversation, ordered by timestamp ASC
   * @param {string} conversationId - ID of the conversation
   * @returns {Promise<Array>} Array of message objects
   */
  static async findByConversationId(conversationId) {
    try {
      const db = await getDatabase();

      return new Promise((resolve, reject) => {
        db.all(
          'SELECT id, conversation_id, sender, content, timestamp, read FROM messages WHERE conversation_id = ? ORDER BY timestamp ASC',
          [conversationId],
          (err, rows) => {
            if (err) {
              console.error('Failed to find messages by conversation ID:', err.message);
              reject(err);
              return;
            }

            const messages = rows.map(row => ({
              id: row.id,
              conversationId: row.conversation_id,
              sender: row.sender,
              content: row.content,
              timestamp: row.timestamp,
              read: row.read === 1,
            }));

            resolve(messages);
          }
        );
      });
    } catch (error) {
      console.error('Error in Message.findByConversationId:', error);
      throw error;
    }
  }

  /**
   * Mark a message as read
   * @param {string} messageId - ID of the message
   * @returns {Promise<Object>} Updated message object
   */
  static async markAsRead(messageId) {
    try {
      const db = await getDatabase();

      return new Promise((resolve, reject) => {
        db.run(
          'UPDATE messages SET read = 1 WHERE id = ?',
          [messageId],
          function(err) {
            if (err) {
              console.error('Failed to mark message as read:', err.message);
              reject(err);
              return;
            }

            if (this.changes === 0) {
              reject(new Error('Message not found'));
              return;
            }

            // Fetch the updated message
            db.get(
              'SELECT id, conversation_id, sender, content, timestamp, read FROM messages WHERE id = ?',
              [messageId],
              (err, row) => {
                if (err) {
                  console.error('Failed to fetch updated message:', err.message);
                  reject(err);
                  return;
                }

                if (!row) {
                  reject(new Error('Message not found after update'));
                  return;
                }

                const message = {
                  id: row.id,
                  conversationId: row.conversation_id,
                  sender: row.sender,
                  content: row.content,
                  timestamp: row.timestamp,
                  read: row.read === 1,
                };

                resolve(message);
              }
            );
          }
        );
      });
    } catch (error) {
      console.error('Error in Message.markAsRead:', error);
      throw error;
    }
  }
}

module.exports = Message;
