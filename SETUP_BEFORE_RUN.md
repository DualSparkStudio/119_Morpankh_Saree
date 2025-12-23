# ⚠️ Setup Required Before Running

## Critical: Create Environment Files

Since environment files are protected, you need to create them manually:

### 1. Create `backend/.env`

Create a file named `.env` in the `backend` folder with this content:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/morpankh_saree"
REDIS_URL=""
JWT_SECRET="dev-jwt-secret-key-change-in-production-min-32-chars-please"
JWT_REFRESH_SECRET="dev-refresh-secret-key-change-in-production-min-32-chars"
RAZORPAY_KEY_ID=""
RAZORPAY_KEY_SECRET=""
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

**Important:** Update `DATABASE_URL` with your PostgreSQL credentials!

### 2. Create `frontend/.env.local`

Create a file named `.env.local` in the `frontend` folder with this content:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=
```

### 3. Set Up Database

Before running the backend, you need:

1. **PostgreSQL installed and running**
2. **Create the database:**
   ```sql
   CREATE DATABASE morpankh_saree;
   ```
3. **Run migrations:**
   ```bash
   cd backend
   npx prisma migrate dev --name init
   ```

### 4. Run the Servers

Once environment files are created and database is set up, you can run:

**Option 1: Use the script (Windows)**
```bash
.\run.ps1
```
or
```bash
.\run.bat
```

**Option 2: Manual start**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

**Option 3: From root (if concurrently installed)**
```bash
npm run dev
```

### 5. Access the Website

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

---

## Quick Checklist

- [ ] Created `backend/.env` file
- [ ] Updated `DATABASE_URL` in `backend/.env`
- [ ] Created `frontend/.env.local` file
- [ ] PostgreSQL is running
- [ ] Database `morpankh_saree` is created
- [ ] Ran `npx prisma migrate dev` in backend folder
- [ ] Servers are running

---

**Need help?** See QUICK_START.md for detailed instructions.

