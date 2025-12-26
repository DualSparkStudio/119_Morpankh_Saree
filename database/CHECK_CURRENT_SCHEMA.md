# How to Check Current Database Schema

This guide shows you multiple ways to check the current schema of your Render PostgreSQL database.

## Method 1: Using Prisma (Recommended - Easiest)

### Option A: Prisma Studio (Visual GUI)

1. **Get Database Connection String**
   - Go to Render dashboard → `morpankh-saree-db` database
   - Copy the **"External Database URL"**

2. **Set Up Local Environment**
   ```bash
   cd backend
   ```
   
   Create or update `.env` file:
   ```env
   DATABASE_URL="postgresql://username:password@hostname:port/database_name"
   ```
   (Use the External Database URL from Render)

3. **Open Prisma Studio**
   ```bash
   npx prisma studio
   ```
   
   This opens a web interface at `http://localhost:5555` where you can:
   - Browse all tables visually
   - See table structures
   - View and edit data
   - See relationships between tables

### Option B: Prisma Introspect (Generate Schema from Database)

This pulls the current database schema and generates a Prisma schema file:

```bash
cd backend
npx prisma db pull
```

This will:
- Connect to your database
- Read all tables, columns, types, and relationships
- Update `prisma/schema.prisma` to match the current database state

**Note**: This overwrites your current `schema.prisma`, so commit your changes first!

### Option C: Prisma Validate (Check Schema Match)

Check if your Prisma schema matches the database:

```bash
cd backend
npx prisma validate
npx prisma migrate status
```

This shows:
- If schema is valid
- Migration status
- Any drift between schema and database

## Method 2: Using psql (Command Line)

### Step 1: Connect to Database

1. **Get Database Connection String**
   - Go to Render dashboard → `morpankh-saree-db`
   - Copy the **"External Database URL"**

2. **Connect Using psql**
   ```bash
   psql "postgresql://username:password@hostname:port/database_name"
   ```

### Step 2: Check Schema

Once connected, use these commands:

#### List All Tables
```sql
\dt
```
Shows all tables in the database.

#### Describe a Specific Table
```sql
\d table_name
\d users
\d products
\d orders
```
Shows:
- Column names and types
- Constraints (primary keys, foreign keys)
- Indexes
- Default values

#### List All Tables with Details
```sql
\dt+
```
Shows tables with additional information (size, description).

#### Check All Enums
```sql
SELECT typname FROM pg_type WHERE typtype = 'e';
```
Shows all enum types (UserRole, OrderStatus, etc.).

#### Get Full Table Structure
```sql
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;
```

#### List All Foreign Keys
```sql
SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE constraint_type = 'FOREIGN KEY';
```

#### List All Indexes
```sql
SELECT
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

#### Get Complete Schema Export
```sql
-- Export full schema to a file (run from command line, not psql)
pg_dump "postgresql://username:password@hostname:port/database_name" --schema-only > schema_export.sql
```

#### Exit psql
```sql
\q
```

## Method 3: Using pgAdmin (GUI Tool)

1. **Download pgAdmin**
   - Visit https://www.pgadmin.org/
   - Download and install

2. **Add Server**
   - Right-click "Servers" → "Create" → "Server"
   - **General Tab**:
     - Name: `Render - Morpankh Saree`
   - **Connection Tab**:
     - Host: From External Database URL
     - Port: From External Database URL
     - Database: `morpankh_saree`
     - Username: From External Database URL
     - Password: From External Database URL
   - Click "Save"

3. **Browse Schema**
   - Expand: Servers → Render - Morpankh Saree → Databases → morpankh_saree → Schemas → public → Tables
   - Click on any table to see:
     - Columns
     - Constraints
     - Indexes
     - Data

4. **Query Tool**
   - Right-click database → "Query Tool"
   - Run SQL queries to inspect schema

## Method 4: Using Render Dashboard (Limited)

1. **Go to Database**
   - Render dashboard → `morpankh-saree-db`

2. **Database Browser** (if available)
   - Some Render plans include a basic database browser
   - Limited functionality compared to other tools

## Method 5: Using SQL Queries (Programmatic)

### Get All Tables and Their Row Counts
```sql
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

### Get Complete Schema Information
```sql
SELECT
    t.table_name,
    c.column_name,
    c.data_type,
    c.character_maximum_length,
    c.is_nullable,
    c.column_default,
    CASE 
        WHEN pk.column_name IS NOT NULL THEN 'YES'
        ELSE 'NO'
    END AS is_primary_key
FROM information_schema.tables t
JOIN information_schema.columns c ON t.table_name = c.table_name
LEFT JOIN (
    SELECT ku.table_name, ku.column_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage ku
        ON tc.constraint_name = ku.constraint_name
    WHERE tc.constraint_type = 'PRIMARY KEY'
) pk ON c.table_name = pk.table_name AND c.column_name = pk.column_name
WHERE t.table_schema = 'public'
ORDER BY t.table_name, c.ordinal_position;
```

## Quick Reference Commands

### Prisma Commands
```bash
# Open visual database browser
npx prisma studio

# Pull schema from database (overwrites schema.prisma)
npx prisma db pull

# Check migration status
npx prisma migrate status

# Validate schema
npx prisma validate
```

### psql Commands
```sql
\dt              -- List all tables
\d table_name    -- Describe table structure
\l               -- List all databases
\du              -- List all users
\dn              -- List all schemas
\df              -- List all functions
\dv              -- List all views
\q               -- Exit psql
```

### Export Schema
```bash
# Export schema only (no data)
pg_dump "postgresql://user:pass@host:port/db" --schema-only > schema.sql

# Export full database (schema + data)
pg_dump "postgresql://user:pass@host:port/db" > full_backup.sql
```

## Recommended Workflow

1. **For Quick Visual Check**: Use `npx prisma studio`
2. **For Detailed Analysis**: Use `psql` with `\d` commands
3. **For Schema Comparison**: Use `npx prisma db pull` to see differences
4. **For Documentation**: Export schema using `pg_dump --schema-only`

## Troubleshooting

### Can't Connect to Database?
- Verify you're using the **External Database URL** (for local connections)
- Check if your IP is whitelisted (if required)
- Verify database is running in Render dashboard

### Prisma Studio Not Opening?
- Make sure `DATABASE_URL` is set in `.env`
- Check database connection string is correct
- Try `npx prisma generate` first

### psql Command Not Found?
- **Windows**: Install PostgreSQL from https://www.postgresql.org/download/windows/
- **Mac**: `brew install postgresql`
- **Linux**: `sudo apt-get install postgresql-client`

---

**Tip**: For regular monitoring, set up `npx prisma studio` as a bookmark - it's the fastest way to check your database schema and data!

