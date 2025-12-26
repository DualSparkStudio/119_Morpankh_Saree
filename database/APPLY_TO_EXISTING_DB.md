# Apply Schema to Existing Render Database

This guide shows you how to apply the database schema to your **existing** `morpankh-saree-db` database on Render.

## ✅ Automatic Application is Already Configured!

**Good news!** Your `render.yaml` is already set up to apply schema changes automatically on every deployment. You don't need to do anything manually!

### How It Works Automatically

Your `render.yaml` has this in the start command:
```yaml
startCommand: cd backend && (npx prisma migrate deploy 2>/dev/null || npx prisma db push 2>/dev/null) && npm start
```

**What this does:**
1. First tries `prisma migrate deploy` (if migration files exist)
2. If no migrations, falls back to `prisma db push` (pushes schema directly)
3. Then starts your application

**This means:**
- ✅ Every time you deploy, schema changes are applied automatically
- ✅ No manual database commands needed
- ✅ Schema stays in sync with your code

### To Apply Schema Changes

**Just deploy your code!** That's it. The schema will be applied automatically.

**Steps:**
1. Make sure your Prisma schema (`backend/prisma/schema.prisma`) is up to date
2. **Commit and push your changes:**
   ```bash
   git add .
   git commit -m "Update database schema"
   git push
   ```
3. **Trigger deployment on Render:**
   - **Option A (Auto-deploy)**: If auto-deploy is enabled, Render will automatically deploy
   - **Option B (Manual)**: Go to Render dashboard → `morpankh-saree` service → Click **"Manual Deploy"** → **"Deploy latest commit"**
4. **Check deployment logs** to verify schema was applied:
   - Look for: `✅ Applied migration` or `✅ Database schema is up to date`

**That's it!** The schema is now applied automatically. 🎉

---

## Manual Methods (If Needed)

If you need to apply schema manually (for testing, troubleshooting, etc.), here are the options:

### Option 2: Apply Locally First (Recommended for Testing)

1. **Get Your Database Connection String**
   - Go to Render dashboard → `morpankh-saree-db` database
   - Scroll to **"Connections"** section
   - Copy the **"External Database URL"** (for local connection)

2. **Set Up Local Environment**
   ```bash
   cd backend
   ```
   
   Create or update `.env` file:
   ```env
   DATABASE_URL="postgresql://username:password@hostname:port/database_name"
   ```
   (Use the External Database URL from Render)

3. **Apply Schema Using Prisma**
   
   **For Development (creates migration files):**
   ```bash
   npx prisma migrate dev --name init
   ```
   
   **OR for Production (applies existing migrations):**
   ```bash
   npx prisma migrate deploy
   ```
   
   **OR push schema directly (no migration files):**
   ```bash
   npx prisma db push
   ```

4. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

5. **Verify Schema Applied**
   ```bash
   npx prisma studio
   ```
   This opens a GUI where you can see all your tables.

## Manual Method (Using SQL File)

If you prefer to apply the SQL schema directly:

### Step 1: Get Database Connection String

1. Go to Render dashboard → `morpankh-saree-db`
2. Scroll to **"Connections"** section
3. Copy the **"External Database URL"**

### Step 2: Connect and Apply Schema

**Using psql (Command Line):**

1. **Install psql** (if not installed):
   - Windows: Install PostgreSQL from https://www.postgresql.org/download/windows/
   - Mac: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql-client`

2. **Connect to Database:**
   ```bash
   psql "postgresql://username:password@hostname:port/database_name"
   ```
   (Use the External Database URL from Render)

3. **Check Current Tables (Optional):**
   ```sql
   \dt
   ```

4. **Apply Schema:**
   ```sql
   \i database/schema.sql
   ```
   
   Or if you're in the project root:
   ```bash
   psql "postgresql://username:password@hostname:port/database_name" -f database/schema.sql
   ```

**Using pgAdmin (GUI Tool):**

1. Download pgAdmin from https://www.pgadmin.org/
2. Add new server:
   - Name: `Render - Morpankh Saree`
   - Host: From your External Database URL
   - Port: From your External Database URL
   - Database: `morpankh_saree`
   - Username: From your External Database URL
   - Password: From your External Database URL
3. Connect to the database
4. Right-click on database → **Query Tool**
5. Open `database/schema.sql` file
6. Execute the query (F5)

## Verify Schema Was Applied

### Check Tables
```sql
\dt
-- Should show: users, products, orders, categories, etc.
```

### Check Enums
```sql
SELECT typname FROM pg_type WHERE typtype = 'e';
-- Should show: UserRole, OrderStatus, PaymentStatus, PaymentMethod, StockType, TransactionType
```

### Check Specific Table Structure
```sql
\d users
\d products
\d orders
```

## Important Notes

### ⚠️ If Database Already Has Tables

If your database already has some tables (maybe from a previous setup):

1. **Option A: Drop and Recreate (⚠️ Deletes all data)**
   ```sql
   -- Connect to database
   -- Drop all tables (be careful - this deletes data!)
   DROP SCHEMA public CASCADE;
   CREATE SCHEMA public;
   GRANT ALL ON SCHEMA public TO postgres;
   GRANT ALL ON SCHEMA public TO public;
   
   -- Then apply schema
   \i database/schema.sql
   ```

2. **Option B: Use Prisma Migrate (Safer - Preserves data)**
   - Prisma will detect existing tables
   - It will only add missing tables/columns
   - Won't delete existing data
   ```bash
   npx prisma migrate dev
   ```

3. **Option C: Manual Migration (Most Control)**
   - Check what tables exist: `\dt`
   - Compare with schema.sql
   - Manually add missing tables/columns
   - Or use Prisma's introspection: `npx prisma db pull` to see current state

### 🔄 Updating Existing Schema

If you need to update the schema later:

1. **Update Prisma Schema** (`backend/prisma/schema.prisma`)
2. **Create Migration:**
   ```bash
   npx prisma migrate dev --name update_schema
   ```
3. **Apply to Render:**
   - Push changes to git
   - Render will auto-deploy and run migrations

## Troubleshooting

### Error: "relation already exists"
- The table already exists in the database
- Use Prisma migrate instead: `npx prisma migrate dev`
- Or drop existing tables first (⚠️ deletes data)

### Error: "enum already exists"
- The enum type already exists
- Prisma will handle this automatically
- Or manually drop: `DROP TYPE "UserRole" CASCADE;`

### Error: "permission denied"
- Check database user permissions
- Ensure you're using the correct connection string
- Verify user has CREATE privileges

### Connection Issues
- Use **External Database URL** for local connections
- Use **Internal Database URL** for Render services
- Check firewall/network settings
- Verify database is running (check Render dashboard)

## Recommended Workflow

1. **Development:**
   ```bash
   # Make changes to schema.prisma
   npx prisma migrate dev --name descriptive_name
   npx prisma generate
   ```

2. **Production (Render):**
   - Push changes to git
   - Render auto-deploys
   - `prisma migrate deploy` runs automatically (from render.yaml)

## Quick Commands Reference

```bash
# Check current database state
npx prisma db pull

# Create and apply migration
npx prisma migrate dev --name migration_name

# Apply migrations (production)
npx prisma migrate deploy

# Push schema without migrations
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio (GUI)
npx prisma studio

# Format Prisma schema
npx prisma format

# Validate Prisma schema
npx prisma validate
```

---

**Next Steps:**
- After applying schema, verify tables exist
- Test your application connection
- Seed initial data if needed
- **Check current schema**: See `CHECK_CURRENT_SCHEMA.md` for how to inspect your database schema

