# End-to-End Test Checklist

## Setup
- [ ] Backend running on port 3001
- [ ] Frontend running on port 3000
- [ ] Database initialized
- [ ] No console errors

## Customer Flow
- [ ] Landing page loads correctly
- [ ] Chat widget appears (gold button)
- [ ] Chat widget opens on click
- [ ] Shows "Online" status
- [ ] Can type message (textarea grows)
- [ ] Can send message (Enter or button)
- [ ] Message appears in chat
- [ ] Character counter shows after 400 chars
- [ ] Widget can be closed and reopened
- [ ] Conversation persists (localStorage)

## Operator Flow
- [ ] Dashboard loads at /operator
- [ ] Shows "Online" status
- [ ] Conversation list is empty initially
- [ ] New conversation appears when customer sends message
- [ ] Conversation shows correct priority badge
- [ ] Clicking conversation loads messages
- [ ] Messages display correctly
- [ ] Can send response
- [ ] AI suggestion panel shows suggestions
- [ ] "Use this" copies suggestion

## Real-Time Communication
- [ ] Customer message appears in operator dashboard instantly
- [ ] Operator response appears in customer chat instantly
- [ ] Typing indicator works (future feature)
- [ ] Connection status updates correctly
- [ ] Reconnects after temporary disconnect

## Priority Detection
- [ ] Send "URGENT: Engine fire!" → Shows critical badge
- [ ] Send "Need help today" → Shows high badge
- [ ] Send "General inquiry" → Shows normal badge
- [ ] Critical conversations appear at top of list

## Error Handling
- [ ] Disconnect backend → Shows "Connecting..." status
- [ ] Reconnect backend → Returns to "Online"
- [ ] Message queues and sends after reconnect
- [ ] Invalid API calls show error messages

## Mobile Responsive
- [ ] Landing page responsive on mobile viewport
- [ ] Chat widget responsive
- [ ] Dashboard usable on tablet (minimum)

## Performance
- [ ] Landing page loads in < 2 seconds
- [ ] Message delivery < 500ms
- [ ] Dashboard updates < 1 second
- [ ] No memory leaks (check DevTools)

## Browser Compatibility
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge

## Acceptance Criteria
- [ ] Yacht owner can contact in seconds
- [ ] No messages lost
- [ ] Urgent issues immediately visible
- [ ] System feels professional and reliable

## Test Execution Log

### Date: _______________
### Tester: _______________

#### Setup Results:
- Backend: [ ] Pass [ ] Fail
- Frontend: [ ] Pass [ ] Fail
- Database: [ ] Pass [ ] Fail

#### Customer Flow Results:
- Landing page: [ ] Pass [ ] Fail
- Chat widget: [ ] Pass [ ] Fail
- Message sending: [ ] Pass [ ] Fail
- Character counter: [ ] Pass [ ] Fail
- Persistence: [ ] Pass [ ] Fail

#### Operator Flow Results:
- Dashboard load: [ ] Pass [ ] Fail
- Conversation list: [ ] Pass [ ] Fail
- Message display: [ ] Pass [ ] Fail
- Response sending: [ ] Pass [ ] Fail
- AI suggestions: [ ] Pass [ ] Fail

#### Real-Time Results:
- Customer → Operator: [ ] Pass [ ] Fail
- Operator → Customer: [ ] Pass [ ] Fail
- Connection status: [ ] Pass [ ] Fail

#### Priority Detection Results:
- Critical detection: [ ] Pass [ ] Fail
- High detection: [ ] Pass [ ] Fail
- Normal detection: [ ] Pass [ ] Fail
- Sorting: [ ] Pass [ ] Fail

#### Error Handling Results:
- Disconnect handling: [ ] Pass [ ] Fail
- Reconnect handling: [ ] Pass [ ] Fail
- Error messages: [ ] Pass [ ] Fail

#### Performance Results:
- Landing page load: [ ] Pass [ ] Fail
- Message delivery: [ ] Pass [ ] Fail
- Dashboard updates: [ ] Pass [ ] Fail

## Notes
_Add any observations, issues, or improvements here:_

