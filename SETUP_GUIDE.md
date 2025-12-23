# Morpankh Saree - Setup & Development Guide

## 🎯 Project Status

This is a comprehensive e-commerce platform for Morpankh Saree built with modern technologies. The foundation has been laid with:

### ✅ Completed
- Project structure (monorepo with frontend + backend)
- Next.js 16 frontend with TypeScript and Tailwind CSS v4
- Express.js backend with TypeScript
- Prisma ORM with comprehensive database schema
- Authentication system (JWT, OTP ready)
- Basic UI components (Header, Footer, Layout)
- State management (Zustand)
- API client setup
- Smooth scrolling (Lenis)
- Custom brand colors and typography

### 🚧 In Progress / TODO
- Homepage with hero, flash sales, and Buy 2 Get 1 sections
- Product listing with filters and sorting
- Product detail pages with image zoom
- Cart and checkout flow
- Razorpay payment integration
- Admin dashboard
- Barcode/QR scanning system
- Redis caching
- Deployment configuration

---

## 📦 Installation

### Prerequisites
- Node.js 18+ (LTS recommended)
- PostgreSQL 14+
- Redis (optional, for caching)
- npm or yarn

### Step 1: Install Dependencies

```bash
# Root level
npm install

# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### Step 2: Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE morpankh_saree;
```

2. Set up environment variables in `backend/.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/morpankh_saree"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-key-secret"
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

3. Generate Prisma client and run migrations:
```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
```

### Step 3: Frontend Environment

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key-id
```

### Step 4: Run Development Servers

**Option 1: Run separately**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

**Option 2: Run from root (if concurrently is installed)**
```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## 🗄️ Database Schema Overview

The Prisma schema includes:

- **Users** - Admin, Staff, Customer roles with OTP authentication
- **Products** - Sarees with variants, images, pricing
- **Categories** - Product categorization
- **Inventory** - Online/Offline stock management
- **Orders** - Complete order management
- **Payments** - Razorpay integration
- **Reviews** - Product reviews and ratings
- **Wishlist** - User wishlists
- **Coupons** - Discount codes
- **Banners** - Homepage banners
- **StockLogs** - Inventory transaction tracking
- **Social Links** - Social media integration
- **Settings** - Application settings

---

## 🎨 Design System

### Colors
- **Royal Blue**: `#1e3a8a`
- **Deep Indigo**: `#312e81`
- **Off-White**: `#faf9f6`
- **Soft Cream**: `#fffef9`
- **Gold**: `#d4af37`
- **Gold Light**: `#f4e4bc`

### Typography
- **Headings**: Playfair Display
- **Body**: Inter

### Key Principles
- Clean and elegant
- Large touch targets
- Premium feel without being overwhelming
- Smooth animations (Lenis, Framer Motion)
- Mobile-first design

---

## 🏗️ Project Structure

```
.
├── frontend/
│   ├── app/              # Next.js App Router
│   ├── components/       # React components
│   ├── lib/              # Utilities, API client, store
│   └── public/           # Static assets
├── backend/
│   ├── src/
│   │   ├── config/       # Database, Redis config
│   │   ├── controllers/  # Route handlers
│   │   ├── middleware/   # Auth, error handling, rate limiting
│   │   ├── routes/       # API routes
│   │   └── utils/        # Utilities (JWT, etc.)
│   └── prisma/           # Database schema & migrations
└── shared/               # Shared types (future)
```

---

## 🔐 Authentication Flow

1. **Registration/Login**
   - User provides email/phone
   - OTP sent via SMS/Email
   - User verifies OTP
   - JWT token issued

2. **Password Login** (Alternative)
   - User provides email/phone + password
   - JWT token issued on success

3. **Token Management**
   - Access token (short-lived)
   - Refresh token (long-lived)
   - Stored in localStorage (frontend)
   - Sent in Authorization header

---

## 🛒 Key Features to Implement

### Customer Features
1. **Homepage**
   - Hero banner with CTA
   - Flash sale section with countdown
   - Buy 2 Get 1 offer section
   - Featured products
   - Category showcase

2. **Product Listing**
   - Grid/List view toggle
   - Filters (price, fabric, color, occasion)
   - Sorting (price, popularity, newest)
   - Pagination
   - Search

3. **Product Detail**
   - Image gallery with zoom
   - Variant selection
   - Stock availability
   - Reviews and ratings
   - Related products
   - Add to cart/wishlist

4. **Cart & Checkout**
   - Cart management
   - Address selection
   - Coupon application
   - Razorpay payment
   - Order confirmation

### Admin Features
1. **Dashboard**
   - Sales analytics
   - Order management
   - Inventory overview
   - Recent activity

2. **Product Management**
   - CRUD operations
   - Image upload
   - Variant management
   - Bulk operations

3. **Inventory Management**
   - Stock tracking
   - Barcode/QR scanning
   - Online/Offline sync
   - Stock logs

4. **Order Management**
   - Order status updates
   - Invoice generation
   - Shipment tracking

---

## 🔧 Development Guidelines

### Code Style
- TypeScript strict mode enabled
- ESLint configured
- Prefer functional components
- Use hooks for state management
- Follow Next.js App Router patterns

### API Conventions
- RESTful API design
- Consistent error handling
- Rate limiting on all endpoints
- JWT authentication middleware
- Request validation with Zod

### Performance
- Image optimization (Next.js Image component)
- Code splitting
- Lazy loading
- Redis caching for frequently accessed data
- Database query optimization

---

## 🚀 Deployment (Render)

### Backend Deployment
1. Create new Web Service on Render
2. Connect GitHub repository
3. Set environment variables
4. Build command: `cd backend && npm install && npm run build`
5. Start command: `cd backend && npm start`

### Frontend Deployment
1. Create new Static Site on Render
2. Connect GitHub repository
3. Build command: `cd frontend && npm install && npm run build`
4. Publish directory: `frontend/.next`

### Database
- Use Render PostgreSQL (Managed)
- Update DATABASE_URL in backend environment

### Redis (Optional)
- Use Upstash Redis or Render Redis
- Update REDIS_URL in backend environment

---

## 📝 Next Steps

1. **Complete Homepage**
   - Hero section with banner images
   - Flash sale countdown timer
   - Buy 2 Get 1 section
   - Featured products carousel

2. **Product Pages**
   - Listing page with filters
   - Detail page with image zoom
   - Reviews integration

3. **Shopping Cart**
   - Cart persistence
   - Checkout flow
   - Payment integration

4. **Admin Panel**
   - Dashboard layout
   - Product CRUD
   - Order management
   - Inventory scanning

5. **Optimizations**
   - Redis caching
   - Image CDN setup
   - Performance monitoring
   - Error tracking

---

## 🐛 Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL format
- Check PostgreSQL is running
- Ensure database exists

### Prisma Issues
- Run `npx prisma generate` after schema changes
- Use `npx prisma studio` to view data
- Check migrations with `npx prisma migrate status`

### Build Errors
- Clear `node_modules` and reinstall
- Check TypeScript errors with `npm run build`
- Verify all environment variables are set

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Razorpay Documentation](https://razorpay.com/docs/)
- [Render Documentation](https://render.com/docs)

---

## 🤝 Contributing

Follow the established patterns and coding standards. Ensure all features are tested before deployment.

---

**Built with ❤️ for Morpankh Saree**

