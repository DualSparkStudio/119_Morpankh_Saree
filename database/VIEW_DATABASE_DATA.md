# How to View Database Data

This guide explains all the different ways you and your website owners/clients can view and manage database data.

---

## Option 1: Admin Dashboard (RECOMMENDED for Website Owners) ✅

**Best for**: Website owners, clients, non-technical users

Your application **already has a built-in Admin Dashboard**! This is the easiest way for website owners to view data without any technical knowledge.

### ✅ Currently Implemented Pages:
- **Dashboard** (`/admin`) - Overview with stats (orders, products, customers, revenue)
- **Products** (`/admin/products`) - View, add, edit, delete products
- **Orders** (`/admin/orders`) - View all orders, update order status
- **Inventory** (`/admin/inventory`) - Manage stock levels

### 📝 Note: Some menu items may need additional pages:
The admin layout shows additional menu items (Customers, Coupons, Banners, Analytics, Settings) that may need page implementations if not already created.

### How to Access:

1. **Deploy your application** to production (Render, Vercel, etc.)
2. **Login as Admin** user
3. **Visit**: `https://your-website.com/admin`

### What Website Owners Can See:

- ✅ **Dashboard Stats**: Total orders, products, customers, revenue
- ✅ **Products Management**: View, add, edit, delete products
- ✅ **Orders Management**: View all orders, update order status
- ✅ **Inventory Management**: Check stock levels
- ✅ **User Management**: View customers
- ✅ **Categories**: Manage product categories

### Advantages:

- ✅ **No technical knowledge required**
- ✅ **Accessible from anywhere** (just need login credentials)
- ✅ **User-friendly interface**
- ✅ **Secure** (requires admin authentication)
- ✅ **Already built** in your application!

### Setup for Website Owner:

1. Create an admin account in your application
2. Share login credentials securely
3. They can access: `https://your-website.com/admin`

---

## Option 2: Prisma Studio (For Developers)

**Best for**: Developers, technical users who have access to the codebase

### How to Use:

```bash
cd backend
npx prisma studio
```

This opens a web interface at `http://localhost:5555` where you can:
- Browse all tables visually
- View and edit data directly
- See relationships between tables
- Filter and search data

### Advantages:

- ✅ Easy to use
- ✅ Visual interface
- ✅ Great for development

### Disadvantages:

- ❌ Requires access to the codebase
- ❌ Must be run locally or on a server
- ❌ Not ideal for non-technical users
- ❌ Requires `.env` file with database credentials

---

## Option 3: pgAdmin (Desktop GUI Tool)

**Best for**: Technical users, database administrators

### Installation:

1. Download from: https://www.pgadmin.org/
2. Install on Windows/Mac/Linux

### Setup:

1. **Get Database Connection String**
   - Go to Render dashboard → `morpankh-saree-db`
   - Copy the **"External Database URL"**

2. **Add Server in pgAdmin**
   - Right-click "Servers" → "Create" → "Server"
   - **General Tab**: Name: `Render - Morpankh Saree`
   - **Connection Tab**:
     - Host: From External Database URL (e.g., `dpg-d55rcv3uibrs73981q30-a.singapore-postgres.render.com`)
     - Port: `5432`
     - Database: `morpankh_saree`
     - Username: From External Database URL
     - Password: From External Database URL
   - Click "Save"

3. **Browse Data**
   - Expand: Servers → Render - Morpankh Saree → Databases → morpankh_saree → Schemas → public → Tables
   - Right-click any table → "View/Edit Data" → "All Rows"

### Advantages:

- ✅ Professional database management tool
- ✅ Full SQL query editor
- ✅ Can export/import data
- ✅ Can backup/restore database

### Disadvantages:

- ❌ Requires installation
- ❌ More complex interface
- ❌ Requires database connection credentials

---

## Option 4: Render Dashboard (Limited)

**Best for**: Quick checks, basic viewing

### How to Access:

1. Go to https://dashboard.render.com
2. Navigate to your database: `morpankh-saree-db`
3. Some Render plans include a basic database browser

### Limitations:

- ⚠️ Very limited functionality
- ⚠️ Not available on all plans
- ⚠️ Can only view basic table data
- ⚠️ No advanced querying capabilities

---

## Option 5: Command Line (psql)

**Best for**: Developers comfortable with command line

### Installation:

- **Windows**: Install PostgreSQL from https://www.postgresql.org/download/windows/
- **Mac**: `brew install postgresql`
- **Linux**: `sudo apt-get install postgresql-client`

### Connect:

```bash
psql "postgresql://username:password@hostname:port/database_name"
```

### View Data:

```sql
-- List all tables
\dt

-- View data from a table
SELECT * FROM users LIMIT 10;
SELECT * FROM products LIMIT 10;
SELECT * FROM orders LIMIT 10;

-- Count records
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM orders;

-- Exit
\q
```

### Advantages:

- ✅ Full SQL capabilities
- ✅ Lightweight (no GUI needed)
- ✅ Scriptable

### Disadvantages:

- ❌ Command line only
- ❌ Requires technical knowledge
- ❌ Not user-friendly for non-developers

---

## Option 6: Custom Admin Panel API

**Already Built!** Your application has admin API endpoints that can be used to build custom views:

### Available Admin Endpoints:

```
GET  /api/admin/dashboard/stats     - Dashboard statistics
GET  /api/admin/products             - List all products
GET  /api/admin/products/:id         - Get product details
POST /api/admin/products             - Create product
PUT  /api/admin/products/:id         - Update product
DELETE /api/admin/products/:id       - Delete product

GET  /api/admin/orders               - List all orders
GET  /api/admin/orders/:id           - Get order details
PATCH /api/admin/orders/:id/status   - Update order status
```

You can use these APIs to build custom dashboards or integrations.

---

## Recommendation Summary

### For Website Owners/Clients (Non-Technical):
✅ **Use the Admin Dashboard** (`/admin` route in your application)
- Easiest and most user-friendly
- No technical knowledge required
- Secure and accessible from anywhere

### For Developers:
✅ **Use Prisma Studio** for quick development tasks
✅ **Use pgAdmin** for advanced database management
✅ **Use psql** for scripting and automation

---

## Setting Up Admin Dashboard for Website Owner

### Step 1: Create Admin User

You can create an admin user through your application's signup/registration system, or directly in the database:

```sql
-- Connect to database first, then run:
INSERT INTO users (id, email, name, password, role, "isVerified", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'admin@example.com',
  'Admin User',
  '$2a$10$hashed_password_here',  -- Use bcrypt to hash password
  'ADMIN',
  true,
  NOW(),
  NOW()
);
```

Or use Prisma Studio to create an admin user manually.

### Step 2: Share Credentials Securely

- Share the admin email and password securely (use password manager)
- Provide the admin dashboard URL: `https://your-website.com/admin`
- Explain how to login and navigate

### Step 3: Website Owner Can Now:

- View all products, orders, customers
- Manage inventory
- Update order statuses
- View sales reports and statistics
- All without any technical knowledge!

---

## Security Notes

⚠️ **Important Security Considerations**:

1. **Admin Dashboard**: 
   - ✅ Requires authentication
   - ✅ Only admin users can access
   - ✅ Secure API endpoints

2. **Database Direct Access** (pgAdmin, psql, Prisma Studio):
   - ⚠️ Requires database credentials
   - ⚠️ Full database access
   - ⚠️ Should only be shared with trusted technical users
   - ⚠️ Use External Database URL (not Internal)

3. **Best Practice**:
   - Website owners should use the Admin Dashboard
   - Developers should use Prisma Studio or pgAdmin
   - Keep database credentials secure

---

## Quick Comparison

| Method | User-Friendly | Technical Knowledge | Access Location | Best For |
|--------|--------------|---------------------|-----------------|----------|
| **Admin Dashboard** | ⭐⭐⭐⭐⭐ | None needed | Website URL | Website owners |
| **Prisma Studio** | ⭐⭐⭐⭐ | Low | Local machine | Developers |
| **pgAdmin** | ⭐⭐⭐ | Medium | Desktop app | DB admins |
| **psql** | ⭐⭐ | High | Command line | Advanced users |
| **Render Dashboard** | ⭐⭐ | Low | Render website | Quick checks |

---

## Next Steps

1. **For Website Owner**: Set up admin account and share credentials
2. **For Developers**: Use Prisma Studio for development
3. **For Database Management**: Install pgAdmin if needed for advanced tasks

---

**Recommended**: Use the **Admin Dashboard** for website owners - it's already built into your application and provides the best user experience! 🎉

