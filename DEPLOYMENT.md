# Deployment Guide - Render

> **Note:** This project uses **Render Managed PostgreSQL**. See `RENDER_DEPLOYMENT_GUIDE.md` for complete step-by-step instructions.

## Quick Start

1. **Create PostgreSQL Database** on Render
2. **Deploy Backend** as Web Service
3. **Deploy Frontend** as Static Site or Web Service
4. **Run Migrations** via Render Shell

## Backend Deployment (Render Web Service)

### 1. Create New Web Service

1. Go to Render Dashboard
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** morpankh-saree-backend
   - **Region:** Mumbai (or closest to your users)
   - **Branch:** main
   - **Root Directory:** backend
   - **Runtime:** Node
   - **Build Command:** `npm install && npm run build && npx prisma generate`
   - **Start Command:** `npm start`

### 2. Environment Variables

Add these in Render Dashboard → Environment:

**Important:** Use the **Internal Database URL** from your Render PostgreSQL instance.

```env
# Database (from Render Managed PostgreSQL - use Internal URL)
DATABASE_URL=postgresql://user:password@host:5432/dbname

# JWT Secrets (generate strong random strings, min 32 chars)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars

# Razorpay
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Application
PORT=10000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.onrender.com

# Optional
REDIS_URL=redis://host:port  # Or use Upstash Redis
```

### 3. PostgreSQL Database (Render Managed)

1. In Render Dashboard, click **New** → **PostgreSQL**
2. Configure:
   - **Name:** morpankh-saree-db
   - **Database:** morpankh_saree
   - **Region:** Mumbai (or closest)
   - **Plan:** Starter or higher
3. **Copy the Internal Database URL** (not external)
4. Add to backend environment variables as `DATABASE_URL`
5. Run migrations after first deployment:
   ```bash
   # Via Render Shell
   cd backend
   npx prisma migrate deploy
   ```

### 4. Redis (Optional)

- Use Upstash Redis (free tier available)
- Or Render Redis (if available in your region)

---

## Frontend Deployment (Render Static Site)

### Option 1: Static Site (Recommended)

1. Go to Render Dashboard
2. Click "New" → "Static Site"
3. Connect GitHub repository
4. Configure:
   - **Name:** morpankh-saree-frontend
   - **Branch:** main
   - **Root Directory:** frontend
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `.next`

### Option 2: Web Service (For SSR)

1. Go to Render Dashboard
2. Click "New" → "Web Service"
3. Configure:
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Start Command:** `cd frontend && npm start`

### Environment Variables

```env
NEXT_PUBLIC_API_URL=https://morpankh-saree-backend.onrender.com/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key-id
```

**Note:** Replace `morpankh-saree-backend.onrender.com` with your actual backend service URL.

---

## Database Migrations

### Initial Setup

```bash
cd backend
npx prisma generate
npx prisma migrate deploy
```

### After Schema Changes

```bash
npx prisma migrate dev --name migration_name
# Commit the migration files
git add prisma/migrations
git commit -m "Add migration: migration_name"
git push
# On Render, migrations run automatically via build command
```

---

## Build Scripts

### Backend (package.json)

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate deploy"
  }
}
```

### Frontend (package.json)

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

---

## Post-Deployment Checklist

- [ ] Verify backend health endpoint: `https://backend-url/health`
- [ ] Test API endpoints
- [ ] Verify database connections
- [ ] Test payment gateway (Razorpay)
- [ ] Check frontend loads correctly
- [ ] Test user registration/login
- [ ] Verify email/SMS services (if configured)
- [ ] Set up monitoring/alerts
- [ ] Configure custom domain (if needed)
- [ ] Set up SSL certificates (automatic on Render)

---

## Custom Domain Setup

### Backend
1. Go to Render Dashboard → Your Service → Settings
2. Add custom domain
3. Update CORS settings to include new domain
4. Update `FRONTEND_URL` environment variable

### Frontend
1. Go to Render Dashboard → Your Service → Settings
2. Add custom domain
3. DNS configuration will be provided by Render

---

## Environment-Specific Configs

### Development
- Local PostgreSQL (Docker recommended)
- Local Redis (optional)
- `NODE_ENV=development`

### Production
- Render PostgreSQL
- Upstash Redis
- `NODE_ENV=production`
- Strong JWT secrets
- HTTPS only

---

## Monitoring

Render provides:
- Build logs
- Runtime logs
- Metrics dashboard
- Auto-deploy on git push

Additional monitoring can be added:
- Sentry for error tracking
- LogRocket for session replay
- Analytics for user behavior

---

## Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Verify all environment variables are set
- Ensure Node version matches (.nvmrc or package.json engines)

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check if database is accessible from Render
- Ensure migrations have run

### Frontend Can't Reach Backend
- Verify NEXT_PUBLIC_API_URL is set correctly
- Check CORS settings in backend
- Verify backend service is running

### Payment Issues
- Verify Razorpay keys are correct
- Check Razorpay webhook URLs
- Ensure HTTPS is enabled

---

## CI/CD

Render automatically:
1. Detects git push
2. Runs build command
3. Deploys new version
4. Runs health checks
5. Switches traffic to new version

For manual deployments, use Render CLI or dashboard.

