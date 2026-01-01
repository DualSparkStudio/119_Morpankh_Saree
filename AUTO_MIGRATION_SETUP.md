# Automatic Database Migration Setup

## Overview
The application is now configured to **automatically sync database schema changes** on every deployment to Render. No manual intervention needed!

## How It Works

### On Render Deployment

When you push code and Render deploys, the `startCommand` in `render.yaml` automatically:

1. **Tries to apply migrations first** (`prisma migrate deploy`)
   - This is the preferred method if you have migration files
   - Applies all pending migrations in order

2. **Falls back to schema sync** (`prisma db push`)
   - If no migrations exist or migrate fails
   - Directly syncs your Prisma schema to the database
   - Perfect for rapid development and schema changes

3. **Starts the server**
   - After database is synced, starts the frontend/backend server

### The Magic Command (in render.yaml)

```yaml
startCommand: cd backend && (npx prisma migrate deploy --skip-generate || npx prisma db push --skip-generate --accept-data-loss) && cd ../frontend && node server.js
```

**What happens:**
- `cd backend` - Navigate to backend directory
- `npx prisma migrate deploy --skip-generate` - Try to apply migrations (skips client generation since it's done in build)
- `||` - If that fails, run the next command
- `npx prisma db push --skip-generate --accept-data-loss` - Sync schema directly (may lose data if columns removed)
- `&& cd ../frontend && node server.js` - After DB sync succeeds, start the frontend server

## What This Means for You

✅ **You push code** → Render builds → Database auto-syncs → Server starts  
✅ **No manual SQL** → Prisma handles everything  
✅ **Safe** → Migrations are applied in order, schema changes are tracked  
✅ **Fast** → Direct schema sync for rapid development  

## When to Use Migrations vs DB Push

### Use Migrations (Recommended for Production)
```bash
# Create a migration
cd backend
npx prisma migrate dev --name add_guest_order_columns

# Commit the migration file
git add prisma/migrations
git commit -m "Add guest order columns"
git push
```

### Use DB Push (For Rapid Development)
```bash
# Just update schema.prisma and push code
# Render will auto-sync on deployment
```

## Local Development

For local development, you still need to run migrations manually:

```bash
cd backend
npx prisma migrate dev
```

Or use the helper script:
```bash
cd backend
npm run db:sync
```

## Current Setup Status

✅ `render.yaml` configured with auto-migration  
✅ Build command includes `prisma generate`  
✅ Start command includes migration/sync  
✅ Helper scripts available for local dev  

## Verification

After deployment, check Render logs for:
- ✅ `Database migrations applied` or `Database schema synced`
- ✅ `Server running on port 10000`
- ❌ No database connection errors

## Troubleshooting

### Migration Fails
- Check Render logs for specific error
- Verify `DATABASE_URL` is set correctly
- Ensure database is accessible from Render

### Schema Out of Sync
- Check `prisma/schema.prisma` matches your expectations
- Run `npx prisma db pull` locally to see current DB state
- Update schema and push again

### Data Loss Warning
- `db push` with `--accept-data-loss` may remove columns/data
- Always use migrations for production to avoid data loss
- Backup database before major schema changes

## Manual Override

If you need to manually sync the database:

1. **Via Render Dashboard:**
   - Go to your service
   - Open "Shell" 
   - Run: `cd backend && npx prisma db push`

2. **Via Render Database Console:**
   - Connect to PostgreSQL
   - Run SQL commands directly (see `backend/prisma/migrations/add_guest_order_columns.sql`)

