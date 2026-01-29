const pool = require('../db/connection');

const Message = {
  create: async (conversationId, sender, content) => {
    const timestamp = Date.now();
    
    const query = `
      INSERT INTO messages (conversation_id, sender, content, timestamp, read)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [conversationId, sender, content, timestamp, false]);
      const row = result.rows[0];
      
      return {
        id: row.id,
        conversationId: row.conversation_id,
        sender: row.sender,
        content: row.content,
        timestamp: row.timestamp,
        read: row.read
      };
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  },

  findByConversationId: async (conversationId) => {
    const query = `
      SELECT * FROM messages 
      WHERE conversation_id = $1 
      ORDER BY timestamp ASC
    `;
    
    try {
      const result = await pool.query(query, [conversationId]);
      
      return result.rows.map(row => ({
        id: row.id,
        conversationId: row.conversation_id,
        sender: row.sender,
        content: row.content,
        timestamp: row.timestamp,
        read: row.read
      }));
    } catch (error) {
      console.error('Error finding messages:', error);
      throw error;
    }
  },

  markAsRead: async (id) => {
    const query = 'UPDATE messages SET read = $1 WHERE id = $2 RETURNING *';
    
    try {
      const result = await pool.query(query, [true, id]);
      
      if (result.rows.length === 0) {
        throw new Error('Message not found');
      }
      
      const row = result.rows[0];
      
      return {
        id: row.id,
        conversationId: row.conversation_id,
        sender: row.sender,
        content: row.content,
        timestamp: row.timestamp,
        read: row.read
      };
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  }
};

module.exports = Message;
