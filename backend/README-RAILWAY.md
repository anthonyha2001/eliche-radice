# Railway Deployment Guide

## Environment Variables

### Required in Railway Backend Service:

1. **`DATABASE_URL`** - Automatically provided by Railway when Postgres is attached
2. **`FRONTEND_URL`** - Comma-separated list of allowed origins
   - Example: `https://elicheradicelb.com,http://localhost:3000`
   - Note: The production domain `https://elicheradicelb.com` is automatically allowed
   - Localhost is also automatically allowed for development

### Optional:

- `PORT` - Defaults to 3001 (Railway sets this automatically)
- `NODE_ENV` - Set to `production` on Railway

## Testing CORS Locally

```bash
# Test preflight request
curl -X OPTIONS http://localhost:3001/api/conversations \
  -H "Origin: https://elicheradicelb.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v

# Should return:
# Access-Control-Allow-Origin: https://elicheradicelb.com
# Access-Control-Allow-Methods: GET,POST,PATCH,DELETE,OPTIONS
# Access-Control-Allow-Headers: Content-Type, Authorization
```

## Schema Initialization

Schema is automatically initialized on server startup (not during build).

- Uses `CREATE TABLE IF NOT EXISTS` (idempotent)
- Retries 3 times with 2s delay on connection errors
- Exits with code 1 if schema init fails (triggers Railway restart)

## Node Version

Requires Node.js >= 20.0.0 (set in `package.json` engines).

