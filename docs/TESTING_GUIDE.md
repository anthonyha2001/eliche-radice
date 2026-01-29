# Testing Guide

## Quick Start

### Prerequisites
- Node.js installed
- Backend dependencies installed (`cd backend && npm install`)
- Frontend dependencies installed (`cd frontend && npm install`)

### Running Automated Tests

#### 1. Start Backend Server
```bash
cd backend
npm run dev
```

#### 2. Start Frontend Server (in separate terminal)
```bash
cd frontend
npm run dev
```

#### 3. Run Backend Tests (in separate terminal)

**Database Connection Test:**
```bash
cd backend
node db/test-connection.js
```
Expected: ✅ Database connection test passed!

**Message Model Tests:**
```bash
cd backend
node models/test-message.js
```
Expected: ✅ All Message model tests passed!

**Conversation Model Tests:**
```bash
cd backend
node models/test-conversation.js
```
Expected: ✅ All Conversation model tests passed!

**Prioritizer Service Tests:**
```bash
cd backend
node services/test-prioritizer.js
```
Expected: ✅ All prioritizer tests passed!

**API Health Check:**
```bash
# PowerShell
Invoke-WebRequest -Uri http://localhost:3001/health -UseBasicParsing

# Bash/Linux/Mac
curl http://localhost:3001/health
```
Expected: `{"status":"ok"}`

**Socket.io Tests (requires server running):**
```bash
cd backend
node test-socket.js
```
Expected: ✅ All Socket.io tests passed!

---

## Manual Testing

### Customer Flow Testing

1. **Open Landing Page**
   - Navigate to: `http://localhost:3000`
   - Verify: Hero section, services, trust metrics display correctly

2. **Test Chat Widget**
   - Click gold chat button (bottom-right)
   - Verify: Widget opens, shows "Online" status
   - Type message: "Test message"
   - Press Enter or click Send
   - Verify: Message appears in chat

3. **Test Character Counter**
   - Type 400+ characters
   - Verify: Counter appears showing character count
   - Type 500+ characters
   - Verify: Input stops at 500 characters

4. **Test Widget Persistence**
   - Close widget
   - Refresh page
   - Verify: Conversation persists (check localStorage)

### Operator Flow Testing

1. **Open Operator Dashboard**
   - Navigate to: `http://localhost:3000/operator`
   - Verify: Dashboard loads, shows "Online" status

2. **Test Conversation List**
   - Send message from customer chat
   - Verify: Conversation appears in operator dashboard
   - Verify: Priority badge displays correctly

3. **Test Message Display**
   - Click conversation in list
   - Verify: Messages load and display correctly
   - Verify: Customer messages appear on left, operator messages on right

4. **Test Response Sending**
   - Type response: "Thank you for contacting us"
   - Press Enter or click Send
   - Verify: Message appears in operator view
   - Verify: Customer receives message in real-time

5. **Test AI Suggestions**
   - Select a conversation
   - Verify: AI suggestions panel shows suggestions
   - Click "Use this" button
   - Verify: Suggestion copied to clipboard

### Real-Time Communication Testing

1. **Open Two Browser Windows**
   - Window 1: `http://localhost:3000` (Customer)
   - Window 2: `http://localhost:3000/operator` (Operator)

2. **Test Customer → Operator**
   - Customer sends: "URGENT: Engine problem!"
   - Verify: Message appears in operator dashboard instantly (< 500ms)
   - Verify: Conversation shows critical priority badge

3. **Test Operator → Customer**
   - Operator selects conversation
   - Operator sends: "We'll dispatch a technician immediately"
   - Verify: Message appears in customer chat instantly (< 500ms)

### Priority Detection Testing

1. **Test Critical Priority**
   - Customer sends: "URGENT: Engine fire!"
   - Verify: Conversation shows critical badge (red, pulsing)
   - Verify: Conversation appears at top of list

2. **Test High Priority**
   - Customer sends: "Need help today"
   - Verify: Conversation shows high badge (orange)

3. **Test Normal Priority**
   - Customer sends: "General inquiry"
   - Verify: Conversation shows normal badge (green)

### Error Handling Testing

1. **Test Backend Disconnect**
   - Stop backend server (`Ctrl+C` in backend terminal)
   - Verify: Customer chat shows "Connecting..." status
   - Verify: Operator dashboard shows "Connecting..." status

2. **Test Backend Reconnect**
   - Restart backend server (`npm run dev`)
   - Verify: Status returns to "Online" automatically
   - Verify: Messages send successfully after reconnect

---

## Test Checklist

Use `docs/E2E_TEST_CHECKLIST.md` for comprehensive manual testing checklist.

---

## Troubleshooting

### Tests Fail to Run

**Issue:** `Cannot find module`
- **Solution:** Run `npm install` in backend directory

**Issue:** Database locked
- **Solution:** Close all database connections, restart server

**Issue:** Port already in use
- **Solution:** Kill process using port 3001 or 3000

### Socket.io Tests Fail

**Issue:** Connection refused
- **Solution:** Ensure backend server is running on port 3001

**Issue:** Tests timeout
- **Solution:** Check server logs for errors, verify Socket.io is configured correctly

### Manual Tests Fail

**Issue:** Messages not appearing
- **Solution:** Check browser console for errors, verify Socket.io connection

**Issue:** Priority badges not showing
- **Solution:** Check backend prioritizer service, verify message content

---

## Test Results

See `docs/TEST_RESULTS.md` for detailed test execution results.

---

## Continuous Testing

For continuous integration, consider:

1. **GitHub Actions** or **GitLab CI** for automated test runs
2. **Playwright** or **Cypress** for E2E browser testing
3. **Jest** for unit tests
4. **Supertest** for API testing

---

## Questions?

Refer to:
- `docs/E2E_TEST_CHECKLIST.md` - Comprehensive checklist
- `docs/TEST_RESULTS.md` - Test execution results
- Backend test files in `backend/**/test-*.js`

