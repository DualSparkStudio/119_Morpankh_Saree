# 🚀 Starting the Website

## Quick Start

### 1. Create Environment Files

**Backend (`backend/.env`):**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/morpankh_saree"
REDIS_URL=""
JWT_SECRET="dev-jwt-secret-key-change-in-production-min-32-chars"
JWT_REFRESH_SECRET="dev-refresh-secret-key-change-in-production-min-32-chars"
RAZORPAY_KEY_ID=""
RAZORPAY_KEY_SECRET=""
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

**Frontend (`frontend/.env.local`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=
```

### 2. Set Up Database

Create a PostgreSQL database and update `DATABASE_URL` in `backend/.env`, then run:

```bash
cd backend
npx prisma migrate dev --name init
```

### 3. Run Both Servers

From the root directory:
```bash
npm run dev
```

Or run separately:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 4. Access the Website

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

---

**Note:** Make sure PostgreSQL is running before starting the backend!

