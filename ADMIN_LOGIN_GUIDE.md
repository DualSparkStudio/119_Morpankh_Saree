# How to Login to Admin Panel

## Step 1: Create an Admin User

You need to create an admin user in the database first. There's a script to do this automatically.

### Option A: Using the Create Admin Script (Recommended)

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Run the create-admin script:**
   ```bash
   node create-admin.js
   ```
   
   This will create an admin user with default credentials:
   - **Email**: `admin@morpankhsaree.com`
   - **Password**: `Admin@123`
   - **Name**: `Admin User`

3. **Or create with custom credentials:**
   ```bash
   node create-admin.js your-email@example.com your-password "Your Name"
   ```

### Option B: Create Admin User Manually (Alternative)

If the script doesn't work, you can create an admin user directly in the database using Prisma Studio:

1. **Open Prisma Studio:**
   ```bash
   cd backend
   npx prisma studio
   ```

2. **Create a new user:**
   - Go to the `User` model
   - Click "Add record"
   - Fill in:
     - `email`: your admin email
     - `password`: (you'll need to hash this with bcrypt)
     - `name`: Admin User
     - `role`: `ADMIN`
     - `isVerified`: `true`

   **Note:** For password, you need to hash it. The easiest way is to use the create-admin script above.

---

## Step 2: Login to Admin Panel

1. **Go to the login page:**
   - Navigate to: `http://localhost:3000/login` (or your deployed URL)
   - Or directly: `http://localhost:3000/admin` (will redirect to login)

2. **Enter your admin credentials:**
   - **Email**: `admin@morpankhsaree.com` (or the email you used)
   - **Password**: `Admin@123` (or the password you set)

3. **After successful login:**
   - You'll be redirected to `/admin` dashboard
   - You'll have access to all admin pages:
     - Dashboard
     - Products
     - Orders
     - Inventory
     - Banners

---

## Admin Requirements

The admin panel requires:
- User must be logged in (`user` exists in store)
- User role must be `ADMIN` or `STAFF`
- User must be verified (`isVerified: true`)

If you try to access `/admin` without meeting these requirements, you'll be redirected to the login page.

---

## Default Admin Credentials (if using script defaults)

- **Email**: `admin@morpankhsaree.com`
- **Password**: `Admin@123`

⚠️ **Important:** Change the password after first login for security!

---

## Troubleshooting

### Issue: "Access denied" or redirects to home page
- **Solution**: Make sure the user role is set to `ADMIN` or `STAFF` in the database

### Issue: Login page closes immediately
- **Solution**: This was fixed in the latest update. The page now only redirects if you're actually logged in with valid credentials.

### Issue: Can't create admin user
- **Solution**: Make sure:
  - Database is running
  - DATABASE_URL is set correctly in `backend/.env`
  - You've run `npx prisma generate` and `npx prisma migrate deploy` (or `npx prisma db push`)

### Issue: Script not found
- **Solution**: Make sure you're in the `backend` directory when running the script

---

## Quick Commands

```bash
# Create admin user (default credentials)
cd backend
node create-admin.js

# Create admin user (custom credentials)
cd backend
node create-admin.js admin@yoursite.com MyPassword123 "Admin Name"

# Check if admin user exists (using Prisma Studio)
cd backend
npx prisma studio
# Then browse to User model and check the role field
```

---

## Security Note

After creating the admin user, make sure to:
1. Change the default password immediately
2. Use a strong, unique password
3. Keep admin credentials secure
4. Never commit passwords to version control

