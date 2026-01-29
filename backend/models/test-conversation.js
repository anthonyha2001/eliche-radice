const Conversation = require('./Conversation');
const { getDatabase, closeDatabase } = require('../db/connection');

/**
 * Test Conversation model operations
 */
async function testConversationModel() {
  let testConversationId1;
  let testConversationId2;

  try {
    console.log('Testing Conversation model...\n');

    // Test 1: Create a conversation with default priority
    console.log('1. Testing Conversation.create() with default priority...');
    const newConversation1 = await Conversation.create('customer-123');
    testConversationId1 = newConversation1.id;
    console.log('✓ Conversation created:', {
      id: newConversation1.id,
      customerId: newConversation1.customerId,
      status: newConversation1.status,
      priority: newConversation1.priority,
      createdAt: newConversation1.createdAt,
      lastMessageAt: newConversation1.lastMessageAt,
    });

    if (newConversation1.status !== 'active') {
      throw new Error(`Expected status 'active', got '${newConversation1.status}'`);
    }
    if (newConversation1.priority !== 'normal') {
      throw new Error(`Expected priority 'normal', got '${newConversation1.priority}'`);
    }

    // Test 2: Create a conversation with custom priority
    console.log('\n2. Testing Conversation.create() with custom priority...');
    const newConversation2 = await Conversation.create('customer-456', 'critical');
    testConversationId2 = newConversation2.id;
    console.log('✓ Conversation created with critical priority:', {
      id: newConversation2.id,
      priority: newConversation2.priority,
    });

    if (newConversation2.priority !== 'critical') {
      throw new Error(`Expected priority 'critical', got '${newConversation2.priority}'`);
    }

    // Test 3: Find conversation by ID
    console.log('\n3. Testing Conversation.findById()...');
    const foundConversation = await Conversation.findById(testConversationId1);
    console.log('✓ Conversation found:', {
      id: foundConversation.id,
      customerId: foundConversation.customerId,
      status: foundConversation.status,
    });

    if (!foundConversation) {
      throw new Error('Conversation not found');
    }
    if (foundConversation.id !== testConversationId1) {
      throw new Error('Wrong conversation returned');
    }

    // Test 4: Find non-existent conversation
    console.log('\n4. Testing Conversation.findById() with non-existent ID...');
    const notFound = await Conversation.findById('non-existent-id');
    if (notFound !== null) {
      throw new Error('Expected null for non-existent conversation');
    }
    console.log('✓ Correctly returned null for non-existent conversation');

    // Test 5: Find active conversations
    console.log('\n5. Testing Conversation.findActive()...');
    const activeConversations = await Conversation.findActive();
    console.log(`✓ Found ${activeConversations.length} active conversations`);

    if (activeConversations.length < 2) {
      throw new Error(`Expected at least 2 active conversations, found ${activeConversations.length}`);
    }

    // Verify all are active
    const allActive = activeConversations.every(conv => conv.status === 'active');
    if (!allActive) {
      throw new Error('Not all returned conversations are active');
    }
    console.log('✓ All returned conversations have status "active"');

    // Verify ordering by last_message_at DESC
    const timestamps = activeConversations.map(c => c.lastMessageAt);
    const isOrderedDesc = timestamps.every((val, i) => i === 0 || timestamps[i - 1] >= val);
    if (!isOrderedDesc) {
      throw new Error('Conversations are not ordered by last_message_at DESC');
    }
    console.log('✓ Conversations are ordered by last_message_at DESC');

    // Test 6: Update conversation status
    console.log('\n6. Testing Conversation.updateStatus()...');
    const updatedStatus = await Conversation.updateStatus(testConversationId1, 'resolved');
    console.log('✓ Conversation status updated:', {
      id: updatedStatus.id,
      status: updatedStatus.status,
    });

    if (updatedStatus.status !== 'resolved') {
      throw new Error(`Expected status 'resolved', got '${updatedStatus.status}'`);
    }

    // Verify it's no longer in active list
    const activeAfterUpdate = await Conversation.findActive();
    const stillActive = activeAfterUpdate.find(c => c.id === testConversationId1);
    if (stillActive) {
      throw new Error('Conversation should not be in active list after status update');
    }
    console.log('✓ Conversation removed from active list after status update');

    // Test 7: Update conversation priority
    console.log('\n7. Testing Conversation.updatePriority()...');
    const updatedPriority = await Conversation.updatePriority(testConversationId2, 'high');
    console.log('✓ Conversation priority updated:', {
      id: updatedPriority.id,
      priority: updatedPriority.priority,
    });

    if (updatedPriority.priority !== 'high') {
      throw new Error(`Expected priority 'high', got '${updatedPriority.priority}'`);
    }

    // Verify the update persisted
    const verifyPriority = await Conversation.findById(testConversationId2);
    if (verifyPriority.priority !== 'high') {
      throw new Error('Priority update did not persist');
    }
    console.log('✓ Priority update verified in database');

    // Test 8: Update last message time
    console.log('\n8. Testing Conversation.updateLastMessageTime()...');
    const beforeUpdate = await Conversation.findById(testConversationId2);
    const originalTime = beforeUpdate.lastMessageAt;
    
    // Wait a bit to ensure timestamp difference
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const updatedTime = await Conversation.updateLastMessageTime(testConversationId2);
    console.log('✓ Last message time updated:', {
      id: updatedTime.id,
      originalTime,
      newTime: updatedTime.lastMessageAt,
    });

    if (updatedTime.lastMessageAt <= originalTime) {
      throw new Error('Last message time was not updated');
    }
    console.log('✓ Last message time is newer than original');

    // Test 9: Error handling - update non-existent conversation
    console.log('\n9. Testing error handling...');
    try {
      await Conversation.updateStatus('non-existent-id', 'active');
      throw new Error('Should have thrown an error for non-existent conversation');
    } catch (error) {
      if (error.message === 'Conversation not found') {
        console.log('✓ Error handling works correctly for non-existent conversation');
      } else {
        throw error;
      }
    }

    // Test 10: Update status back to active
    console.log('\n10. Testing status update back to active...');
    const backToActive = await Conversation.updateStatus(testConversationId1, 'active');
    if (backToActive.status !== 'active') {
      throw new Error('Failed to update status back to active');
    }
    console.log('✓ Conversation status updated back to active');

    const activeAfterReactivation = await Conversation.findActive();
    const reactivated = activeAfterReactivation.find(c => c.id === testConversationId1);
    if (!reactivated) {
      throw new Error('Conversation should be in active list after reactivation');
    }
    console.log('✓ Conversation appears in active list after reactivation');

    console.log('\n✅ All Conversation model tests passed!');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    // Cleanup: Delete test data
    try {
      const db = await getDatabase();
      if (testConversationId1) {
        await new Promise((resolve, reject) => {
          db.run('DELETE FROM conversations WHERE id = ?', [testConversationId1], (err) => {
            if (err) {
              console.error('Failed to cleanup test conversation 1:', err);
            }
            resolve();
          });
        });
      }
      if (testConversationId2) {
        await new Promise((resolve, reject) => {
          db.run('DELETE FROM conversations WHERE id = ?', [testConversationId2], (err) => {
            if (err) {
              console.error('Failed to cleanup test conversation 2:', err);
            }
            resolve();
          });
        });
      }
      console.log('\n✓ Test data cleaned up');
    } catch (error) {
      console.error('Error during cleanup:', error);
    }

    await closeDatabase();
  }
}

// Run tests
testConversationModel();

