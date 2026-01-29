/**
 * Test script for Messages API endpoints
 * Run with: node routes/test-messages.js
 * Make sure the server is running on port 3001
 */

const http = require('http');

const BASE_URL = 'http://localhost:3001/api';
const CONVERSATIONS_URL = `${BASE_URL}/conversations`;
const MESSAGES_URL = `${BASE_URL}/messages`;

/**
 * Make HTTP request helper
 */
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, data: parsed });
        } catch (error) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('Testing Messages API...\n');
  console.log('⚠️  Make sure the server is running on port 3001\n');

  let passedTests = 0;
  let failedTests = 0;
  let conversationId = null;
  let messageId = null;

  try {
    // Setup: Create a conversation first
    console.log('Setup: Creating test conversation...');
    try {
      const response = await makeRequest('POST', CONVERSATIONS_URL, {
        customerId: 'test-customer-messages',
        priority: 'normal',
      });

      if (response.status === 201 && response.data.data && response.data.data.id) {
        conversationId = response.data.data.id;
        console.log(`✓ Test conversation created: ${conversationId}\n`);
      } else {
        console.log(`❌ Failed to create test conversation. Status: ${response.status}`);
        console.log(`   Response:`, JSON.stringify(response.data, null, 2));
        process.exit(1);
      }
    } catch (error) {
      console.log(`❌ Error creating test conversation: ${error.message}`);
      process.exit(1);
    }

    // Test 1: Create a message
    console.log('1. Testing POST /messages (create message)...');
    try {
      const response = await makeRequest('POST', MESSAGES_URL, {
        conversationId: conversationId,
        sender: 'customer',
        content: 'Hello, I need help with my yacht maintenance.',
      });

      if (response.status === 201 && response.data.data && response.data.data.id) {
        messageId = response.data.data.id;
        console.log(`✓ Message created: ${messageId}`);
        console.log(`   Sender: ${response.data.data.sender}`);
        console.log(`   Content: ${response.data.data.content.substring(0, 40)}...`);
        console.log(`   Read: ${response.data.data.read}`);
        passedTests++;
      } else {
        console.log(`❌ Failed to create message. Status: ${response.status}`);
        console.log(`   Response:`, JSON.stringify(response.data, null, 2));
        failedTests++;
      }
    } catch (error) {
      console.log(`❌ Error creating message: ${error.message}`);
      failedTests++;
    }

    if (!messageId) {
      console.log('\n⚠️  Cannot continue tests without a message ID');
      console.log(`\nTest Results: ${passedTests} passed, ${failedTests} failed`);
      process.exit(failedTests > 0 ? 1 : 0);
    }

    // Test 2: Verify conversation's lastMessageAt was updated
    console.log('\n2. Testing conversation lastMessageAt update...');
    try {
      const originalTime = Date.now();
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
      
      const response = await makeRequest('POST', MESSAGES_URL, {
        conversationId: conversationId,
        sender: 'operator',
        content: 'Hello! I would be happy to help you.',
      });

      if (response.status === 201) {
        // Check conversation's lastMessageAt
        const convResponse = await makeRequest('GET', `${CONVERSATIONS_URL}/${conversationId}`);
        if (convResponse.status === 200 && convResponse.data.data) {
          const lastMessageAt = convResponse.data.data.lastMessageAt;
          if (lastMessageAt >= originalTime) {
            console.log('✓ Conversation lastMessageAt was updated correctly');
            passedTests++;
          } else {
            console.log('❌ Conversation lastMessageAt was not updated');
            failedTests++;
          }
        } else {
          console.log('❌ Failed to verify lastMessageAt update');
          failedTests++;
        }
      } else {
        console.log('❌ Failed to create second message');
        failedTests++;
      }
    } catch (error) {
      console.log(`❌ Error testing lastMessageAt update: ${error.message}`);
      failedTests++;
    }

    // Test 3: Get messages for conversation
    console.log('\n3. Testing GET /messages?conversationId=:id (get messages)...');
    try {
      const response = await makeRequest('GET', `${MESSAGES_URL}?conversationId=${conversationId}`);

      if (response.status === 200 && Array.isArray(response.data.data) && response.data.data.length >= 2) {
        console.log(`✓ Get messages works (found ${response.data.data.length} messages)`);
        const ordered = response.data.data.every((msg, i) => 
          i === 0 || response.data.data[i - 1].timestamp <= msg.timestamp
        );
        if (ordered) {
          console.log('✓ Messages are ordered by timestamp ASC');
        }
        passedTests++;
      } else {
        console.log(`❌ Failed to get messages. Status: ${response.status}`);
        console.log(`   Response:`, JSON.stringify(response.data, null, 2));
        failedTests++;
      }
    } catch (error) {
      console.log(`❌ Error getting messages: ${error.message}`);
      failedTests++;
    }

    // Test 4: Mark message as read
    console.log('\n4. Testing PATCH /messages/:id/read (mark as read)...');
    try {
      const response = await makeRequest('PATCH', `${MESSAGES_URL}/${messageId}/read`);

      if (response.status === 200 && response.data.data && response.data.data.read === true) {
        console.log(`✓ Mark message as read works (read: ${response.data.data.read})`);
        passedTests++;
      } else {
        console.log(`❌ Failed to mark message as read. Status: ${response.status}`);
        failedTests++;
      }
    } catch (error) {
      console.log(`❌ Error marking message as read: ${error.message}`);
      failedTests++;
    }

    // Test 5: Verify message is saved to database
    console.log('\n5. Testing message persistence in database...');
    try {
      const response = await makeRequest('GET', `${MESSAGES_URL}?conversationId=${conversationId}`);
      
      if (response.status === 200 && Array.isArray(response.data.data)) {
        const foundMessage = response.data.data.find(msg => msg.id === messageId);
        if (foundMessage && foundMessage.read === true) {
          console.log('✓ Message persisted and read status saved correctly');
          passedTests++;
        } else {
          console.log('❌ Message not found or read status not persisted');
          failedTests++;
        }
      } else {
        console.log('❌ Failed to verify message persistence');
        failedTests++;
      }
    } catch (error) {
      console.log(`❌ Error verifying message persistence: ${error.message}`);
      failedTests++;
    }

    // Test 6: Validation - missing conversationId
    console.log('\n6. Testing validation (missing conversationId)...');
    try {
      const response = await makeRequest('POST', MESSAGES_URL, {
        sender: 'customer',
        content: 'Test message',
      });

      if (response.status === 400) {
        console.log('✓ Validation works for missing conversationId');
        passedTests++;
      } else {
        console.log(`❌ Expected 400 for missing conversationId, got ${response.status}`);
        failedTests++;
      }
    } catch (error) {
      console.log(`❌ Error testing validation: ${error.message}`);
      failedTests++;
    }

    // Test 7: Validation - invalid sender
    console.log('\n7. Testing validation (invalid sender)...');
    try {
      const response = await makeRequest('POST', MESSAGES_URL, {
        conversationId: conversationId,
        sender: 'invalid-sender',
        content: 'Test message',
      });

      if (response.status === 400) {
        console.log('✓ Validation works for invalid sender');
        passedTests++;
      } else {
        console.log(`❌ Expected 400 for invalid sender, got ${response.status}`);
        failedTests++;
      }
    } catch (error) {
      console.log(`❌ Error testing validation: ${error.message}`);
      failedTests++;
    }

    // Test 8: Validation - empty content
    console.log('\n8. Testing validation (empty content)...');
    try {
      const response = await makeRequest('POST', MESSAGES_URL, {
        conversationId: conversationId,
        sender: 'customer',
        content: '',
      });

      if (response.status === 400) {
        console.log('✓ Validation works for empty content');
        passedTests++;
      } else {
        console.log(`❌ Expected 400 for empty content, got ${response.status}`);
        failedTests++;
      }
    } catch (error) {
      console.log(`❌ Error testing validation: ${error.message}`);
      failedTests++;
    }

    // Test 9: 404 - non-existent conversation
    console.log('\n9. Testing 404 for non-existent conversation...');
    try {
      const response = await makeRequest('POST', MESSAGES_URL, {
        conversationId: 'non-existent-id',
        sender: 'customer',
        content: 'Test message',
      });

      if (response.status === 404) {
        console.log('✓ 404 handling works for non-existent conversation');
        passedTests++;
      } else {
        console.log(`❌ Expected 404, got ${response.status}`);
        failedTests++;
      }
    } catch (error) {
      console.log(`❌ Error testing 404: ${error.message}`);
      failedTests++;
    }

    // Test 10: 404 - non-existent message
    console.log('\n10. Testing 404 for non-existent message...');
    try {
      const response = await makeRequest('PATCH', `${MESSAGES_URL}/non-existent-id/read`);

      if (response.status === 404) {
        console.log('✓ 404 handling works for non-existent message');
        passedTests++;
      } else {
        console.log(`❌ Expected 404, got ${response.status}`);
        failedTests++;
      }
    } catch (error) {
      console.log(`❌ Error testing 404: ${error.message}`);
      failedTests++;
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log(`Test Results: ${passedTests} passed, ${failedTests} failed`);

    if (failedTests === 0) {
      console.log('✅ All messages API tests passed!');
      return 0;
    } else {
      console.log('❌ Some tests failed');
      return 1;
    }
  } catch (error) {
    console.error('\n❌ Test execution failed:', error);
    return 1;
  }
}

// Run tests
runTests().then(exitCode => {
  process.exit(exitCode);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

