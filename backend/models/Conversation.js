const pool = require('../db/connection');

const Conversation = {
  create: async (customerId, priority = 'normal', customerName = null, customerPhone = null) => {
    const timestamp = Date.now();
    
    const query = `
      INSERT INTO conversations 
      (customer_id, status, priority, created_at, last_message_at, customer_name, customer_phone)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [
        customerId, 
        'active', 
        priority, 
        timestamp, 
        timestamp, 
        customerName, 
        customerPhone
      ]);
      
      const row = result.rows[0];
      
      return {
        id: row.id,
        customerId: row.customer_id,
        status: row.status,
        priority: row.priority,
        createdAt: row.created_at,
        lastMessageAt: row.last_message_at,
        assignedOperator: row.assigned_operator,
        customerName: row.customer_name,
        customerPhone: row.customer_phone
      };
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  },

  findById: async (id) => {
    const query = 'SELECT * FROM conversations WHERE id = $1';
    
    try {
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const row = result.rows[0];
      
      return {
        id: row.id,
        customerId: row.customer_id,
        status: row.status,
        priority: row.priority,
        createdAt: row.created_at,
        lastMessageAt: row.last_message_at,
        assignedOperator: row.assigned_operator,
        customerName: row.customer_name,
        customerPhone: row.customer_phone
      };
    } catch (error) {
      console.error('Error finding conversation:', error);
      throw error;
    }
  },

  findActive: async () => {
    const query = `
      SELECT * FROM conversations 
      WHERE status = $1 
      ORDER BY last_message_at DESC
    `;
    
    try {
      const result = await pool.query(query, ['active']);
      
      return result.rows.map(row => ({
        id: row.id,
        customerId: row.customer_id,
        status: row.status,
        priority: row.priority,
        createdAt: row.created_at,
        lastMessageAt: row.last_message_at,
        assignedOperator: row.assigned_operator,
        customerName: row.customer_name,
        customerPhone: row.customer_phone
      }));
    } catch (error) {
      console.error('Error finding active conversations:', error);
      throw error;
    }
  },

  findAllWithStatus: async () => {
    const query = `
      SELECT * FROM conversations
      ORDER BY 
        CASE status 
          WHEN 'active' THEN 1 
          WHEN 'waiting' THEN 2 
          WHEN 'resolved' THEN 3 
          ELSE 4
        END,
        last_message_at DESC
    `;
    
    try {
      const result = await pool.query(query);
      
      return result.rows.map(row => ({
        id: row.id,
        customerId: row.customer_id,
        status: row.status,
        priority: row.priority,
        createdAt: row.created_at,
        lastMessageAt: row.last_message_at,
        assignedOperator: row.assigned_operator,
        customerName: row.customer_name,
        customerPhone: row.customer_phone
      }));
    } catch (error) {
      console.error('Error finding all conversations with status:', error);
      throw error;
    }
  },

  updateStatus: async (id, status) => {
    const query = 'UPDATE conversations SET status = $1 WHERE id = $2 RETURNING *';
    
    try {
      const result = await pool.query(query, [status, id]);
      
      if (result.rows.length === 0) {
        throw new Error('Conversation not found');
      }
      
      const row = result.rows[0];
      
      return {
        id: row.id,
        customerId: row.customer_id,
        status: row.status,
        priority: row.priority,
        createdAt: row.created_at,
        lastMessageAt: row.last_message_at,
        assignedOperator: row.assigned_operator,
        customerName: row.customer_name,
        customerPhone: row.customer_phone
      };
    } catch (error) {
      console.error('Error updating conversation status:', error);
      throw error;
    }
  },

  updatePriority: async (id, priority) => {
    const query = 'UPDATE conversations SET priority = $1 WHERE id = $2 RETURNING *';
    
    try {
      const result = await pool.query(query, [priority, id]);
      
      if (result.rows.length === 0) {
        throw new Error('Conversation not found');
      }
      
      const row = result.rows[0];
      
      return {
        id: row.id,
        customerId: row.customer_id,
        status: row.status,
        priority: row.priority,
        createdAt: row.created_at,
        lastMessageAt: row.last_message_at,
        assignedOperator: row.assigned_operator,
        customerName: row.customer_name,
        customerPhone: row.customer_phone
      };
    } catch (error) {
      console.error('Error updating conversation priority:', error);
      throw error;
    }
  },

  updateLastMessageTime: async (id) => {
    const timestamp = Date.now();
    const query = 'UPDATE conversations SET last_message_at = $1 WHERE id = $2 RETURNING *';
    
    try {
      const result = await pool.query(query, [timestamp, id]);
      
      if (result.rows.length === 0) {
        throw new Error('Conversation not found');
      }
      
      const row = result.rows[0];
      
      return {
        id: row.id,
        customerId: row.customer_id,
        status: row.status,
        priority: row.priority,
        createdAt: row.created_at,
        lastMessageAt: row.last_message_at,
        assignedOperator: row.assigned_operator,
        customerName: row.customer_name,
        customerPhone: row.customer_phone
      };
    } catch (error) {
      console.error('Error updating last message time:', error);
      throw error;
    }
  },

  updateCustomerInfo: async (id, customerName, customerPhone) => {
    const query = 'UPDATE conversations SET customer_name = $1, customer_phone = $2 WHERE id = $3 RETURNING *';
    
    try {
      const result = await pool.query(query, [customerName, customerPhone, id]);
      
      if (result.rows.length === 0) {
        throw new Error('Conversation not found');
      }
      
      console.log(`✅ Updated customer info for conversation ${id}`);
      return {
        id: result.rows[0].id,
        customerName,
        customerPhone
      };
    } catch (error) {
      console.error('Error updating customer info:', error);
      throw error;
    }
  },

  expireOldConversations: async (hoursOld = 24) => {
    const millisecondsOld = hoursOld * 60 * 60 * 1000;
    const cutoffTime = Date.now() - millisecondsOld;
    
    try {
      // Find conversations that are active and older than threshold
      const findQuery = 'SELECT id FROM conversations WHERE status = $1 AND last_message_at < $2';
      const findResult = await pool.query(findQuery, ['active', cutoffTime]);
      
      if (findResult.rows.length === 0) {
        return 0;
      }
      
      // Update all found conversations to resolved status
      const ids = findResult.rows.map(row => row.id);
      const placeholders = ids.map((_, index) => `$${index + 1}`).join(',');
      const updateQuery = `UPDATE conversations SET status = 'resolved' WHERE id IN (${placeholders})`;
      
      const updateResult = await pool.query(updateQuery, ids);
      
      console.log(`⏰ Expired ${updateResult.rowCount} conversation(s) older than ${hoursOld} hours`);
      return updateResult.rowCount;
    } catch (error) {
      console.error('Error in Conversation.expireOldConversations:', error);
      throw error;
    }
  }
};

module.exports = Conversation;
