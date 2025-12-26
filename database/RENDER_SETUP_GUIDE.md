# Render Managed PostgreSQL Setup Guide

This guide will walk you through setting up the Morpankh Saree database on Render's Managed PostgreSQL service.

## Prerequisites

- A Render account (sign up at https://render.com if you don't have one)
- Access to your Render dashboard
- Basic knowledge of PostgreSQL

## Step 1: Create a PostgreSQL Database on Render

1. **Log in to Render Dashboard**
   - Go to https://dashboard.render.com
   - Sign in with your account

2. **Create New Database**
   - Click the **"New +"** button in the top right
   - Select **"PostgreSQL"** from the dropdown

3. **Configure Database Settings**
   - **Name**: `morpankh-saree-db` (or your preferred name)
   - **Database**: `morpankh_saree` (or your preferred database name)
   - **User**: `morpankh_user` (or your preferred username)
   - **Region**: Choose the closest region to your users (e.g., `Singapore` for India)
   - **PostgreSQL Version**: Select the latest stable version (recommended: 15 or 16)
   - **Plan**: 
     - **Free**: 90-day trial, then $7/month (suitable for development)
     - **Starter**: $20/month (better for production)
     - **Standard**: $60/month (for high-traffic production)

4. **Create the Database**
   - Click **"Create Database"**
   - Wait for the database to be provisioned (usually 1-2 minutes)

## Step 2: Get Database Connection String

1. **Navigate to Your Database**
   - In the Render dashboard, click on your newly created database

2. **Copy Connection String**
   - Scroll down to the **"Connections"** section
   - You'll see an **"Internal Database URL"** and **"External Database URL"**
   - **For Render services**: Use the **Internal Database URL**
   - **For local development**: Use the **External Database URL**
   - The connection string format is:
     ```
     postgresql://username:password@hostname:port/database_name
     ```

3. **Save Connection Details**
   - Copy the connection string
   - Save it securely (you'll need it for environment variables)

## Step 3: Apply Database Schema

You have two options to apply the schema:

### Option A: Using Prisma (Recommended)

If you're using Prisma (which this project does), this is the recommended approach:

1. **Set Environment Variable**
   - In your Render service or locally, set the `DATABASE_URL` environment variable:
     ```
     DATABASE_URL=postgresql://username:password@hostname:port/database_name
     ```

2. **Run Prisma Migrate**
   ```bash
   cd backend
   npx prisma migrate deploy
   ```
   Or for development:
   ```bash
   npx prisma migrate dev
   ```

3. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

### Option B: Using SQL File Directly

If you want to apply the schema manually using the SQL file:

1. **Connect to Database**
   - You can use:
     - **psql** command line tool
     - **pgAdmin** (GUI tool)
     - **Render's built-in database browser** (limited)
     - Any PostgreSQL client

2. **Using psql (Command Line)**
   ```bash
   # Connect to your database
   psql "postgresql://username:password@hostname:port/database_name"
   
   # Run the schema file
   \i database/schema.sql
   ```
   
   Or directly:
   ```bash
   psql "postgresql://username:password@hostname:port/database_name" -f database/schema.sql
   ```

3. **Using pgAdmin**
   - Connect to your database using the External Database URL
   - Open Query Tool
   - Copy and paste the contents of `database/schema.sql`
   - Execute the query

4. **Using Render's Database Browser** (Limited)
   - In Render dashboard, go to your database
   - Click on "Connect" or "Database Browser"
   - Note: This has limited functionality, so use psql or pgAdmin for full SQL execution

## Step 4: Configure Your Application

### For Render Web Services

1. **Add Database as Environment Variable**
   - Go to your Render web service
   - Navigate to **"Environment"** tab
   - Add environment variable:
     - **Key**: `DATABASE_URL`
     - **Value**: Use the **Internal Database URL** from your database
     - Or use Render's database reference:
       - **Key**: `DATABASE_URL`
       - **Value**: Select "Link to Database" and choose your database
       - Render will automatically inject the connection string

2. **Update render.yaml** (if using)
   - Your `render.yaml` should already have the database configuration:
     ```yaml
     databases:
       - name: morpankh-saree-db
         databaseName: morpankh_saree
         user: morpankh_user
     ```
   - The web service will automatically get the `DATABASE_URL` from the linked database

### For Local Development

1. **Create .env file** (if not exists)
   ```bash
   cd backend
   touch .env
   ```

2. **Add DATABASE_URL**
   ```env
   DATABASE_URL=postgresql://username:password@hostname:port/database_name
   ```
   Use the **External Database URL** from Render

3. **Run Prisma Commands**
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

## Step 5: Verify Database Setup

1. **Check Tables**
   ```sql
   -- Connect to database and run:
   \dt
   -- Should show all tables: users, products, orders, etc.
   ```

2. **Check Enums**
   ```sql
   SELECT typname FROM pg_type WHERE typtype = 'e';
   -- Should show: UserRole, OrderStatus, PaymentStatus, etc.
   ```

3. **Test Connection from Application**
   - Start your application
   - Check logs for any database connection errors
   - Try creating a test user or product

## Step 6: Database Maintenance

### Backup

Render automatically backs up your database:
- **Free tier**: Daily backups (retained for 7 days)
- **Paid tiers**: More frequent backups with longer retention

To manually backup:
1. Go to your database in Render dashboard
2. Click **"Backups"** tab
3. Click **"Create Backup"**

### Restore

1. Go to **"Backups"** tab
2. Select a backup
3. Click **"Restore"**

### Monitoring

- **Metrics**: View database metrics in the Render dashboard
- **Logs**: Check connection logs and query logs
- **Alerts**: Set up alerts for database issues

## Step 7: Security Best Practices

1. **Use Environment Variables**
   - Never commit database credentials to version control
   - Always use environment variables

2. **Use Internal URLs for Render Services**
   - When connecting from Render services, use Internal Database URL
   - This keeps traffic within Render's network

3. **Use External URLs Carefully**
   - External URLs are for local development
   - Consider IP whitelisting if possible
   - Use strong passwords

4. **Regular Updates**
   - Keep PostgreSQL version updated
   - Monitor security advisories

## Troubleshooting

### Connection Issues

**Problem**: Cannot connect to database
- **Solution**: 
  - Verify the connection string is correct
  - Check if you're using Internal URL for Render services
  - Verify database is running (check Render dashboard)
  - Check firewall/network settings

**Problem**: Authentication failed
- **Solution**:
  - Verify username and password
  - Check if database user has proper permissions
  - Try resetting the password in Render dashboard

### Schema Issues

**Problem**: Tables not created
- **Solution**:
  - Check SQL file for syntax errors
  - Verify you're connected to the correct database
  - Check database logs for errors
  - Try running Prisma migrate instead

**Problem**: Foreign key constraints fail
- **Solution**:
  - Ensure tables are created in the correct order
  - Check that referenced tables exist
  - Verify data types match

### Performance Issues

**Problem**: Slow queries
- **Solution**:
  - Check if indexes are created (see schema.sql)
  - Use EXPLAIN ANALYZE to analyze queries
  - Consider upgrading database plan
  - Optimize queries

## Additional Resources

- [Render PostgreSQL Documentation](https://render.com/docs/databases)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## Quick Reference

### Connection String Format
```
postgresql://[user]:[password]@[host]:[port]/[database]
```

### Common Prisma Commands
```bash
# Generate Prisma Client
npx prisma generate

# Create and apply migration
npx prisma migrate dev

# Apply migrations (production)
npx prisma migrate deploy

# Push schema without migrations
npx prisma db push

# Open Prisma Studio (GUI)
npx prisma studio
```

### Common psql Commands
```bash
# Connect to database
psql "postgresql://user:pass@host:port/db"

# List all tables
\dt

# Describe a table
\d table_name

# List all databases
\l

# Exit psql
\q
```

## Support

If you encounter issues:
1. Check Render's status page: https://status.render.com
2. Review Render documentation
3. Check application logs
4. Contact Render support if needed

---

**Last Updated**: 2024
**Database Version**: PostgreSQL 15+
**Schema Version**: 1.0

