# Guest Order Migration Guide

This migration adds support for guest orders by making the `userId` field optional in the `orders` table and adding guest information fields.

## Database Migration SQL

Run the following SQL to update your database schema:

```sql
-- Step 1: Add new columns for guest information
ALTER TABLE "orders" 
  ADD COLUMN "guestEmail" TEXT,
  ADD COLUMN "guestPhone" TEXT,
  ADD COLUMN "guestName" TEXT;

-- Step 2: Make userId nullable (optional)
-- First, ensure all existing orders have a userId (they should, but let's be safe)
UPDATE "orders" SET "userId" = (SELECT "id" FROM "users" WHERE "role" = 'CUSTOMER' LIMIT 1) 
WHERE "userId" IS NULL;

-- Now make the column nullable
ALTER TABLE "orders" 
  ALTER COLUMN "userId" DROP NOT NULL;

-- Step 3: Update the foreign key constraint to allow null
-- First, drop the existing foreign key constraint
ALTER TABLE "orders" 
  DROP CONSTRAINT IF EXISTS "orders_userId_fkey";

-- Recreate the foreign key with ON DELETE SET NULL to handle guest orders
ALTER TABLE "orders" 
  ADD CONSTRAINT "orders_userId_fkey" 
  FOREIGN KEY ("userId") REFERENCES "users"("id") 
  ON DELETE SET NULL 
  ON UPDATE CASCADE;
```

## Prisma Migration

After updating the schema file, run:

```bash
cd backend
npx prisma migrate dev --name add_guest_orders
npx prisma generate
```

## Verification

After migration, verify that:
1. Guest orders can be created with null `userId`
2. Guest information fields are properly stored
3. Existing orders with `userId` still work correctly

## Rollback (if needed)

```sql
-- Rollback: Make userId required again (only if no guest orders exist)
ALTER TABLE "orders" 
  ALTER COLUMN "userId" SET NOT NULL;

-- Remove guest columns
ALTER TABLE "orders" 
  DROP COLUMN IF EXISTS "guestEmail",
  DROP COLUMN IF EXISTS "guestPhone",
  DROP COLUMN IF EXISTS "guestName";
```

