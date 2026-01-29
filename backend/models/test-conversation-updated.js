const Conversation = require('./Conversation');

async function testConversation() {
  try {
    console.log('🧪 Testing Conversation model...');
    
    // Test create with customer info
    console.log('\n1. Creating conversation with customer info...');
    const conv = await Conversation.create(
      'test-customer-123',
      'high',
      'John Smith',
      '+1 555-123-4567'
    );
    console.log('✅ Created:', conv);
    
    // Test findById
    console.log('\n2. Finding conversation by ID...');
    const found = await Conversation.findById(conv.id);
    console.log('✅ Found:', found);
    console.log('   Customer Name:', found.customerName);
    console.log('   Customer Phone:', found.customerPhone);
    
    // Test updateCustomerInfo
    console.log('\n3. Updating customer info...');
    await Conversation.updateCustomerInfo(
      conv.id,
      'Jane Doe',
      '+1 555-987-6543'
    );
    const updated = await Conversation.findById(conv.id);
    console.log('✅ Updated:', updated);
    console.log('   New Name:', updated.customerName);
    console.log('   New Phone:', updated.customerPhone);
    
    // Test findActive
    console.log('\n4. Finding active conversations...');
    const active = await Conversation.findActive();
    console.log(`✅ Found ${active.length} active conversations`);
    
    console.log('\n✅ All tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testConversation();

