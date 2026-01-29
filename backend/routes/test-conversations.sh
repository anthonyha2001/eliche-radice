#!/bin/bash
echo "Testing Conversations API..."

# Test create conversation
echo "1. Creating conversation..."
CONV_ID=$(curl -s -X POST http://localhost:3001/api/conversations \
  -H "Content-Type: application/json" \
  -d '{"customerId":"test-customer-1","priority":"high"}' \
  | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

if [ -n "$CONV_ID" ]; then
  echo "✅ Conversation created: $CONV_ID"
else
  echo "❌ Failed to create conversation"
  exit 1
fi

# Test get all conversations
echo "2. Getting all conversations..."
curl -s http://localhost:3001/api/conversations | grep -q "test-customer-1"
if [ $? -eq 0 ]; then
  echo "✅ Get all conversations works"
else
  echo "❌ Get all conversations failed"
  exit 1
fi

# Test get single conversation
echo "3. Getting single conversation..."
curl -s http://localhost:3001/api/conversations/$CONV_ID | grep -q "$CONV_ID"
if [ $? -eq 0 ]; then
  echo "✅ Get single conversation works"
else
  echo "❌ Get single conversation failed"
  exit 1
fi

# Test update status
echo "4. Updating conversation status..."
curl -s -X PATCH http://localhost:3001/api/conversations/$CONV_ID/status \
  -H "Content-Type: application/json" \
  -d '{"status":"resolved"}' | grep -q "resolved"
if [ $? -eq 0 ]; then
  echo "✅ Update status works"
else
  echo "❌ Update status failed"
  exit 1
fi

# Test update priority
echo "5. Updating conversation priority..."
curl -s -X PATCH http://localhost:3001/api/conversations/$CONV_ID/priority \
  -H "Content-Type: application/json" \
  -d '{"priority":"critical"}' | grep -q "critical"
if [ $? -eq 0 ]; then
  echo "✅ Update priority works"
else
  echo "❌ Update priority failed"
  exit 1
fi

# Test validation - invalid status
echo "6. Testing validation (invalid status)..."
STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X PATCH http://localhost:3001/api/conversations/$CONV_ID/status \
  -H "Content-Type: application/json" \
  -d '{"status":"invalid-status"}')
if [ "$STATUS_CODE" = "400" ]; then
  echo "✅ Validation works for invalid status"
else
  echo "❌ Validation failed for invalid status (got $STATUS_CODE)"
  exit 1
fi

# Test validation - invalid priority
echo "7. Testing validation (invalid priority)..."
STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X PATCH http://localhost:3001/api/conversations/$CONV_ID/priority \
  -H "Content-Type: application/json" \
  -d '{"priority":"invalid-priority"}')
if [ "$STATUS_CODE" = "400" ]; then
  echo "✅ Validation works for invalid priority"
else
  echo "❌ Validation failed for invalid priority (got $STATUS_CODE)"
  exit 1
fi

# Test 404 - non-existent conversation
echo "8. Testing 404 for non-existent conversation..."
STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/conversations/non-existent-id)
if [ "$STATUS_CODE" = "404" ]; then
  echo "✅ 404 handling works correctly"
else
  echo "❌ 404 handling failed (got $STATUS_CODE)"
  exit 1
fi

# Test validation - missing customerId
echo "9. Testing validation (missing customerId)..."
STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3001/api/conversations \
  -H "Content-Type: application/json" \
  -d '{"priority":"high"}')
if [ "$STATUS_CODE" = "400" ]; then
  echo "✅ Validation works for missing customerId"
else
  echo "❌ Validation failed for missing customerId (got $STATUS_CODE)"
  exit 1
fi

echo ""
echo "✅ All conversation API tests passed"

