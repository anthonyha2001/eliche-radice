# Conversation Expiration and Closing

## Date: January 28, 2026

---

## Overview

Implemented two features for conversation lifecycle management:
1. **Automatic expiration** - Conversations expire after 24 hours of inactivity
2. **Manual closing** - Operators can manually close conversations from the dashboard

---

## Features Implemented

### 1. Automatic Expiration (24 Hours)

**How it works:**
- Conversations are automatically marked as `resolved` if no messages have been sent in the last 24 hours
- Expiration check runs every hour
- Based on `last_message_at` timestamp
- Only affects conversations with `status = 'active'`

**Implementation:**
- `Conversation.expireOldConversations(hoursOld)` method added
- Background job runs every hour in `server.js`
- Runs immediately on server startup

### 2. Manual Closing

**How it works:**
- Operators can click "Close Conversation" button in the dashboard
- Shows confirmation dialog before closing
- Conversation status changed to `resolved`
- Conversation removed from active list
- Selected conversation cleared

**Implementation:**
- "Close Conversation" button added to conversation header
- Uses existing `updateConversationStatus` API endpoint
- Refreshes conversation list after closing

---

## Code Changes

### Backend

**File:** `backend/models/Conversation.js`

**New Method:**
```javascript
expireOldConversations: async (hoursOld = 24) => {
  // Finds active conversations older than threshold
  // Updates them to 'resolved' status
  // Returns count of expired conversations
}
```

**File:** `backend/server.js`

**New Function:**
```javascript
function startConversationExpirationJob() {
  // Runs expiration check immediately on startup
  // Then runs every hour (3600000 milliseconds)
  // Logs expiration results
}
```

### Frontend

**File:** `frontend/app/operator/page.tsx`

**New Features:**
- Conversation header with customer name/phone
- "Close Conversation" button
- `handleCloseConversation` function
- Confirmation dialog before closing
- Auto-refresh conversation list after closing

---

## Usage

### Automatic Expiration

**No action required** - Runs automatically:
- Every hour
- On server startup
- Logs results to console

**Console Output:**
```
🕐 Running conversation expiration check...
⏰ Expired 2 conversation(s) older than 24 hours
✅ Expired 2 conversation(s)
```

### Manual Closing

**Operator Dashboard:**
1. Select a conversation
2. Click "Close Conversation" button (top right)
3. Confirm in dialog
4. Conversation is closed and removed from active list

---

## Testing

### Test Expiration

**Run test script:**
```bash
cd backend
node models/test-expiration.js
```

**Expected Output:**
```
✅ Created conversation
✅ Updated timestamp
✅ Expired 1 conversation(s)
✅ Expiration test passed!
```

### Test Manual Close

1. Start backend: `npm run dev`
2. Start frontend: `npm run dev`
3. Open operator dashboard: `http://localhost:3000/operator`
4. Select a conversation
5. Click "Close Conversation"
6. Confirm dialog
7. Verify conversation removed from list

---

## Configuration

### Expiration Time

**Default:** 24 hours

**To change:** Modify in `backend/server.js`:
```javascript
Conversation.expireOldConversations(24); // Change 24 to desired hours
```

### Check Interval

**Default:** Every 1 hour (3600000 milliseconds)

**To change:** Modify in `backend/server.js`:
```javascript
const EXPIRATION_INTERVAL = 60 * 60 * 1000; // 1 hour
// Change to desired interval in milliseconds
```

---

## Status Values

**Valid statuses:**
- `active` - Conversation is active and can receive messages
- `resolved` - Conversation is closed (expired or manually closed)
- `waiting` - Conversation is waiting for response

**Expired conversations:** Changed to `resolved`

**Closed conversations:** Changed to `resolved`

---

## Database Impact

**No schema changes required** - Uses existing `status` field

**Queries affected:**
- `findActive()` - Only returns `status = 'active'` conversations
- Expired/closed conversations automatically excluded from active list

---

## Files Modified

1. ✅ `backend/models/Conversation.js` - Added `expireOldConversations` method
2. ✅ `backend/server.js` - Added expiration job
3. ✅ `frontend/app/operator/page.tsx` - Added close button and handler
4. ✅ `backend/models/test-expiration.js` - Created test script
5. ✅ `docs/CONVERSATION_EXPIRATION.md` - Documentation

---

## Status

✅ **Conversation expiration and closing implemented**

**Summary:**
- ✅ Automatic expiration after 24 hours
- ✅ Background job runs every hour
- ✅ Manual close button in dashboard
- ✅ Confirmation dialog before closing
- ✅ Auto-refresh after closing
- ✅ Test script created
- ✅ Documentation complete

---

## Next Steps

1. ✅ Test expiration script
2. ✅ Test manual close in dashboard
3. ⏳ Monitor expiration logs in production
4. ⏳ Consider adding "Reopen Conversation" feature (future)

---

**Confirmation:** Conversation expiration (24 hours) and manual closing implemented. Conversations automatically expire after 24 hours of inactivity, and operators can manually close conversations from the dashboard.

