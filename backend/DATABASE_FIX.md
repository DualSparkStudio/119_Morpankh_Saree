# Fix Database Schema for Guest Orders

## Problem
The database is missing the `guestEmail`, `guestPhone`, and `guestName` columns in the `orders` table.

## Quick Fix (Recommended for Production)

### Option 1: Using Prisma DB Push (Easiest)
This will sync your schema directly to the database:

```bash
cd backend
npx prisma db push
```

**Note:** Make sure your `DATABASE_URL` environment variable is set correctly in Render.

### Option 2: Run SQL Migration
If `db push` doesn't work, run this SQL directly in your Render database console:

```sql
ALTER TABLE "orders" 
ADD COLUMN IF NOT EXISTS "guestEmail" TEXT,
ADD COLUMN IF NOT EXISTS "guestPhone" TEXT,
ADD COLUMN IF NOT EXISTS "guestName" TEXT;

ALTER TABLE "orders" 
ALTER COLUMN "userId" DROP NOT NULL;
```

### Option 3: Using Prisma Migrate
Create and apply a migration:

```bash
cd backend
npx prisma migrate dev --name add_guest_order_columns
```

Then deploy to production:
```bash
npx prisma migrate deploy
```

## How to Access Render Database

1. **Via Render Dashboard:**
   - Go to your Render dashboard
   - Select your PostgreSQL database service
   - Click "Connect" or find the database URL
   - Use the Render Shell or Database Console

2. **Via Environment Variables:**
   - In your Render service, go to "Environment"
   - Copy the `DATABASE_URL`
   - Use it with `psql` or any PostgreSQL client

## After Running the Migration

1. Regenerate Prisma Client:
```bash
npx prisma generate
```

2. Restart your backend service on Render

3. Test the order creation again

## Verify Migration Success

Run this query in your database:
```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name IN ('guestEmail', 'guestPhone', 'guestName', 'userId');
```

You should see all 4 columns listed.

