# Socket.IO WebSocket Handshake Fix

## Summary of Changes

### Files Modified

1. **`backend/server.js`**
   - ✅ Socket.IO attached to single HTTP server instance (`http.createServer(app)`)
   - ✅ Only ONE listener on `process.env.PORT` (no `app.listen()`)
   - ✅ Socket.IO CORS configured with origin callback matching Express CORS
   - ✅ Explicit path set: `/socket.io/` (default, but explicit for clarity)
   - ✅ Enhanced logging for connection errors, connections, and disconnects
   - ✅ Health endpoint includes Socket.IO connection count
   - ✅ Credentials set to `true` (matches frontend `withCredentials: true`)

2. **`frontend/lib/socket.ts`** (no changes needed)
   - Already configured correctly with `withCredentials: true`
   - Uses default `/socket.io/` path
   - Transports: `['websocket', 'polling']`

## Architecture

```
HTTP Server (port 3001)
  ├── Express app (REST API: /api/*)
  └── Socket.IO server (WebSocket: /socket.io/)
      └── Attached to same HTTP server
```

**Critical**: Socket.IO MUST be attached to the same HTTP server that Express uses. This ensures:
- WebSocket upgrade requests are handled correctly
- CORS is applied consistently
- Only one port is used

## Environment Variables

### Railway (Backend)

Set in Railway Dashboard → Backend Service → Variables:

```bash
CORS_ORIGINS=https://eliche-radice.vercel.app,http://localhost:3000
DATABASE_URL=<automatically provided by Railway when Postgres is attached>
PORT=<automatically set by Railway>
NODE_ENV=production
```

**Important**: 
- `CORS_ORIGINS` must include the exact Vercel frontend URL
- No trailing slashes in origins
- Comma-separated list (no spaces around commas)

### Vercel (Frontend)

Set in Vercel Dashboard → Project → Settings → Environment Variables:

```bash
NEXT_PUBLIC_SOCKET_URL=https://eliche-radice-production.up.railway.app
NEXT_PUBLIC_API_URL=https://eliche-radice-production.up.railway.app
```

**Important**:
- No trailing slashes in URLs
- Must use `https://` (not `http://`) for production
- Both variables should point to the same Railway backend URL

## Testing

### 1. Test Health Endpoint

```bash
curl https://eliche-radice-production.up.railway.app/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-01-29T...",
  "uptime": 123,
  "socketIo": {
    "connected": 0,
    "path": "/socket.io/"
  }
}
```

### 2. Test Socket.IO Connection (Browser Console)

Open browser console on `https://eliche-radice.vercel.app`:

```javascript
// Should see connection logs
// ✅ Socket connected successfully
//    Socket ID: <id>
//    Transport: websocket (or polling)
```

### 3. Test CORS Preflight

```bash
curl -X OPTIONS https://eliche-radice-production.up.railway.app/socket.io/ \
  -H "Origin: https://eliche-radice.vercel.app" \
  -H "Access-Control-Request-Method: GET" \
  -v
```

Expected headers:
```
Access-Control-Allow-Origin: https://eliche-radice.vercel.app
Access-Control-Allow-Methods: GET,POST
Access-Control-Allow-Credentials: true
```

## Troubleshooting

### Error: "Unexpected response code: 400"

**Causes:**
1. CORS origin not in allowlist → Check `CORS_ORIGINS` env var
2. Socket.IO path mismatch → Both use `/socket.io/` (default)
3. Credentials mismatch → Both use `credentials: true` / `withCredentials: true`

**Check Railway logs:**
- Look for: `⚠️ Socket.IO CORS blocked origin: <origin>`
- Verify allowed origins match the frontend URL exactly

### Error: "Connection refused"

**Causes:**
1. Backend not running → Check Railway deployment status
2. Wrong URL → Verify `NEXT_PUBLIC_SOCKET_URL` matches Railway URL
3. Port mismatch → Railway sets `PORT` automatically

### Error: "Transport unknown"

**Causes:**
1. WebSocket blocked → Socket.IO will fallback to polling
2. Firewall/proxy → Check Railway network settings

## Verification Checklist

- [ ] `CORS_ORIGINS` set on Railway with exact Vercel URL
- [ ] `NEXT_PUBLIC_SOCKET_URL` set on Vercel with Railway URL
- [ ] No trailing slashes in URLs
- [ ] Health endpoint returns 200
- [ ] Browser console shows "Socket connected successfully"
- [ ] Railway logs show "Socket.io client connected"
- [ ] Transport is "websocket" (or "polling" as fallback)

## Key Points

1. **Single HTTP Server**: Socket.IO and Express share the same `http.createServer(app)` instance
2. **CORS Matching**: Socket.IO CORS callback uses same logic as Express CORS
3. **Path Consistency**: Both use default `/socket.io/` path
4. **Credentials**: Both use `credentials: true` / `withCredentials: true`
5. **Logging**: Enhanced logs help debug connection issues

