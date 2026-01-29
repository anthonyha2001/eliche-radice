const Conversation = require('./Conversation');

async function testExpiration() {
  try {
    console.log('🧪 Testing conversation expiration...');
    
    // Create a test conversation
    console.log('\n1. Creating test conversation...');
    const conv = await Conversation.create(
      'test-expiration-customer',
      'normal',
      'Test User',
      '+1 555-000-0000'
    );
    console.log('✅ Created conversation:', conv.id);
    
    // Manually set last_message_at to 25 hours ago
    console.log('\n2. Setting last_message_at to 25 hours ago...');
    const db = await require('../db/connection').getDatabase();
    const oldTimestamp = Date.now() - (25 * 60 * 60 * 1000);
    
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE conversations SET last_message_at = ? WHERE id = ?',
        [oldTimestamp, conv.id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
    console.log('✅ Updated timestamp');
    
    // Check it's still active
    console.log('\n3. Verifying conversation is still active...');
    const before = await Conversation.findById(conv.id);
    console.log('   Status:', before.status);
    
    // Run expiration
    console.log('\n4. Running expiration check...');
    const expiredCount = await Conversation.expireOldConversations(24);
    console.log(`✅ Expired ${expiredCount} conversation(s)`);
    
    // Verify it's now resolved
    console.log('\n5. Verifying conversation is now resolved...');
    const after = await Conversation.findById(conv.id);
    console.log('   Status:', after.status);
    
    if (after.status === 'resolved') {
      console.log('\n✅ Expiration test passed!');
    } else {
      throw new Error(`Expected status 'resolved', got '${after.status}'`);
    }
    
    // Cleanup
    console.log('\n6. Cleaning up test conversation...');
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM conversations WHERE id = ?', [conv.id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    console.log('✅ Cleanup complete');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testExpiration();

