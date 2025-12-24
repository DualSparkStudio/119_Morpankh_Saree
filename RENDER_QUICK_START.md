# Render Quick Start Guide

## 🚀 Deploy Everything Together (Recommended)

### Option 1: One-Click Deployment with render.yaml

1. **Push `render.yaml` to your GitHub repository**
2. Go to Render Dashboard → **New** → **Blueprint**
3. Connect your GitHub repository
4. Render will automatically detect `render.yaml`
5. Review and deploy all services at once:
   - ✅ PostgreSQL Database
   - ✅ Backend API
   - ✅ Frontend
6. **Set these environment variables manually:**
   - `JWT_SECRET` (generate 32+ char string)
   - `JWT_REFRESH_SECRET` (generate 32+ char string)
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `REDIS_URL` (optional)
7. After deployment, run migrations:
   - Go to Backend Service → **Shell**
   - Run: `cd backend && npx prisma migrate deploy`

**That's it!** Both services deploy together. 🎉

---

## 🚀 Deploy Separately (Alternative)

### Step 1: Create PostgreSQL Database

1. Render Dashboard → **New** → **PostgreSQL**
2. Name: `morpankh-saree-db`
3. Region: Mumbai
4. **Copy Internal Database URL** (you'll need this)

---

### Step 2: Deploy Backend

1. Render Dashboard → **New** → **Web Service**
2. Connect GitHub repo
3. Settings:
   - **Name:** `morpankh-saree-backend`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build && npx prisma generate`
   - **Start Command:** `npm start`
4. Environment Variables:
   ```
   DATABASE_URL=<Internal URL from Step 1>
   JWT_SECRET=<generate-32-char-random-string>
   JWT_REFRESH_SECRET=<generate-32-char-random-string>
   RAZORPAY_KEY_ID=<your-key>
   RAZORPAY_KEY_SECRET=<your-secret>
   PORT=10000
   NODE_ENV=production
   FRONTEND_URL=https://morpankh-saree-frontend.onrender.com
   ```
5. After deployment, run migrations:
   - Go to Service → **Shell**
   - Run: `cd backend && npx prisma migrate deploy`

---

### Step 3: Deploy Frontend

1. Render Dashboard → **New** → **Static Site**
2. Connect GitHub repo
3. Settings:
   - **Name:** `morpankh-saree-frontend`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `.next`
4. Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://morpankh-saree-backend.onrender.com/api
   NEXT_PUBLIC_RAZORPAY_KEY_ID=<your-key>
   ```

---

### Step 4: Update URLs

1. **Backend:** Update `FRONTEND_URL` with your frontend URL
2. **Frontend:** Update `NEXT_PUBLIC_API_URL` with your backend URL

---

### Step 5: Test

- Backend: `https://your-backend.onrender.com/health`
- Frontend: `https://your-frontend.onrender.com`

---

## 📝 Important Notes

- Use **Internal Database URL** (not external) for `DATABASE_URL`
- Generate strong JWT secrets (32+ characters)
- Run migrations after first backend deployment
- Update CORS settings after both services are deployed

---

## 🔗 Full Guide

See `RENDER_DEPLOYMENT_GUIDE.md` for detailed instructions.

