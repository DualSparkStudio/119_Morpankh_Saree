# Database Migration Instructions

## Issue
The database is missing columns for guest orders: `guestEmail`, `guestPhone`, and `guestName`.

## Solution
Run the migration SQL file to add these columns to your production database.

## Option 1: Using Prisma Migrate (Recommended)

### On Render (Production)
1. Connect to your Render service via SSH or use Render's database console
2. Navigate to your backend directory
3. Run:
```bash
npx prisma migrate deploy
```

Or if you prefer to push the schema directly:
```bash
npx prisma db push
```

## Option 2: Run SQL Directly

### Using Render Database Console
1. Go to your Render dashboard
2. Select your PostgreSQL database
3. Click on "Connect" or "Console"
4. Copy and paste the SQL from `backend/prisma/migrations/add_guest_order_columns.sql`
5. Execute the SQL

### Using psql (if you have database connection string)
```bash
psql $DATABASE_URL -f backend/prisma/migrations/add_guest_order_columns.sql
```

## Option 3: Using Prisma Studio (if available)
1. Run `npx prisma studio`
2. Use the UI to inspect and manually add columns (not recommended)

## Verification
After running the migration, verify the columns exist:
```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name IN ('guestEmail', 'guestPhone', 'guestName');
```

## Note
The `userId` column should already be nullable, but the migration ensures it is. If you get an error about `userId` already being nullable, you can ignore it.

