# Deployment Guide - Eliche Radiche MVP

## Prerequisites

Before deploying, ensure you have:

- [ ] Domain name purchased
- [ ] Vercel account created (for frontend)
- [ ] Railway/Render account created (for backend)
- [ ] PostgreSQL database provisioned (Railway/Render)
- [ ] OpenAI API key (production)
- [ ] SSL certificates ready (handled by Vercel/Railway)

---

## Step 1: Database Migration (SQLite → PostgreSQL)

### Option A: Using Railway PostgreSQL

1. Create PostgreSQL database on Railway
2. Copy the connection string (DATABASE_URL)
3. Update `.env.production` with the connection string

### Option B: Using Render PostgreSQL

1. Create PostgreSQL database on Render
2. Copy the connection string (DATABASE_URL)
3. Update `.env.production` with the connection string

### Schema Migration

The schema needs to be adapted for PostgreSQL. Key differences:

**SQLite (Development):**
```sql
CREATE TABLE conversations (
    id TEXT PRIMARY KEY,
    created_at INTEGER NOT NULL,
    ...
);
```

**PostgreSQL (Production):**
```sql
CREATE TABLE conversations (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    ...
);
```

**Migration Steps:**

1. Connect to PostgreSQL database:
```bash
psql $DATABASE_URL
```

2. Run adapted schema (see `backend/db/schema-postgresql.sql` if available):
```sql
-- Convert schema from SQLite to PostgreSQL
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id TEXT NOT NULL,
    status TEXT NOT NULL,
    priority TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_message_at TIMESTAMP NOT NULL DEFAULT NOW(),
    assigned_operator TEXT
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    read BOOLEAN DEFAULT FALSE
);

-- Create indexes
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_timestamp ON messages(timestamp);
CREATE INDEX idx_conversations_priority ON conversations(priority);
CREATE INDEX idx_conversations_status ON conversations(status);
CREATE INDEX idx_conversations_last_message_at ON conversations(last_message_at);
```

---

## Step 2: Deploy Backend (Railway)

### Initial Setup

1. **Connect Repository:**
   - Go to Railway dashboard
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Set root directory: `backend`

2. **Configure Environment Variables:**
   - Go to Variables tab
   - Add the following:
     ```
     PORT=3001
     DATABASE_URL=[from Railway PostgreSQL]
     OPENAI_API_KEY=[your production OpenAI key]
     FRONTEND_URL=https://your-domain.com
     NODE_ENV=production
     ```

3. **Configure Build Settings:**
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Deploy:**
   - Railway will automatically deploy
   - Note the generated URL (e.g., `https://your-app.railway.app`)

### Alternative: Deploy to Render

1. **Create New Web Service:**
   - Connect GitHub repository
   - Set root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`

2. **Set Environment Variables:**
   - Same as Railway above

3. **Deploy:**
   - Render will deploy automatically
   - Note the generated URL

---

## Step 3: Deploy Frontend (Vercel)

### Initial Setup

1. **Import Repository:**
   - Go to Vercel dashboard
   - Click "Add New Project"
   - Import your GitHub repository
   - Set framework preset: **Next.js**

2. **Configure Project Settings:**
   - Root Directory: `frontend`
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

3. **Set Environment Variables:**
   - Go to Settings → Environment Variables
   - Add:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
     NEXT_PUBLIC_SOCKET_URL=https://your-backend-url.railway.app
     ```

4. **Deploy:**
   - Click "Deploy"
   - Vercel will build and deploy
   - Note the generated URL (e.g., `https://your-app.vercel.app`)

---

## Step 4: Configure DNS

### For Custom Domain

1. **In Vercel:**
   - Go to Project Settings → Domains
   - Add your domain: `your-domain.com`
   - Add www subdomain: `www.your-domain.com`
   - Follow DNS configuration instructions

2. **In Railway/Render:**
   - Add custom domain: `api.your-domain.com`
   - Follow DNS configuration instructions

3. **DNS Records (at your domain registrar):**
   ```
   Type    Name    Value
   A       @       [Vercel IP]
   CNAME   www     [Vercel URL]
   CNAME   api     [Railway/Render URL]
   ```

4. **Verify DNS Propagation:**
   - Use `dig` or online DNS checker
   - Wait for propagation (can take up to 48 hours)

---

## Step 5: Update CORS Configuration

The backend already has CORS configured correctly in `server.js`:

```javascript
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));
```

**Verify:**
- Ensure `FRONTEND_URL` in backend environment variables matches your production frontend URL
- Test CORS by making a request from frontend to backend

---

## Step 6: SSL Verification

### Vercel SSL
- ✅ SSL is automatically provisioned and renewed
- ✅ HTTPS is enabled by default
- ✅ No action needed

### Railway SSL
- ✅ SSL is automatically provisioned
- ✅ HTTPS is enabled by default
- ✅ No action needed

### Render SSL
- ✅ SSL is automatically provisioned
- ✅ HTTPS is enabled by default
- ✅ No action needed

**Verify HTTPS:**
- Visit `https://your-domain.com` - should load without warnings
- Visit `https://api.your-domain.com/health` - should return `{"status":"ok"}`

---

## Step 7: Post-Deployment Testing

### Checklist

1. **Frontend Tests:**
   - [ ] Landing page loads correctly
   - [ ] Chat widget appears
   - [ ] Can open chat widget
   - [ ] Connection status shows "Online"

2. **Backend Tests:**
   - [ ] Health check: `curl https://api.your-domain.com/health`
   - [ ] API responds correctly
   - [ ] Database connection works

3. **End-to-End Tests:**
   - [ ] Customer can send message
   - [ ] Operator dashboard receives message
   - [ ] Operator can respond
   - [ ] Customer receives response
   - [ ] Real-time updates work

4. **Mobile Testing:**
   - [ ] Test on mobile device
   - [ ] Responsive design works
   - [ ] Touch interactions work

5. **Error Handling:**
   - [ ] Check error logs
   - [ ] Verify error messages display correctly
   - [ ] Test with invalid inputs

---

## Step 8: Monitoring Setup

### Error Tracking (Sentry)

1. **Install Sentry:**
```bash
# Backend
cd backend
npm install @sentry/node

# Frontend
cd frontend
npm install @sentry/nextjs
```

2. **Configure Sentry:**
   - Create Sentry account
   - Get DSN
   - Add to environment variables:
     ```
     SENTRY_DSN=[your Sentry DSN]
     ```

3. **Initialize Sentry:**
   - Backend: Add to `server.js`
   - Frontend: Add to `next.config.js`

### Uptime Monitoring

1. **UptimeRobot Setup:**
   - Create account at uptimerobot.com
   - Add monitor for:
     - Frontend: `https://your-domain.com`
     - Backend: `https://api.your-domain.com/health`
   - Set alert notifications

2. **Other Options:**
   - Pingdom
   - StatusCake
   - Better Uptime

---

## Rollback Procedure

If deployment fails:

1. **Vercel Rollback:**
   - Go to Deployments tab
   - Find previous successful deployment
   - Click "..." → "Promote to Production"

2. **Railway Rollback:**
   - Go to Deployments tab
   - Find previous successful deployment
   - Click "Redeploy"

3. **Render Rollback:**
   - Go to Deployments tab
   - Find previous successful deployment
   - Click "Rollback"

4. **Troubleshooting:**
   - Check deployment logs
   - Verify environment variables
   - Test locally before redeploying
   - Check database connection

---

## Maintenance

### Daily (First Week)
- [ ] Check error logs
- [ ] Monitor API response times
- [ ] Verify database connections
- [ ] Check OpenAI API usage/costs

### Weekly
- [ ] Review error logs
- [ ] Check database size
- [ ] Review API costs (OpenAI)
- [ ] Backup database

### Monthly
- [ ] Review performance metrics
- [ ] Update dependencies
- [ ] Review security patches
- [ ] Optimize database queries if needed

---

## Environment Variables Reference

### Backend (.env.production)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-prod-xxxxx` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://your-domain.com` |
| `NODE_ENV` | Environment | `production` |

### Frontend (.env.production)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://api.your-domain.com` |
| `NEXT_PUBLIC_SOCKET_URL` | Socket.io URL | `https://api.your-domain.com` |

---

## Troubleshooting

### Common Issues

**Issue: CORS errors**
- **Solution:** Verify `FRONTEND_URL` matches actual frontend URL exactly

**Issue: Database connection fails**
- **Solution:** Check `DATABASE_URL` format, verify database is accessible

**Issue: Socket.io not connecting**
- **Solution:** Verify `NEXT_PUBLIC_SOCKET_URL` matches backend URL, check CORS

**Issue: Environment variables not loading**
- **Solution:** Restart deployment, verify variable names match exactly

**Issue: Build fails**
- **Solution:** Check build logs, verify all dependencies are in package.json

---

## Security Checklist

- [ ] All environment variables set (no defaults in production)
- [ ] HTTPS enabled on all domains
- [ ] CORS configured correctly
- [ ] Database credentials secure
- [ ] API keys not exposed in frontend code
- [ ] Rate limiting configured (future)
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (parameterized queries)

---

## Support

For deployment issues:
1. Check deployment logs
2. Review error messages
3. Verify environment variables
4. Test locally first
5. Check documentation for platform-specific issues

---

**Last Updated:** January 28, 2026

