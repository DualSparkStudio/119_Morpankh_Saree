# Complete Deployment Guide - Render

## 🚀 Deploy Morpankh Saree on Render (Step-by-Step)

This guide covers everything: Deploy both Frontend and Backend together using Blueprint, Database setup, and configuration.

---

## 📋 Prerequisites

- [ ] Render account ([render.com](https://render.com))
- [ ] GitHub repository with your code (with `render.yaml` in root)
- [ ] Razorpay account (for payment gateway)
- [ ] 20-30 minutes for setup

---

## ⚡ METHOD 1: Deploy Everything Together on ONE URL (Recommended)

**Everything runs on a single URL:** `https://morpankh-saree.onrender.com`
- Frontend: `https://morpankh-saree.onrender.com`
- API: `https://morpankh-saree.onrender.com/api/*`

### STEP 1: Deploy Using Blueprint

1. **Ensure `render.yaml` is in your repository root**
   - ✅ Already created for you!

2. **Go to Render Dashboard**
   - Click **New** → **Blueprint**
   - Connect your GitHub repository
   - Select your repository: `119_Morpankh_Saree` (or your repo name)

3. **Render Detects Services**
   - Render will automatically detect `render.yaml`
   - Shows preview of:
     - ✅ PostgreSQL Database (`morpankh-saree-db`)
     - ✅ Combined Web Service (`morpankh-saree`) - Backend + Frontend on **ONE URL**

4. **Review Configuration**
   - Check all services are listed
   - Verify region (Mumbai recommended)
   - Review build commands

5. **Click "Apply"**
   - Render creates all services at once
   - This takes 10-15 minutes
   - You'll see build progress for each service

### STEP 2: Set Environment Variables

After deployment, you need to set these environment variables manually in the **morpankh-saree** service:

#### Service Environment Variables

Go to **morpankh-saree Service** → **Environment** tab, add:

```env
# JWT Secrets (REQUIRED - Generate strong random strings)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
JWT_REFRESH_SECRET=your-super-secret-refresh-key-minimum-32-characters-long

# Razorpay (REQUIRED - Get from Razorpay Dashboard)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret-key

# Frontend API URL (relative path - same domain)
NEXT_PUBLIC_API_URL=/api

# Razorpay Public Key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
# Same Key ID as above

# Redis (OPTIONAL - Leave empty if not using)
REDIS_URL=redis://default:password@host:port
```

**Note:** 
- `DATABASE_URL` is automatically set from the database connection
- `NEXT_PUBLIC_API_URL` is set to `/api` (relative path, same domain)
- No need for `FRONTEND_URL` since everything is on one domain

**How to Generate JWT Secrets:**
```bash
# On your local machine or Render Shell
openssl rand -base64 32
# Run twice to get two different secrets
```

**How to Get Razorpay Keys:**
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Navigate to **Settings** → **API Keys**
3. Generate Test/Live keys
4. Copy `Key ID` and `Key Secret`

### STEP 3: Run Database Migrations

1. Go to **morpankh-saree Service** → **Shell** tab
2. Click **Connect** to open terminal
3. Run:
   ```bash
   cd backend
   npx prisma migrate deploy
   ```
4. Wait for migrations to complete
5. You should see: `All migrations have been successfully applied`

### STEP 4: Your Single URL

After deployment, everything runs on **ONE URL**:
- **Main URL:** `https://morpankh-saree.onrender.com`
- **Frontend:** `https://morpankh-saree.onrender.com` (homepage, products, cart, etc.)
- **API:** `https://morpankh-saree.onrender.com/api/*` (all API endpoints)
- **Health:** `https://morpankh-saree.onrender.com/health`

**No separate URLs needed!** Everything is on one domain. ✅

### STEP 5: Verify Deployment

- **Single URL:** `https://morpankh-saree.onrender.com`
- **Health Check:** `https://morpankh-saree.onrender.com/health`
- **Frontend:** `https://morpankh-saree.onrender.com` (homepage)
- **API:** `https://morpankh-saree.onrender.com/api/*` (all API endpoints)
- **Test:** Register user, browse products, test checkout

**Done!** 🎉 Everything runs on one URL!

---

## 📋 METHOD 2: Deploy Separately (Alternative)

If you prefer to deploy services one by one, follow these steps:

---

### STEP 1: Create PostgreSQL Database

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New** → **PostgreSQL**
3. Fill in the details:
   - **Name:** `morpankh-saree-db`
   - **Database:** `morpankh_saree`
   - **User:** `morpankh_user`
   - **Region:** Mumbai (or closest to your users)
   - **PostgreSQL Version:** Latest (14+)
   - **Plan:** Starter ($7/month) or Free (90 days trial)
4. Click **Create Database**

### STEP 2: Get Database Connection String

1. Wait for database to be created (takes 1-2 minutes)
2. Go to your database → **Connections** tab
3. **IMPORTANT:** Copy the **Internal Database URL**
   - Format: `postgresql://user:password@host:5432/dbname`
   - This is different from External Database URL
   - Internal URL only works from Render services
4. **Save this URL** - you'll need it next

---

### STEP 3: Deploy Backend API

### 3.1 Create Backend Service

1. In Render Dashboard, click **New** → **Web Service**
2. Connect your GitHub repository
3. Select your repository: `119_Morpankh_Saree` (or your repo name)
4. Click **Connect**

### 3.2 Configure Backend Service

Fill in the service configuration:

**Basic Settings:**
- **Name:** `morpankh-saree-backend`
- **Region:** Mumbai (same as database)
- **Branch:** `main` (or your default branch)
- **Root Directory:** `backend`
- **Runtime:** `Node`
- **Build Command:** `npm install && npm run build && npx prisma generate`
- **Start Command:** `npm start`
- **Instance Type:** Starter (512 MB RAM) - Free tier available

**Advanced Settings:**
- **Auto-Deploy:** Yes (deploys on every git push)
- **Health Check Path:** `/health` (optional)

### 3.3 Set Backend Environment Variables

Click **Add Environment Variable** and add these one by one:

```env
# Database (REQUIRED)
DATABASE_URL=postgresql://user:password@host:5432/morpankh_saree
# Paste the Internal Database URL from Step 1.2

# JWT Secrets (REQUIRED - Generate strong random strings)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
JWT_REFRESH_SECRET=your-super-secret-refresh-key-minimum-32-characters-long
# Generate these using: openssl rand -base64 32

# Razorpay (REQUIRED - Get from Razorpay Dashboard)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret-key

# Application Settings (REQUIRED)
PORT=10000
NODE_ENV=production
FRONTEND_URL=https://morpankh-saree-frontend.onrender.com
# Update this after deploying frontend in Step 3

# Redis (OPTIONAL - Leave empty if not using)
REDIS_URL=redis://default:password@host:port
# Or use Upstash Redis (free tier available)
```

**How to Generate JWT Secrets:**
```bash
# On your local machine or Render Shell
openssl rand -base64 32
# Run twice to get two different secrets
```

**How to Get Razorpay Keys:**
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Navigate to **Settings** → **API Keys**
3. Generate Test/Live keys
4. Copy `Key ID` and `Key Secret`

### 3.4 Create and Deploy Backend

1. Click **Create Web Service**
2. Wait for build to complete (5-10 minutes)
3. Check build logs for any errors
4. Once deployed, note your backend URL: `https://morpankh-saree-backend.onrender.com`

### 3.5 Run Database Migrations

After backend is deployed:

1. Go to your backend service → **Shell** tab
2. Click **Connect** to open terminal
3. Run these commands:
   ```bash
   cd backend
   npx prisma migrate deploy
   ```
4. Wait for migrations to complete
5. You should see: `All migrations have been successfully applied`

**Verify Migration:**
- Check logs for success message
- Or test health endpoint: `https://your-backend-url.onrender.com/health`
- Should return: `{"status":"ok","timestamp":"..."}`

---

### STEP 4: Deploy Frontend

### 4.1 Create Frontend Service

1. In Render Dashboard, click **New** → **Static Site**
   - **OR** use **Web Service** if you need SSR (Server-Side Rendering)
2. Connect your GitHub repository (same repo)
3. Select your repository

### 4.2 Configure Frontend Service

**For Static Site (Recommended):**
- **Name:** `morpankh-saree-frontend`
- **Branch:** `main`
- **Root Directory:** `frontend`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `.next`

**For Web Service (If you need SSR):**
- **Name:** `morpankh-saree-frontend`
- **Root Directory:** `frontend`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Instance Type:** Starter

### 4.3 Set Frontend Environment Variables

Add these environment variables:

```env
# Backend API URL (REQUIRED)
NEXT_PUBLIC_API_URL=https://morpankh-saree-backend.onrender.com/api
# Replace with your actual backend URL from Step 2.4

# Razorpay (REQUIRED)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
# Same Key ID as backend
```

### 4.4 Create and Deploy Frontend

1. Click **Create Static Site** (or **Create Web Service**)
2. Wait for build to complete (5-10 minutes)
3. Once deployed, note your frontend URL: `https://morpankh-saree-frontend.onrender.com`

---

### STEP 5: Connect Services

### 5.1 Update Backend CORS

1. Go to Backend Service → **Environment** tab
2. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://morpankh-saree-frontend.onrender.com
   ```
   (Use your actual frontend URL from Step 3.4)
3. Click **Save Changes**
4. Service will automatically redeploy

### 5.2 Update Frontend API URL

1. Go to Frontend Service → **Environment** tab
2. Update `NEXT_PUBLIC_API_URL`:
   ```
   NEXT_PUBLIC_API_URL=https://morpankh-saree-backend.onrender.com/api
   ```
   (Use your actual backend URL from Step 2.4)
3. Click **Save Changes**
4. Service will automatically redeploy

---

### STEP 6: Verify Deployment

### 6.1 Test Backend

1. Open: `https://your-backend-url.onrender.com/health`
2. Should return: `{"status":"ok","timestamp":"..."}`
3. If error, check service logs

### 6.2 Test Frontend

1. Open: `https://your-frontend-url.onrender.com`
2. Should load homepage
3. Check browser console for errors

### 6.3 Test Database Connection

1. Go to Backend Service → **Logs**
2. Look for: `Server running on port 10000`
3. No database connection errors

### 6.4 Test Full Flow

1. **User Registration:**
   - Go to frontend
   - Try to register a new user
   - Check if it works

2. **Product Listing:**
   - Browse products
   - Check if products load

3. **Payment (Test Mode):**
   - Add item to cart
   - Go to checkout
   - Test Razorpay integration (use test cards)

---

## 🔄 Post-Deployment Setup (Both Methods)

### Create Admin User

1. Go to Backend Service → **Shell**
2. Run:
   ```bash
   cd backend
   npx prisma studio
   ```
3. Or use SQL:
   ```sql
   -- First register via API, then update role
   UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
   ```

### Add Sample Data (Optional)

1. Use Prisma Studio to add:
   - Categories
   - Products
   - Product Variants
2. Or create an admin panel to add data

### Set Up Monitoring

1. **Render Built-in:**
   - View logs in dashboard
   - Monitor uptime
   - Check metrics

2. **Optional Add-ons:**
   - Sentry for error tracking
   - UptimeRobot for monitoring
   - LogRocket for session replay

---

## 🌐 Custom Domain (Optional)

### Backend Domain

1. Go to Backend Service → **Settings** → **Custom Domains**
2. Add domain: `api.yourdomain.com`
3. Update DNS records as instructed
4. Update `FRONTEND_URL` environment variable

### Frontend Domain

1. Go to Frontend Service → **Settings** → **Custom Domains**
2. Add domain: `www.yourdomain.com`
3. Update DNS records
4. Update `NEXT_PUBLIC_API_URL` if backend also has custom domain

---

## 🐛 Troubleshooting

### Backend Won't Start

**Symptoms:** Service fails to start, shows error in logs

**Solutions:**
1. Check `DATABASE_URL` is correct (Internal URL)
2. Verify `PORT` is set to `10000`
3. Check if Prisma client is generated
4. Verify all required environment variables are set
5. Check build logs for TypeScript errors

### Database Connection Errors

**Symptoms:** `Can't reach database server` or connection timeout

**Solutions:**
1. Use **Internal Database URL** (not external)
2. Ensure database is in same region as backend
3. Check database is running (green status)
4. Verify `DATABASE_URL` format is correct
5. Run migrations: `npx prisma migrate deploy`

### Frontend Can't Reach Backend

**Symptoms:** API calls fail, CORS errors

**Solutions:**
1. Verify `NEXT_PUBLIC_API_URL` is correct
2. Check `FRONTEND_URL` in backend matches frontend URL
3. Ensure backend service is running
4. Check CORS settings in backend code
5. Verify backend URL is accessible

### Build Fails

**Symptoms:** Build command fails, deployment stops

**Solutions:**
1. Check build logs for specific error
2. Verify Node version (should be 20)
3. Ensure all dependencies are in `package.json`
4. Check for TypeScript errors
5. Verify build commands are correct

### Migrations Fail

**Symptoms:** `Migration failed` or database errors

**Solutions:**
1. Check database connection
2. Verify schema is correct
3. Ensure migration files are committed
4. Try running migrations manually via Shell
5. Check Prisma version matches

---

## 📝 Environment Variables Checklist

### Backend (Required)
- [ ] `DATABASE_URL` - Internal PostgreSQL URL
- [ ] `JWT_SECRET` - 32+ character random string
- [ ] `JWT_REFRESH_SECRET` - 32+ character random string
- [ ] `RAZORPAY_KEY_ID` - From Razorpay dashboard
- [ ] `RAZORPAY_KEY_SECRET` - From Razorpay dashboard
- [ ] `PORT` - Set to `10000`
- [ ] `NODE_ENV` - Set to `production`
- [ ] `FRONTEND_URL` - Your frontend URL

### Backend (Optional)
- [ ] `REDIS_URL` - If using Redis

### Frontend (Required)
- [ ] `NEXT_PUBLIC_API_URL` - Your backend API URL
- [ ] `NEXT_PUBLIC_RAZORPAY_KEY_ID` - From Razorpay dashboard

---

## 🔐 Security Checklist

- [ ] Strong JWT secrets (32+ characters, random)
- [ ] Razorpay keys are correct (test/live)
- [ ] `NODE_ENV` set to `production`
- [ ] Database uses Internal URL (not exposed)
- [ ] CORS configured correctly
- [ ] HTTPS enabled (automatic on Render)
- [ ] Environment variables not exposed in code

---

## 📊 Service URLs Reference

After deployment, you'll have:

- **Database:** Internal only (not accessible externally)
- **Backend:** `https://morpankh-saree-backend.onrender.com`
- **Frontend:** `https://morpankh-saree-frontend.onrender.com`
- **Health Check:** `https://morpankh-saree-backend.onrender.com/health`

---

## 💰 Cost Estimation

### Free Tier (Development)
- Backend: Free (with limitations)
- Frontend: Free (static site)
- Database: Free (90 days trial)
- **Total:** Free for 90 days

### Production (Starter Plan)
- Backend: $7/month
- Frontend: $7/month (or free if static)
- Database: $7/month
- **Total:** ~$14-21/month

---

## 🎉 Success Checklist

- [ ] Database created and running
- [ ] Backend deployed and healthy
- [ ] Frontend deployed and accessible
- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] Services connected (CORS working)
- [ ] Health check passing
- [ ] User registration works
- [ ] Products load correctly
- [ ] Payment gateway configured
- [ ] Admin user created
- [ ] Custom domain configured (if applicable)

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Prisma with Render](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-render)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Razorpay Integration](https://razorpay.com/docs/)

---

## 🆘 Need Help?

1. Check service logs in Render dashboard
2. Review troubleshooting section above
3. Check Render status page
4. Contact Render support

---

## 🚀 Quick Reference Commands

### Run Migrations
```bash
cd backend && npx prisma migrate deploy
```

### Generate Prisma Client
```bash
cd backend && npx prisma generate
```

### Open Prisma Studio
```bash
cd backend && npx prisma studio
```

### Check Service Health
```bash
curl https://your-backend-url.onrender.com/health
```

---

**Last Updated:** $(date)
**Status:** ✅ Complete - Ready for Production Deployment

---

## 🎯 Summary

### Method 1: Deploy Together on ONE URL (Recommended) ⭐
1. **Deploy Blueprint** → Creates Database + Single Service (Backend + Frontend)
2. **Set Environment Variables** → Add JWT secrets, Razorpay keys
3. **Run Migrations** → Apply database schema
4. **Verify** → Test all endpoints
5. **Done!** 🎉 Everything on one URL!

**Your Single URL:** `https://morpankh-saree.onrender.com`
- Frontend: `https://morpankh-saree.onrender.com`
- API: `https://morpankh-saree.onrender.com/api/*`

### Method 2: Deploy Separately (Alternative)
1. **Create Database** → Get Internal URL
2. **Deploy Backend** → Set environment variables → Run migrations
3. **Deploy Frontend** → Set environment variables
4. **Connect Services** → Update CORS and API URLs
5. **Verify** → Test all endpoints
6. **Done!** 🎉

**Recommended:** Use Method 1 (Blueprint) - Everything on one URL!

