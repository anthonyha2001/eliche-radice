const { generateSuggestions } = require('./ai-assistant');

/**
 * Test AI Assistant service
 * Note: This test uses mocking when API key is not set or is placeholder
 */
async function testAIAssistant() {
  console.log('Testing AI Assistant service...\n');

  const apiKey = process.env.OPENAI_API_KEY;
  const hasValidKey = apiKey && apiKey !== 'placeholder_key' && apiKey.startsWith('sk-');

  if (!hasValidKey) {
    console.log('⚠️  OpenAI API key not set or is placeholder.');
    console.log('   Running tests with mock responses...\n');
  } else {
    console.log('✓ OpenAI API key detected. Running tests with actual API calls...\n');
    console.log('⚠️  Note: This will make real API calls and may incur costs.\n');
  }

  let passedTests = 0;
  let failedTests = 0;

  // Test 1: Basic suggestion generation
  console.log('1. Testing generateSuggestions() with simple message...');
  try {
    const conversationHistory = [
      { sender: 'customer', content: 'Hello, I need help with my yacht.' },
    ];
    const newMessage = 'The engine is making strange noises.';
    
    const suggestions = await generateSuggestions(conversationHistory, newMessage);
    
    if (Array.isArray(suggestions)) {
      console.log(`✓ Function returned array with ${suggestions.length} suggestions`);
      if (suggestions.length > 0) {
        console.log(`   Sample: "${suggestions[0].substring(0, 50)}..."`);
      }
      passedTests++;
    } else {
      console.log('❌ Expected array, got:', typeof suggestions);
      failedTests++;
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    failedTests++;
  }

  // Test 2: Empty conversation history
  console.log('\n2. Testing with empty conversation history...');
  try {
    const suggestions = await generateSuggestions([], 'I need maintenance scheduled.');
    
    if (Array.isArray(suggestions)) {
      console.log(`✓ Function handled empty history correctly (${suggestions.length} suggestions)`);
      passedTests++;
    } else {
      console.log('❌ Expected array');
      failedTests++;
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    failedTests++;
  }

  // Test 3: Conversation with last 5 messages
  console.log('\n3. Testing with conversation history (last 5 messages)...');
  try {
    const conversationHistory = [
      { sender: 'customer', content: 'Hello' },
      { sender: 'operator', content: 'Hello! How can I help you today?' },
      { sender: 'customer', content: 'I have an issue with my yacht' },
      { sender: 'operator', content: 'I understand. Can you describe the issue?' },
      { sender: 'customer', content: 'The navigation system is not working properly' },
      { sender: 'operator', content: 'Thank you for the details. Let me check on that.' },
    ];
    const newMessage = 'It keeps showing error messages.';
    
    const suggestions = await generateSuggestions(conversationHistory, newMessage);
    
    if (Array.isArray(suggestions)) {
      console.log(`✓ Function processed conversation history correctly (${suggestions.length} suggestions)`);
      passedTests++;
    } else {
      console.log('❌ Expected array');
      failedTests++;
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    failedTests++;
  }

  // Test 4: Invalid input handling
  console.log('\n4. Testing error handling with invalid input...');
  try {
    const suggestions = await generateSuggestions([], null);
    
    if (Array.isArray(suggestions) && suggestions.length === 0) {
      console.log('✓ Function handled null input gracefully (returned empty array)');
      passedTests++;
    } else {
      console.log('❌ Expected empty array for invalid input');
      failedTests++;
    }
  } catch (error) {
    // If it throws, that's also acceptable for invalid input
    console.log('✓ Function handled invalid input (threw error, which is acceptable)');
    passedTests++;
  }

  // Test 5: Empty string handling
  console.log('\n5. Testing error handling with empty string...');
  try {
    const suggestions = await generateSuggestions([], '');
    
    if (Array.isArray(suggestions)) {
      console.log(`✓ Function handled empty string (returned array, length: ${suggestions.length})`);
      passedTests++;
    } else {
      console.log('❌ Expected array');
      failedTests++;
    }
  } catch (error) {
    console.log('✓ Function handled empty string (threw error, which is acceptable)');
    passedTests++;
  }

  // Test 6: Non-array conversation history
  console.log('\n6. Testing error handling with non-array history...');
  try {
    const suggestions = await generateSuggestions('not an array', 'Test message');
    
    if (Array.isArray(suggestions)) {
      console.log('✓ Function handled non-array history gracefully');
      passedTests++;
    } else {
      console.log('❌ Expected array');
      failedTests++;
    }
  } catch (error) {
    console.log('✓ Function handled non-array history (threw error, which is acceptable)');
    passedTests++;
  }

  // Test 7: Response format validation
  console.log('\n7. Testing response format...');
  try {
    const conversationHistory = [
      { sender: 'customer', content: 'I need help with maintenance scheduling.' },
    ];
    const newMessage = 'When can you come?';
    
    const suggestions = await generateSuggestions(conversationHistory, newMessage);
    
    if (Array.isArray(suggestions)) {
      const allStrings = suggestions.every(s => typeof s === 'string');
      if (allStrings) {
        console.log('✓ All suggestions are strings');
        passedTests++;
      } else {
        console.log('❌ Not all suggestions are strings');
        failedTests++;
      }
    } else {
      console.log('❌ Expected array');
      failedTests++;
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    failedTests++;
  }

  // Test 8: Suggestion count limit
  console.log('\n8. Testing suggestion count limit (max 3)...');
  try {
    const conversationHistory = [];
    const newMessage = 'I have multiple issues to discuss.';
    
    const suggestions = await generateSuggestions(conversationHistory, newMessage);
    
    if (Array.isArray(suggestions) && suggestions.length <= 3) {
      console.log(`✓ Suggestions limited to 3 or fewer (got ${suggestions.length})`);
      passedTests++;
    } else {
      console.log(`❌ Expected max 3 suggestions, got ${suggestions.length}`);
      failedTests++;
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    failedTests++;
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(`Test Results: ${passedTests} passed, ${failedTests} failed`);
  
  if (failedTests === 0) {
    console.log('✅ All AI assistant tests passed!');
    
    if (!hasValidKey) {
      console.log('\n💡 To test with real API:');
      console.log('   1. Set OPENAI_API_KEY in backend/.env');
      console.log('   2. Run this test again');
    }
    
    return 0;
  } else {
    console.log('❌ Some tests failed');
    return 1;
  }
}

// Run tests
testAIAssistant().then(exitCode => {
  process.exit(exitCode);
}).catch(error => {
  console.error('Test execution failed:', error);
  process.exit(1);
});

