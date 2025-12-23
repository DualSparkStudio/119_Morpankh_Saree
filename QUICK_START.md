# Quick Start Guide

## 🚀 Running the Website Locally

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database running (or use SQLite for development)
- Redis (optional, for caching - will work without it)

### Step 1: Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Step 2: Set Up Database

#### Option A: PostgreSQL (Recommended)

1. Create a PostgreSQL database:
```sql
CREATE DATABASE morpankh_saree;
```

2. Create `backend/.env` file:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/morpankh_saree"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production"
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-key-secret"
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

#### Option B: SQLite (Quick Start)

Create `backend/.env`:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="dev-secret-key-change-in-production"
JWT_REFRESH_SECRET="dev-refresh-secret-change-in-production"
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

Then update `backend/prisma/schema.prisma`:
```prisma
datasource db {
  provider = "sqlite"  // Change from "postgresql"
  url      = env("DATABASE_URL")
}
```

### Step 3: Generate Prisma Client & Run Migrations

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
```

### Step 4: Create Frontend Environment File

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key-id
```

### Step 5: Run the Development Servers

#### Option 1: Run Both Together (from root)
```bash
npm run dev
```

#### Option 2: Run Separately

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

### Step 6: Access the Website

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health
- **Admin Panel:** http://localhost:3000/admin (requires admin login)

### Step 7: Create Admin User

You can create an admin user directly in the database:

```sql
-- First create a user via API registration, then update role:
UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

Or use Prisma Studio:
```bash
cd backend
npx prisma studio
```

## 🔧 Troubleshooting

### Backend won't start
- Check if `.env` file exists in `backend/` directory
- Verify DATABASE_URL is correct
- Make sure Prisma client is generated: `npx prisma generate`
- Check if port 5000 is available

### Frontend won't start
- Check if `.env.local` file exists in `frontend/` directory
- Verify NEXT_PUBLIC_API_URL points to backend
- Check if port 3000 is available

### Database connection errors
- Verify PostgreSQL is running
- Check DATABASE_URL credentials
- Ensure database exists
- Try running migrations again: `npx prisma migrate dev`

### Redis errors (non-critical)
- Redis is optional for development
- The app will work without Redis (caching just won't work)
- You can ignore Redis connection errors during development

## 📝 Next Steps

1. Visit http://localhost:3000 to see the homepage
2. Register a user account
3. Add some products via admin panel
4. Test the shopping flow

---

**Need help?** Check the main README.md and SETUP_GUIDE.md for more details.

