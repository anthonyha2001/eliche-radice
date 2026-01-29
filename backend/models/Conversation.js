const { v4: uuidv4 } = require('uuid');
const { getDatabase } = require('../db/connection');

/**
 * Conversation model - handles all database operations for conversations
 */
const Conversation = {
  /**
   * Create a new conversation
   * @param {string} customerId - ID of the customer
   * @param {string} priority - Priority level (default: 'normal')
   * @param {string} customerName - Customer name (optional)
   * @param {string} customerPhone - Customer phone (optional)
   * @returns {Promise<Object>} Complete conversation object
   */
  create: async (customerId, priority = 'normal', customerName = null, customerPhone = null) => {
    try {
      const db = await getDatabase();
      const id = uuidv4();
      const timestamp = Date.now();
      const status = 'active';

      return new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO conversations (id, customer_id, status, priority, created_at, last_message_at, customer_name, customer_phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [id, customerId, status, priority, timestamp, timestamp, customerName, customerPhone],
          function(err) {
            if (err) {
              console.error('Failed to create conversation:', err.message);
              reject(err);
              return;
            }

            const conversation = {
              id,
              customerId,
              status,
              priority,
              createdAt: timestamp,
              lastMessageAt: timestamp,
              customerName: customerName || undefined,
              customerPhone: customerPhone || undefined,
            };

            resolve(conversation);
          }
        );
      });
    } catch (error) {
      console.error('Error in Conversation.create:', error);
      throw error;
    }
  },

  /**
   * Find conversation by ID
   * @param {string} id - Conversation ID
   * @returns {Promise<Object|null>} Conversation object or null if not found
   */
  findById: async (id) => {
    try {
      const db = await getDatabase();

      return new Promise((resolve, reject) => {
        db.get(
          'SELECT id, customer_id, status, priority, created_at, last_message_at, assigned_operator, customer_name, customer_phone FROM conversations WHERE id = ?',
          [id],
          (err, row) => {
            if (err) {
              console.error('Failed to find conversation by ID:', err.message);
              reject(err);
              return;
            }

            if (!row) {
              resolve(null);
              return;
            }

            const conversation = {
              id: row.id,
              customerId: row.customer_id,
              status: row.status,
              priority: row.priority,
              createdAt: row.created_at,
              lastMessageAt: row.last_message_at,
              assignedOperator: row.assigned_operator || undefined,
              customerName: row.customer_name || undefined,
              customerPhone: row.customer_phone || undefined,
            };

            resolve(conversation);
          }
        );
      });
    } catch (error) {
      console.error('Error in Conversation.findById:', error);
      throw error;
    }
  },

  /**
   * Find all active conversations, ordered by last_message_at DESC
   * @returns {Promise<Array>} Array of conversation objects
   */
  findActive: async () => {
    try {
      const db = await getDatabase();

      return new Promise((resolve, reject) => {
        db.all(
          'SELECT id, customer_id, status, priority, created_at, last_message_at, assigned_operator, customer_name, customer_phone FROM conversations WHERE status = ? ORDER BY last_message_at DESC',
          ['active'],
          (err, rows) => {
            if (err) {
              console.error('Failed to find active conversations:', err.message);
              reject(err);
              return;
            }

            const conversations = rows.map(row => ({
              id: row.id,
              customerId: row.customer_id,
              status: row.status,
              priority: row.priority,
              createdAt: row.created_at,
              lastMessageAt: row.last_message_at,
              assignedOperator: row.assigned_operator || undefined,
              customerName: row.customer_name || undefined,
              customerPhone: row.customer_phone || undefined,
            }));

            resolve(conversations);
          }
        );
      });
    } catch (error) {
      console.error('Error in Conversation.findActive:', error);
      throw error;
    }
  },

  /**
   * Find all conversations (active, waiting, resolved),
   * ordered by status (active, waiting, resolved) then last_message_at DESC
   * @returns {Promise<Array>} Array of conversation objects
   */
  findAllWithStatus: async () => {
    try {
      const db = await getDatabase();

      return new Promise((resolve, reject) => {
        db.all(
          `SELECT id, customer_id, status, priority, created_at, last_message_at, assigned_operator, customer_name, customer_phone
           FROM conversations
           ORDER BY 
             CASE status 
               WHEN 'active' THEN 1 
               WHEN 'waiting' THEN 2 
               WHEN 'resolved' THEN 3 
               ELSE 4
             END,
             last_message_at DESC`,
          [],
          (err, rows) => {
            if (err) {
              console.error('Failed to find all conversations with status:', err.message);
              reject(err);
              return;
            }

            const conversations = rows.map(row => ({
              id: row.id,
              customerId: row.customer_id,
              status: row.status,
              priority: row.priority,
              createdAt: row.created_at,
              lastMessageAt: row.last_message_at,
              assignedOperator: row.assigned_operator || undefined,
              customerName: row.customer_name || undefined,
              customerPhone: row.customer_phone || undefined,
            }));

            resolve(conversations);
          }
        );
      });
    } catch (error) {
      console.error('Error in Conversation.findAllWithStatus:', error);
      throw error;
    }
  },

  /**
   * Update conversation status
   * @param {string} id - Conversation ID
   * @param {string} status - New status ('active', 'resolved', 'waiting')
   * @returns {Promise<Object>} Updated conversation object
   */
  updateStatus: async (id, status) => {
    try {
      const db = await getDatabase();

      return new Promise((resolve, reject) => {
        db.run(
          'UPDATE conversations SET status = ? WHERE id = ?',
          [status, id],
          function(err) {
            if (err) {
              console.error('Failed to update conversation status:', err.message);
              reject(err);
              return;
            }

            if (this.changes === 0) {
              reject(new Error('Conversation not found'));
              return;
            }

            // Fetch the updated conversation
            db.get(
              'SELECT id, customer_id, status, priority, created_at, last_message_at, assigned_operator, customer_name, customer_phone FROM conversations WHERE id = ?',
              [id],
              (err, row) => {
                if (err) {
                  console.error('Failed to fetch updated conversation:', err.message);
                  reject(err);
                  return;
                }

                if (!row) {
                  reject(new Error('Conversation not found after update'));
                  return;
                }

                const conversation = {
                  id: row.id,
                  customerId: row.customer_id,
                  status: row.status,
                  priority: row.priority,
                  createdAt: row.created_at,
                  lastMessageAt: row.last_message_at,
                  assignedOperator: row.assigned_operator || undefined,
                  customerName: row.customer_name || undefined,
                  customerPhone: row.customer_phone || undefined,
                };

                resolve(conversation);
              }
            );
          }
        );
      });
    } catch (error) {
      console.error('Error in Conversation.updateStatus:', error);
      throw error;
    }
  },

  /**
   * Update conversation priority
   * @param {string} id - Conversation ID
   * @param {string} priority - New priority ('critical', 'high', 'normal')
   * @returns {Promise<Object>} Updated conversation object
   */
  updatePriority: async (id, priority) => {
    try {
      const db = await getDatabase();

      return new Promise((resolve, reject) => {
        db.run(
          'UPDATE conversations SET priority = ? WHERE id = ?',
          [priority, id],
          function(err) {
            if (err) {
              console.error('Failed to update conversation priority:', err.message);
              reject(err);
              return;
            }

            if (this.changes === 0) {
              reject(new Error('Conversation not found'));
              return;
            }

            // Fetch the updated conversation
            db.get(
              'SELECT id, customer_id, status, priority, created_at, last_message_at, assigned_operator, customer_name, customer_phone FROM conversations WHERE id = ?',
              [id],
              (err, row) => {
                if (err) {
                  console.error('Failed to fetch updated conversation:', err.message);
                  reject(err);
                  return;
                }

                if (!row) {
                  reject(new Error('Conversation not found after update'));
                  return;
                }

                const conversation = {
                  id: row.id,
                  customerId: row.customer_id,
                  status: row.status,
                  priority: row.priority,
                  createdAt: row.created_at,
                  lastMessageAt: row.last_message_at,
                  assignedOperator: row.assigned_operator || undefined,
                  customerName: row.customer_name || undefined,
                  customerPhone: row.customer_phone || undefined,
                };

                resolve(conversation);
              }
            );
          }
        );
      });
    } catch (error) {
      console.error('Error in Conversation.updatePriority:', error);
      throw error;
    }
  },

  /**
   * Update last message timestamp
   * @param {string} id - Conversation ID
   * @returns {Promise<Object>} Updated conversation object
   */
  updateLastMessageTime: async (id) => {
    try {
      const db = await getDatabase();
      const timestamp = Date.now();

      return new Promise((resolve, reject) => {
        db.run(
          'UPDATE conversations SET last_message_at = ? WHERE id = ?',
          [timestamp, id],
          function(err) {
            if (err) {
              console.error('Failed to update last message time:', err.message);
              reject(err);
              return;
            }

            if (this.changes === 0) {
              reject(new Error('Conversation not found'));
              return;
            }

            // Fetch the updated conversation
            db.get(
              'SELECT id, customer_id, status, priority, created_at, last_message_at, assigned_operator, customer_name, customer_phone FROM conversations WHERE id = ?',
              [id],
              (err, row) => {
                if (err) {
                  console.error('Failed to fetch updated conversation:', err.message);
                  reject(err);
                  return;
                }

                if (!row) {
                  reject(new Error('Conversation not found after update'));
                  return;
                }

                const conversation = {
                  id: row.id,
                  customerId: row.customer_id,
                  status: row.status,
                  priority: row.priority,
                  createdAt: row.created_at,
                  lastMessageAt: row.last_message_at,
                  assignedOperator: row.assigned_operator || undefined,
                  customerName: row.customer_name || undefined,
                  customerPhone: row.customer_phone || undefined,
                };

                resolve(conversation);
              }
            );
          }
        );
      });
    } catch (error) {
      console.error('Error in Conversation.updateLastMessageTime:', error);
      throw error;
    }
  },

  /**
   * Update customer information for a conversation
   * @param {string} id - Conversation ID
   * @param {string} customerName - Customer name
   * @param {string} customerPhone - Customer phone
   * @returns {Promise<Object>} Updated conversation object
   */
  updateCustomerInfo: async (id, customerName, customerPhone) => {
    try {
      const db = await getDatabase();

      return new Promise((resolve, reject) => {
        db.run(
          'UPDATE conversations SET customer_name = ?, customer_phone = ? WHERE id = ?',
          [customerName, customerPhone, id],
          function(err) {
            if (err) {
              console.error('Failed to update customer info:', err.message);
              reject(err);
              return;
            }

            if (this.changes === 0) {
              reject(new Error('Conversation not found'));
              return;
            }

            console.log(`✅ Updated customer info for conversation ${id}`);
            resolve({
              id,
              customerName,
              customerPhone,
            });
          }
        );
      });
    } catch (error) {
      console.error('Error in Conversation.updateCustomerInfo:', error);
      throw error;
    }
  },

  /**
   * Expire conversations older than 24 hours (based on last_message_at)
   * @param {number} hoursOld - Hours threshold (default: 24)
   * @returns {Promise<number>} Number of conversations expired
   */
  expireOldConversations: async (hoursOld = 24) => {
    try {
      const db = await getDatabase();
      const millisecondsOld = hoursOld * 60 * 60 * 1000;
      const cutoffTime = Date.now() - millisecondsOld;

      return new Promise((resolve, reject) => {
        // Find conversations that are active and older than threshold
        db.all(
          'SELECT id FROM conversations WHERE status = ? AND last_message_at < ?',
          ['active', cutoffTime],
          (err, rows) => {
            if (err) {
              console.error('Failed to find old conversations:', err.message);
              reject(err);
              return;
            }

            if (rows.length === 0) {
              resolve(0);
              return;
            }

            // Update all found conversations to resolved status
            const ids = rows.map(row => row.id);
            const placeholders = ids.map(() => '?').join(',');
            
            db.run(
              `UPDATE conversations SET status = 'resolved' WHERE id IN (${placeholders})`,
              ids,
              function(updateErr) {
                if (updateErr) {
                  console.error('Failed to expire conversations:', updateErr.message);
                  reject(updateErr);
                  return;
                }

                console.log(`⏰ Expired ${this.changes} conversation(s) older than ${hoursOld} hours`);
                resolve(this.changes);
              }
            );
          }
        );
      });
    } catch (error) {
      console.error('Error in Conversation.expireOldConversations:', error);
      throw error;
    }
  }
};

module.exports = Conversation;
