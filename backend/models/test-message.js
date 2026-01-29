const Message = require('./Message');
const { getDatabase, closeDatabase } = require('../db/connection');
const { v4: uuidv4 } = require('uuid');

/**
 * Test Message model operations
 */
async function testMessageModel() {
  let testConversationId;
  let testMessageId;

  try {
    console.log('Testing Message model...\n');

    // Get database connection
    const db = await getDatabase();

    // Create a test conversation first (required for foreign key constraint)
    testConversationId = uuidv4();
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO conversations (id, customer_id, status, priority, created_at, last_message_at) VALUES (?, ?, ?, ?, ?, ?)',
        [testConversationId, 'test-customer-1', 'active', 'normal', Date.now(), Date.now()],
        (err) => {
          if (err) {
            reject(err);
          } else {
            console.log('✓ Test conversation created:', testConversationId);
            resolve();
          }
        }
      );
    });

    // Test 1: Create a message
    console.log('\n1. Testing Message.create()...');
    const newMessage = await Message.create(
      testConversationId,
      'customer',
      'Hello, I need help with my yacht maintenance.'
    );
    testMessageId = newMessage.id;
    console.log('✓ Message created:', {
      id: newMessage.id,
      conversationId: newMessage.conversationId,
      sender: newMessage.sender,
      content: newMessage.content.substring(0, 30) + '...',
      timestamp: newMessage.timestamp,
      read: newMessage.read,
    });

    // Test 2: Create another message
    console.log('\n2. Testing Message.create() - second message...');
    const secondMessage = await Message.create(
      testConversationId,
      'operator',
      'Hello! I\'d be happy to help you with your yacht maintenance.'
    );
    console.log('✓ Second message created:', {
      id: secondMessage.id,
      sender: secondMessage.sender,
      read: secondMessage.read,
    });

    // Test 3: Find messages by conversation ID
    console.log('\n3. Testing Message.findByConversationId()...');
    const messages = await Message.findByConversationId(testConversationId);
    console.log(`✓ Found ${messages.length} messages for conversation`);
    messages.forEach((msg, index) => {
      console.log(`   Message ${index + 1}: ${msg.sender} - "${msg.content.substring(0, 40)}..."`);
    });

    if (messages.length !== 2) {
      throw new Error(`Expected 2 messages, found ${messages.length}`);
    }

    // Verify messages are ordered by timestamp ASC
    const timestamps = messages.map(m => m.timestamp);
    const isOrdered = timestamps.every((val, i) => i === 0 || timestamps[i - 1] <= val);
    if (!isOrdered) {
      throw new Error('Messages are not ordered by timestamp ASC');
    }
    console.log('✓ Messages are ordered by timestamp ASC');

    // Test 4: Mark message as read
    console.log('\n4. Testing Message.markAsRead()...');
    const updatedMessage = await Message.markAsRead(testMessageId);
    console.log('✓ Message marked as read:', {
      id: updatedMessage.id,
      read: updatedMessage.read,
    });

    if (!updatedMessage.read) {
      throw new Error('Message was not marked as read');
    }

    // Verify the message is actually read in database
    const verifyMessages = await Message.findByConversationId(testConversationId);
    const readMessage = verifyMessages.find(m => m.id === testMessageId);
    if (!readMessage || !readMessage.read) {
      throw new Error('Message read status not persisted correctly');
    }
    console.log('✓ Message read status verified in database');

    // Test 5: Error handling - mark non-existent message
    console.log('\n5. Testing error handling...');
    try {
      await Message.markAsRead('non-existent-id');
      throw new Error('Should have thrown an error for non-existent message');
    } catch (error) {
      if (error.message === 'Message not found') {
        console.log('✓ Error handling works correctly for non-existent message');
      } else {
        throw error;
      }
    }

    console.log('\n✅ All Message model tests passed!');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    // Cleanup: Delete test data
    try {
      const db = await getDatabase();
      if (testConversationId) {
        await new Promise((resolve, reject) => {
          db.run('DELETE FROM conversations WHERE id = ?', [testConversationId], (err) => {
            if (err) {
              console.error('Failed to cleanup test conversation:', err);
            } else {
              console.log('\n✓ Test data cleaned up');
            }
            resolve();
          });
        });
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
    }

    await closeDatabase();
  }
}

// Run tests
testMessageModel();

