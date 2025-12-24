# Render Deployment Guide - Complete Setup

## 🚀 Quick Start

This guide will help you deploy the Morpankh Saree e-commerce platform on Render with Render Managed PostgreSQL.

## ⚡ Deploy Everything Together (Easiest Method)

### Using render.yaml (Infrastructure as Code)

**This is the recommended method!** Deploy backend, frontend, and database all at once.

1. **Ensure `render.yaml` is in your repository root**
2. Go to Render Dashboard → **New** → **Blueprint**
3. Connect your GitHub repository
4. Render will automatically detect `render.yaml` and show:
   - PostgreSQL Database
   - Backend Web Service
   - Frontend Web Service
5. Click **Apply** to deploy everything
6. **Manually set these environment variables** (they can't be auto-generated):
   - `JWT_SECRET` - Generate a strong random string (32+ chars)
   - `JWT_REFRESH_SECRET` - Generate a strong random string (32+ chars)
   - `RAZORPAY_KEY_ID` - From Razorpay dashboard
   - `RAZORPAY_KEY_SECRET` - From Razorpay dashboard
   - `REDIS_URL` - Optional (if using Redis)
7. After deployment, run migrations via Shell:
   ```bash
   cd backend && npx prisma migrate deploy
   ```

**Benefits:**
- ✅ Deploy everything in one go
- ✅ Services are automatically linked
- ✅ Database connection is automatically configured
- ✅ Less manual configuration needed

---

## 📋 Manual Deployment (Alternative Method)

---

## 📋 Prerequisites

1. **Render Account** - Sign up at [render.com](https://render.com)
2. **GitHub Repository** - Your code should be on GitHub
3. **Razorpay Account** - For payment gateway (get API keys)
4. **Domain (Optional)** - For custom domain setup

---

## 🗄️ Step 1: Create PostgreSQL Database

### Option A: Using Render Dashboard

1. Go to Render Dashboard → **New** → **PostgreSQL**
2. Configure:
   - **Name:** `morpankh-saree-db`
   - **Database:** `morpankh_saree`
   - **User:** `morpankh_user`
   - **Region:** Mumbai (or closest to your users)
   - **Plan:** Starter (or higher for production)
3. Click **Create Database**
4. **Important:** Copy the **Internal Database URL** (you'll need this)

### Option B: Using render.yaml (Infrastructure as Code)

If you're using the `render.yaml` file:
1. The database will be created automatically
2. The connection string will be injected as `DATABASE_URL`

---

## 🔧 Step 2: Deploy Backend API

### 2.1 Create Web Service

1. Go to Render Dashboard → **New** → **Web Service**
2. Connect your GitHub repository
3. Configure the service:

   **Basic Settings:**
   - **Name:** `morpankh-saree-backend`
   - **Region:** Mumbai
   - **Branch:** `main` (or your default branch)
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build && npx prisma generate`
   - **Start Command:** `npm start`

   **Advanced Settings:**
   - **Instance Type:** Starter (512 MB RAM) or higher
   - **Auto-Deploy:** Yes (deploys on every push)

### 2.2 Environment Variables

Add these in **Environment** section:

```env
# Database (from Render PostgreSQL)
DATABASE_URL=postgresql://user:password@host:5432/morpankh_saree
# Use the Internal Database URL from your Render PostgreSQL instance

# JWT Secrets (generate strong random strings, min 32 chars)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-min-32-chars

# Razorpay (get from Razorpay Dashboard)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret-key

# Redis (Optional - use Upstash free tier)
REDIS_URL=redis://default:password@host:port
# Or leave empty if not using Redis

# Application
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-frontend-url.onrender.com
# Update this after deploying frontend
```

### 2.3 Run Database Migrations

After the first deployment:

1. Go to your backend service → **Shell**
2. Run:
   ```bash
   cd backend
   npx prisma migrate deploy
   ```
3. This will apply all migrations to your Render PostgreSQL database

**OR** Add to build command (automatic):
```bash
npm install && npm run build && npx prisma generate && npx prisma migrate deploy
```

### 2.4 Verify Backend

1. Check service logs for successful startup
2. Test health endpoint: `https://your-backend-url.onrender.com/health`
3. Should return: `{"status":"ok","timestamp":"..."}`

---

## 🎨 Step 3: Deploy Frontend

### 3.1 Create Static Site (Recommended for Next.js)

1. Go to Render Dashboard → **New** → **Static Site**
2. Connect your GitHub repository
3. Configure:
   - **Name:** `morpankh-saree-frontend`
   - **Branch:** `main`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `.next`

### 3.2 Environment Variables

Add these in **Environment** section:

```env
NEXT_PUBLIC_API_URL=https://morpankh-saree-backend.onrender.com/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
```

**Important:** Replace `morpankh-saree-backend.onrender.com` with your actual backend URL.

### 3.3 Alternative: Web Service (For SSR)

If you need Server-Side Rendering:

1. Go to Render Dashboard → **New** → **Web Service**
2. Configure:
   - **Name:** `morpankh-saree-frontend`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** Starter or higher

---

## 🔗 Step 4: Connect Services

### 4.1 Update Backend CORS

In your backend service → **Environment Variables**, update:

```env
FRONTEND_URL=https://morpankh-saree-frontend.onrender.com
```

### 4.2 Update Frontend API URL

In your frontend service → **Environment Variables**, update:

```env
NEXT_PUBLIC_API_URL=https://morpankh-saree-backend.onrender.com/api
```

---

## 🔐 Step 5: Security Configuration

### 5.1 Generate Strong Secrets

For JWT secrets, use a strong random string generator:

```bash
# Generate JWT_SECRET (32+ characters)
openssl rand -base64 32

# Generate JWT_REFRESH_SECRET (32+ characters)
openssl rand -base64 32
```

### 5.2 Razorpay Setup

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Navigate to **Settings** → **API Keys**
3. Generate Test/Live keys
4. Copy `Key ID` and `Key Secret`
5. Add to Render environment variables

---

## 📊 Step 6: Database Migrations

### Initial Migration

After first deployment, run migrations:

```bash
# Via Render Shell
cd backend
npx prisma migrate deploy
```

### Future Migrations

1. Create migration locally:
   ```bash
   cd backend
   npx prisma migrate dev --name migration_name
   ```
2. Commit and push:
   ```bash
   git add prisma/migrations
   git commit -m "Add migration: migration_name"
   git push
   ```
3. Render will auto-deploy
4. Migrations run automatically if added to build command

---

## ✅ Step 7: Post-Deployment Checklist

- [ ] Backend health check: `https://backend-url/health`
- [ ] Database migrations applied successfully
- [ ] Frontend loads correctly
- [ ] API endpoints accessible
- [ ] User registration/login works
- [ ] Payment gateway configured
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] SSL certificates active (automatic on Render)
- [ ] Custom domain configured (if applicable)

---

## 🔍 Step 8: Monitoring & Logs

### View Logs

1. **Backend Logs:** Service → **Logs** tab
2. **Frontend Logs:** Service → **Logs** tab
3. **Database Logs:** Database → **Logs** tab

### Health Checks

Render automatically monitors:
- Service uptime
- Response times
- Error rates
- Build status

### Custom Monitoring

Consider adding:
- **Sentry** - Error tracking
- **UptimeRobot** - Uptime monitoring
- **LogRocket** - Session replay

---

## 🌐 Step 9: Custom Domain (Optional)

### Backend Domain

1. Go to Backend Service → **Settings** → **Custom Domains**
2. Add your domain: `api.yourdomain.com`
3. Update DNS records as instructed by Render
4. Update `FRONTEND_URL` environment variable

### Frontend Domain

1. Go to Frontend Service → **Settings** → **Custom Domains**
2. Add your domain: `www.yourdomain.com`
3. Update DNS records
4. Update `NEXT_PUBLIC_API_URL` if backend also has custom domain

---

## 🐛 Troubleshooting

### Backend Won't Start

**Issue:** Service fails to start

**Solutions:**
- Check logs for error messages
- Verify `DATABASE_URL` is correct
- Ensure `PORT` is set (Render uses 10000)
- Check if Prisma client is generated
- Verify all environment variables are set

### Database Connection Errors

**Issue:** Cannot connect to database

**Solutions:**
- Use **Internal Database URL** (not external)
- Verify database is in same region
- Check database is running
- Ensure migrations have run

### Frontend Can't Reach Backend

**Issue:** API calls fail

**Solutions:**
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS settings in backend
- Ensure backend service is running
- Check browser console for errors

### Build Fails

**Issue:** Build command fails

**Solutions:**
- Check build logs
- Verify Node version (use `.nvmrc` if needed)
- Ensure all dependencies are in `package.json`
- Check for TypeScript errors

### Migrations Fail

**Issue:** Database migrations error

**Solutions:**
- Run migrations manually via Shell
- Check database connection
- Verify schema is correct
- Check migration files are committed

---

## 📝 Environment Variables Reference

### Backend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | JWT signing secret (32+ chars) | `your-secret-key` |
| `JWT_REFRESH_SECRET` | Refresh token secret (32+ chars) | `your-refresh-secret` |
| `RAZORPAY_KEY_ID` | Razorpay API key ID | `rzp_test_xxxxx` |
| `RAZORPAY_KEY_SECRET` | Razorpay API secret | `your-secret` |
| `PORT` | Server port | `10000` |
| `NODE_ENV` | Environment | `production` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://frontend.onrender.com` |

### Backend Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REDIS_URL` | Redis connection string | Optional |
| `LOG_LEVEL` | Logging level | `info` |

### Frontend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://backend.onrender.com/api` |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay public key | `rzp_test_xxxxx` |

---

## 🔄 CI/CD Pipeline

Render automatically:

1. **Detects** git push to connected branch
2. **Builds** the application
3. **Runs** database migrations (if in build command)
4. **Deploys** new version
5. **Health checks** the service
6. **Switches** traffic to new version

### Manual Deploy

1. Go to Service → **Manual Deploy**
2. Select branch/commit
3. Click **Deploy**

---

## 💰 Cost Estimation

### Free Tier (Development)

- **Backend:** Free (with limitations)
- **Frontend:** Free (static site)
- **Database:** Free (90 days, then $7/month)
- **Total:** Free for 90 days, then ~$7/month

### Production (Starter Plan)

- **Backend:** $7/month
- **Frontend:** $7/month (or free if static)
- **Database:** $7/month
- **Total:** ~$14-21/month

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Prisma with Render](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-render)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [PostgreSQL on Render](https://render.com/docs/databases)

---

## 🆘 Support

If you encounter issues:

1. Check Render service logs
2. Review this guide's troubleshooting section
3. Check Render status page
4. Contact Render support

---

**Last Updated:** $(date)
**Status:** Ready for Production Deployment ✅

