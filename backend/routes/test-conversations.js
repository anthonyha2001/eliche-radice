/**
 * Test script for Conversations API endpoints
 * Run with: node routes/test-conversations.js
 * Make sure the server is running on port 3001
 */

const http = require('http');

const BASE_URL = 'http://localhost:3001/api/conversations';

/**
 * Make HTTP request helper
 */
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
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
  console.log('Testing Conversations API...\n');
  console.log('⚠️  Make sure the server is running on port 3001\n');

  let passedTests = 0;
  let failedTests = 0;
  let conversationId = null;

  try {
    // Test 1: Create conversation
    console.log('1. Testing POST /conversations (create conversation)...');
    try {
      const response = await makeRequest('POST', BASE_URL, {
        customerId: 'test-customer-1',
        priority: 'high',
      });

      if (response.status === 201 && response.data.data && response.data.data.id) {
        conversationId = response.data.data.id;
        console.log(`✓ Conversation created: ${conversationId}`);
        console.log(`   Status: ${response.data.data.status}`);
        console.log(`   Priority: ${response.data.data.priority}`);
        passedTests++;
      } else {
        console.log(`❌ Failed to create conversation. Status: ${response.status}`);
        console.log(`   Response:`, JSON.stringify(response.data, null, 2));
        failedTests++;
      }
    } catch (error) {
      console.log(`❌ Error creating conversation: ${error.message}`);
      failedTests++;
    }

    if (!conversationId) {
      console.log('\n⚠️  Cannot continue tests without a conversation ID');
      console.log(`\nTest Results: ${passedTests} passed, ${failedTests} failed`);
      process.exit(failedTests > 0 ? 1 : 0);
    }

    // Test 2: Get all conversations
    console.log('\n2. Testing GET /conversations (get all active conversations)...');
    try {
      const response = await makeRequest('GET', BASE_URL);

      if (response.status === 200 && Array.isArray(response.data.data)) {
        const found = response.data.data.some(conv => conv.id === conversationId);
        if (found) {
          console.log(`✓ Get all conversations works (found ${response.data.data.length} conversations)`);
          passedTests++;
        } else {
          console.log('❌ Created conversation not found in list');
          failedTests++;
        }
      } else {
        console.log(`❌ Failed to get conversations. Status: ${response.status}`);
        failedTests++;
      }
    } catch (error) {
      console.log(`❌ Error getting conversations: ${error.message}`);
      failedTests++;
    }

    // Test 3: Get single conversation
    console.log('\n3. Testing GET /conversations/:id (get single conversation)...');
    try {
      const response = await makeRequest('GET', `${BASE_URL}/${conversationId}`);

      if (response.status === 200 && response.data.data && response.data.data.id === conversationId) {
        console.log(`✓ Get single conversation works`);
        console.log(`   Includes messages: ${Array.isArray(response.data.data.messages)}`);
        passedTests++;
      } else {
        console.log(`❌ Failed to get conversation. Status: ${response.status}`);
        failedTests++;
      }
    } catch (error) {
      console.log(`❌ Error getting conversation: ${error.message}`);
      failedTests++;
    }

    // Test 4: Update status
    console.log('\n4. Testing PATCH /conversations/:id/status (update status)...');
    try {
      const response = await makeRequest('PATCH', `${BASE_URL}/${conversationId}/status`, {
        status: 'resolved',
      });

      if (response.status === 200 && response.data.data && response.data.data.status === 'resolved') {
        console.log(`✓ Update status works (status: ${response.data.data.status})`);
        passedTests++;
      } else {
        console.log(`❌ Failed to update status. Status: ${response.status}`);
        console.log(`   Response:`, JSON.stringify(response.data, null, 2));
        failedTests++;
      }
    } catch (error) {
      console.log(`❌ Error updating status: ${error.message}`);
      failedTests++;
    }

    // Test 5: Update priority
    console.log('\n5. Testing PATCH /conversations/:id/priority (update priority)...');
    try {
      const response = await makeRequest('PATCH', `${BASE_URL}/${conversationId}/priority`, {
        priority: 'critical',
      });

      if (response.status === 200 && response.data.data && response.data.data.priority === 'critical') {
        console.log(`✓ Update priority works (priority: ${response.data.data.priority})`);
        passedTests++;
      } else {
        console.log(`❌ Failed to update priority. Status: ${response.status}`);
        failedTests++;
      }
    } catch (error) {
      console.log(`❌ Error updating priority: ${error.message}`);
      failedTests++;
    }

    // Test 6: Validation - invalid status
    console.log('\n6. Testing validation (invalid status)...');
    try {
      const response = await makeRequest('PATCH', `${BASE_URL}/${conversationId}/status`, {
        status: 'invalid-status',
      });

      if (response.status === 400) {
        console.log('✓ Validation works for invalid status');
        passedTests++;
      } else {
        console.log(`❌ Expected 400 for invalid status, got ${response.status}`);
        failedTests++;
      }
    } catch (error) {
      console.log(`❌ Error testing validation: ${error.message}`);
      failedTests++;
    }

    // Test 7: Validation - invalid priority
    console.log('\n7. Testing validation (invalid priority)...');
    try {
      const response = await makeRequest('PATCH', `${BASE_URL}/${conversationId}/priority`, {
        priority: 'invalid-priority',
      });

      if (response.status === 400) {
        console.log('✓ Validation works for invalid priority');
        passedTests++;
      } else {
        console.log(`❌ Expected 400 for invalid priority, got ${response.status}`);
        failedTests++;
      }
    } catch (error) {
      console.log(`❌ Error testing validation: ${error.message}`);
      failedTests++;
    }

    // Test 8: Not found - invalid ID
    console.log('\n8. Testing 404 for non-existent conversation...');
    try {
      const response = await makeRequest('GET', `${BASE_URL}/non-existent-id`);

      if (response.status === 404) {
        console.log('✓ 404 handling works correctly');
        passedTests++;
      } else {
        console.log(`❌ Expected 404, got ${response.status}`);
        failedTests++;
      }
    } catch (error) {
      console.log(`❌ Error testing 404: ${error.message}`);
      failedTests++;
    }

    // Test 9: Create conversation without customerId
    console.log('\n9. Testing validation (missing customerId)...');
    try {
      const response = await makeRequest('POST', BASE_URL, {
        priority: 'high',
      });

      if (response.status === 400) {
        console.log('✓ Validation works for missing customerId');
        passedTests++;
      } else {
        console.log(`❌ Expected 400 for missing customerId, got ${response.status}`);
        failedTests++;
      }
    } catch (error) {
      console.log(`❌ Error testing validation: ${error.message}`);
      failedTests++;
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log(`Test Results: ${passedTests} passed, ${failedTests} failed`);

    if (failedTests === 0) {
      console.log('✅ All conversation API tests passed!');
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

