#!/bin/bash
echo "Testing Messages API..."

# Setup: Create a test conversation
echo "Setup: Creating test conversation..."
CONV_ID=$(curl -s -X POST http://localhost:3001/api/conversations \
  -H "Content-Type: application/json" \
  -d '{"customerId":"test-customer-messages","priority":"normal"}' \
  | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

if [ -n "$CONV_ID" ]; then
  echo "✅ Test conversation created: $CONV_ID"
else
  echo "❌ Failed to create test conversation"
  exit 1
fi

# Test 1: Create a message
echo "1. Creating message..."
MESSAGE_ID=$(curl -s -X POST http://localhost:3001/api/messages \
  -H "Content-Type: application/json" \
  -d "{\"conversationId\":\"$CONV_ID\",\"sender\":\"customer\",\"content\":\"Hello, I need help with my yacht maintenance.\"}" \
  | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

if [ -n "$MESSAGE_ID" ]; then
  echo "✅ Message created: $MESSAGE_ID"
else
  echo "❌ Failed to create message"
  exit 1
fi

# Test 2: Verify conversation lastMessageAt was updated
echo "2. Testing conversation lastMessageAt update..."
sleep 0.1
curl -s -X POST http://localhost:3001/api/messages \
  -H "Content-Type: application/json" \
  -d "{\"conversationId\":\"$CONV_ID\",\"sender\":\"operator\",\"content\":\"Hello! I would be happy to help you.\"}" > /dev/null

CONV_RESPONSE=$(curl -s http://localhost:3001/api/conversations/$CONV_ID)
if echo "$CONV_RESPONSE" | grep -q "lastMessageAt"; then
  echo "✅ Conversation lastMessageAt was updated"
else
  echo "❌ Conversation lastMessageAt was not updated"
  exit 1
fi

# Test 3: Get messages for conversation
echo "3. Getting messages for conversation..."
curl -s "http://localhost:3001/api/messages?conversationId=$CONV_ID" | grep -q "$MESSAGE_ID"
if [ $? -eq 0 ]; then
  echo "✅ Get messages works"
else
  echo "❌ Get messages failed"
  exit 1
fi

# Test 4: Mark message as read
echo "4. Marking message as read..."
curl -s -X PATCH http://localhost:3001/api/messages/$MESSAGE_ID/read | grep -q '"read":true'
if [ $? -eq 0 ]; then
  echo "✅ Mark message as read works"
else
  echo "❌ Mark message as read failed"
  exit 1
fi

# Test 5: Verify message persistence
echo "5. Verifying message persistence..."
curl -s "http://localhost:3001/api/messages?conversationId=$CONV_ID" | grep -q "$MESSAGE_ID"
if [ $? -eq 0 ]; then
  echo "✅ Message persisted in database"
else
  echo "❌ Message not found in database"
  exit 1
fi

# Test 6: Validation - missing conversationId
echo "6. Testing validation (missing conversationId)..."
STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3001/api/messages \
  -H "Content-Type: application/json" \
  -d '{"sender":"customer","content":"Test message"}')
if [ "$STATUS_CODE" = "400" ]; then
  echo "✅ Validation works for missing conversationId"
else
  echo "❌ Validation failed for missing conversationId (got $STATUS_CODE)"
  exit 1
fi

# Test 7: Validation - invalid sender
echo "7. Testing validation (invalid sender)..."
STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3001/api/messages \
  -H "Content-Type: application/json" \
  -d "{\"conversationId\":\"$CONV_ID\",\"sender\":\"invalid-sender\",\"content\":\"Test message\"}")
if [ "$STATUS_CODE" = "400" ]; then
  echo "✅ Validation works for invalid sender"
else
  echo "❌ Validation failed for invalid sender (got $STATUS_CODE)"
  exit 1
fi

# Test 8: Validation - empty content
echo "8. Testing validation (empty content)..."
STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3001/api/messages \
  -H "Content-Type: application/json" \
  -d "{\"conversationId\":\"$CONV_ID\",\"sender\":\"customer\",\"content\":\"\"}")
if [ "$STATUS_CODE" = "400" ]; then
  echo "✅ Validation works for empty content"
else
  echo "❌ Validation failed for empty content (got $STATUS_CODE)"
  exit 1
fi

# Test 9: 404 - non-existent conversation
echo "9. Testing 404 for non-existent conversation..."
STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3001/api/messages \
  -H "Content-Type: application/json" \
  -d '{"conversationId":"non-existent-id","sender":"customer","content":"Test message"}')
if [ "$STATUS_CODE" = "404" ]; then
  echo "✅ 404 handling works for non-existent conversation"
else
  echo "❌ 404 handling failed (got $STATUS_CODE)"
  exit 1
fi

# Test 10: 404 - non-existent message
echo "10. Testing 404 for non-existent message..."
STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X PATCH http://localhost:3001/api/messages/non-existent-id/read)
if [ "$STATUS_CODE" = "404" ]; then
  echo "✅ 404 handling works for non-existent message"
else
  echo "❌ 404 handling failed (got $STATUS_CODE)"
  exit 1
fi

echo ""
echo "✅ All messages API tests passed"

