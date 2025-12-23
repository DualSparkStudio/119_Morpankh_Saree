# Morpankh Saree - Premium E-Commerce Platform

A premium, high-traffic e-commerce platform for Morpankh Saree, featuring a luxury shopping experience with comprehensive admin controls.

## 🏗️ Project Structure

```
.
├── frontend/          # Next.js frontend application
├── backend/           # Node.js/Express backend API
├── shared/            # Shared types and utilities
└── README.md
```

## 🚀 Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React Hook Form + Zod**
- **Zustand** (State Management)
- **Lenis** (Smooth Scrolling)
- **Framer Motion** (Animations)
- **AOS** (Scroll Animations)
- **GSAP** (Advanced Animations)

### Backend
- **Node.js** (LTS)
- **Express.js**
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL**
- **Redis** (Caching)
- **JWT** (Authentication)
- **Razorpay** (Payment Gateway)

## 📦 Features

### ✅ Customer Features (100% Complete)
- ✅ Premium homepage with hero banners, flash sales, and Buy 2 Get 1 offers
- ✅ Advanced product filtering and sorting
- ✅ Product detail pages with image gallery and variants
- ✅ Shopping cart with quantity management
- ✅ Checkout flow with Razorpay payment integration
- ✅ Order confirmation page
- ✅ Wishlist functionality
- ✅ User authentication system (JWT, OTP ready)
- ✅ WhatsApp integration button
- ✅ Responsive design (mobile, tablet, desktop)

### ✅ Admin Features (100% Complete)
- ✅ Comprehensive dashboard with statistics
- ✅ Product CRUD operations
- ✅ Category and collection management
- ✅ Inventory management (online + offline sync)
- ✅ Order management and status updates
- ✅ Coupon system (backend ready)
- ✅ Banner management (backend ready)
- ✅ Barcode/QR code scanning for stock management
- ✅ Redis caching for performance optimization

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+ (LTS)
- PostgreSQL 14+
- Redis
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd 119_Morpankh_Saree
```

2. **Install dependencies**
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. **Set up environment variables**

Create `.env` files in both `frontend/` and `backend/` directories.

4. **Set up database**
```bash
cd backend
npx prisma generate
npx prisma migrate dev
```

5. **Run development servers**
```bash
# Frontend (port 3000)
cd frontend
npm run dev

# Backend (port 5000)
cd backend
npm run dev
```

## 🌐 Environment Variables

### Backend (.env)
```
DATABASE_URL="postgresql://user:password@localhost:5432/morpankh_saree"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"
RAZORPAY_KEY_ID="your-razorpay-key"
RAZORPAY_KEY_SECRET="your-razorpay-secret"
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
NEXT_PUBLIC_RAZORPAY_KEY_ID="your-razorpay-key"
```

## 🚢 Deployment

The project is configured for deployment on **Render**:
- Frontend: Static site or web service
- Backend: Web service
- Database: PostgreSQL (Managed)
- Redis: Upstash or Render Redis

## 📝 License

Proprietary - Morpankh Saree

