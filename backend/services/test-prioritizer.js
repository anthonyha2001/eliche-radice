const { analyzePriority } = require('./prioritizer');

/**
 * Test prioritizer service
 */
function testPrioritizer() {
  console.log('Testing Prioritizer service...\n');

  let passedTests = 0;
  let failedTests = 0;

  // Test 1: Critical keyword - "urgent"
  console.log('1. Testing critical keyword: "urgent"...');
  const result1 = analyzePriority('This is urgent! I need help immediately.');
  if (result1.priority === 'critical' && result1.confidence === 0.9) {
    console.log('✓ Correctly identified as critical');
    passedTests++;
  } else {
    console.log(`❌ Expected: { priority: 'critical', confidence: 0.9 }, Got:`, result1);
    failedTests++;
  }

  // Test 2: Critical keyword - "emergency"
  console.log('\n2. Testing critical keyword: "emergency"...');
  const result2 = analyzePriority('EMERGENCY: The yacht is sinking!');
  if (result2.priority === 'critical' && result2.confidence === 0.9) {
    console.log('✓ Correctly identified as critical (case insensitive)');
    passedTests++;
  } else {
    console.log(`❌ Expected: { priority: 'critical', confidence: 0.9 }, Got:`, result2);
    failedTests++;
  }

  // Test 3: Critical keyword - "fire"
  console.log('\n3. Testing critical keyword: "fire"...');
  const result3 = analyzePriority('There is a fire on board!');
  if (result3.priority === 'critical' && result3.confidence === 0.9) {
    console.log('✓ Correctly identified as critical');
    passedTests++;
  } else {
    console.log(`❌ Expected: { priority: 'critical', confidence: 0.9 }, Got:`, result3);
    failedTests++;
  }

  // Test 4: Critical keyword - "broken"
  console.log('\n4. Testing critical keyword: "broken"...');
  const result4 = analyzePriority('The engine is broken and not working.');
  if (result4.priority === 'critical' && result4.confidence === 0.9) {
    console.log('✓ Correctly identified as critical (multiple keywords)');
    passedTests++;
  } else {
    console.log(`❌ Expected: { priority: 'critical', confidence: 0.9 }, Got:`, result4);
    failedTests++;
  }

  // Test 5: High priority keyword - "asap"
  console.log('\n5. Testing high priority keyword: "asap"...');
  const result5 = analyzePriority('I need this done ASAP please.');
  if (result5.priority === 'high' && result5.confidence === 0.7) {
    console.log('✓ Correctly identified as high priority');
    passedTests++;
  } else {
    console.log(`❌ Expected: { priority: 'high', confidence: 0.7 }, Got:`, result5);
    failedTests++;
  }

  // Test 6: High priority keyword - "today"
  console.log('\n6. Testing high priority keyword: "today"...');
  const result6 = analyzePriority('Can you fix this today?');
  if (result6.priority === 'high' && result6.confidence === 0.7) {
    console.log('✓ Correctly identified as high priority');
    passedTests++;
  } else {
    console.log(`❌ Expected: { priority: 'high', confidence: 0.7 }, Got:`, result6);
    failedTests++;
  }

  // Test 7: High priority keyword - "soon"
  console.log('\n7. Testing high priority keyword: "soon"...');
  const result7 = analyzePriority('I need this done soon.');
  if (result7.priority === 'high' && result7.confidence === 0.7) {
    console.log('✓ Correctly identified as high priority');
    passedTests++;
  } else {
    console.log(`❌ Expected: { priority: 'high', confidence: 0.7 }, Got:`, result7);
    failedTests++;
  }

  // Test 8: Normal priority - no keywords
  console.log('\n8. Testing normal priority message...');
  const result8 = analyzePriority('Hello, I would like to schedule maintenance for next month.');
  if (result8.priority === 'normal' && result8.confidence === 0.5) {
    console.log('✓ Correctly identified as normal priority');
    passedTests++;
  } else {
    console.log(`❌ Expected: { priority: 'normal', confidence: 0.5 }, Got:`, result8);
    failedTests++;
  }

  // Test 9: Critical takes precedence over high
  console.log('\n9. Testing priority precedence (critical over high)...');
  const result9 = analyzePriority('This is urgent and I need it done soon.');
  if (result9.priority === 'critical' && result9.confidence === 0.9) {
    console.log('✓ Critical priority takes precedence over high');
    passedTests++;
  } else {
    console.log(`❌ Expected: { priority: 'critical', confidence: 0.9 }, Got:`, result9);
    failedTests++;
  }

  // Test 10: Empty string
  console.log('\n10. Testing empty string...');
  const result10 = analyzePriority('');
  if (result10.priority === 'normal' && result10.confidence === 0.5) {
    console.log('✓ Empty string defaults to normal');
    passedTests++;
  } else {
    console.log(`❌ Expected: { priority: 'normal', confidence: 0.5 }, Got:`, result10);
    failedTests++;
  }

  // Test 11: Null/undefined
  console.log('\n11. Testing null input...');
  const result11 = analyzePriority(null);
  if (result11.priority === 'normal' && result11.confidence === 0.5) {
    console.log('✓ Null input defaults to normal');
    passedTests++;
  } else {
    console.log(`❌ Expected: { priority: 'normal', confidence: 0.5 }, Got:`, result11);
    failedTests++;
  }

  // Test 12: Non-string input
  console.log('\n12. Testing non-string input...');
  const result12 = analyzePriority(123);
  if (result12.priority === 'normal' && result12.confidence === 0.5) {
    console.log('✓ Non-string input defaults to normal');
    passedTests++;
  } else {
    console.log(`❌ Expected: { priority: 'normal', confidence: 0.5 }, Got:`, result12);
    failedTests++;
  }

  // Test 13: All critical keywords
  console.log('\n13. Testing all critical keywords...');
  const criticalKeywords = ['urgent', 'emergency', 'sinking', 'fire', 'leak', 'not working', 'broken', 'help', 'mayday'];
  let allCriticalPass = true;
  for (const keyword of criticalKeywords) {
    const result = analyzePriority(`This is ${keyword}`);
    if (result.priority !== 'critical' || result.confidence !== 0.9) {
      allCriticalPass = false;
      console.log(`❌ Failed for keyword: ${keyword}`);
      break;
    }
  }
  if (allCriticalPass) {
    console.log(`✓ All ${criticalKeywords.length} critical keywords detected correctly`);
    passedTests++;
  } else {
    failedTests++;
  }

  // Test 14: All high keywords
  console.log('\n14. Testing all high priority keywords...');
  const highKeywords = ['soon', 'today', 'asap', 'quickly', 'important'];
  let allHighPass = true;
  for (const keyword of highKeywords) {
    const result = analyzePriority(`I need this ${keyword}`);
    if (result.priority !== 'high' || result.confidence !== 0.7) {
      allHighPass = false;
      console.log(`❌ Failed for keyword: ${keyword}`);
      break;
    }
  }
  if (allHighPass) {
    console.log(`✓ All ${highKeywords.length} high priority keywords detected correctly`);
    passedTests++;
  } else {
    failedTests++;
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(`Test Results: ${passedTests} passed, ${failedTests} failed`);
  
  if (failedTests === 0) {
    console.log('✅ All prioritizer tests passed!');
    return 0;
  } else {
    console.log('❌ Some tests failed');
    return 1;
  }
}

// Run tests
const exitCode = testPrioritizer();
process.exit(exitCode);

