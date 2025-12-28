# Pages Comparison: Next.js vs Vite

## Overview
The project has **TWO separate frontend implementations**:
1. **Next.js (App Router)** - Located in `frontend/app/` - **THIS IS DEPLOYED** ✅
2. **Vite + React Router** - Located in `frontend/_src/` - **LEGACY/UNUSED** ❌

---

## 🟢 DEPLOYED: Next.js Pages (in `frontend/app/`)

These pages are **actively deployed** and running in production. The build command uses `next build` and `next start`.

### Public Pages (22 pages total)

| Route | Page File | Status |
|-------|-----------|--------|
| `/` | `app/page.tsx` | ✅ Deployed |
| `/about` | `app/about/page.tsx` | ✅ Deployed |
| `/contact` | `app/contact/page.tsx` | ✅ Deployed |
| `/faq` | `app/faq/page.tsx` | ✅ Deployed |
| `/privacy` | `app/privacy/page.tsx` | ✅ Deployed |
| `/terms` | `app/terms/page.tsx` | ✅ Deployed |
| `/shipping` | `app/shipping/page.tsx` | ✅ Deployed |
| `/returns` | `app/returns/page.tsx` | ✅ Deployed |
| `/products` | `app/products/page.tsx` | ✅ Deployed |
| `/products/[slug]` | `app/products/[slug]/page.tsx` | ✅ Deployed (Dynamic) |
| `/categories` | `app/categories/page.tsx` | ✅ Deployed |
| `/cart` | `app/cart/page.tsx` | ✅ Deployed |
| `/checkout` | `app/checkout/page.tsx` | ✅ Deployed |
| `/order-success` | `app/order-success/page.tsx` | ✅ Deployed |
| `/orders` | `app/orders/page.tsx` | ✅ Deployed |
| `/wishlist` | `app/wishlist/page.tsx` | ✅ Deployed |
| `/login` | `app/login/page.tsx` | ✅ Deployed |

### Admin Pages (5 pages)

| Route | Page File | Status |
|-------|-----------|--------|
| `/admin` | `app/admin/page.tsx` | ✅ Deployed |
| `/admin/products` | `app/admin/products/page.tsx` | ✅ Deployed |
| `/admin/orders` | `app/admin/orders/page.tsx` | ✅ Deployed |
| `/admin/banners` | `app/admin/banners/page.tsx` | ✅ Deployed |
| `/admin/inventory` | `app/admin/inventory/page.tsx` | ✅ Deployed |

**Total Next.js Pages: 22 pages**

---

## 🔴 NOT DEPLOYED: Vite/React Router Pages (in `frontend/_src/`)

These pages are **legacy code** and **NOT being used** in production. The Vite setup exists but is not part of the build process.

| Route | Page File | Status |
|-------|-----------|--------|
| `/` | `_src/pages/Home.tsx` | ❌ Not Deployed |
| `/products` | `_src/pages/Products.tsx` | ❌ Not Deployed |
| `/product/:id` | `_src/pages/ProductDetail.tsx` | ❌ Not Deployed |
| `/checkout` | `_src/pages/Checkout.tsx` | ❌ Not Deployed |
| `/about` | `_src/pages/About.tsx` | ❌ Not Deployed |
| `/contact` | `_src/pages/Contact.tsx` | ❌ Not Deployed |
| `/policy` | `_src/pages/Policy.tsx` | ❌ Not Deployed |
| `/wishlist` | `_src/pages/Wishlist.tsx` | ❌ Not Deployed |
| `/cart` | `_src/pages/Cart.tsx` | ❌ Not Deployed |
| `/profile` | `_src/pages/Profile.tsx` | ❌ Not Deployed |
| `/login` | `_src/pages/Login.tsx` | ❌ Not Deployed |

**Total Vite Pages: 11 pages**

---

## Key Differences

### Next.js (Deployed) ✅
- **Framework**: Next.js 14.2.0 with App Router
- **Routing**: File-based routing (`app/` directory)
- **Features**: 
  - Server-side rendering (SSR)
  - Server components
  - Static generation
  - API integration with backend
  - Admin panel
  - Image optimization with Next.js Image component
- **Build Command**: `next build`
- **Start Command**: `next start`
- **Entry Point**: `app/layout.tsx` (root layout)

### Vite/React Router (Legacy) ❌
- **Framework**: Vite + React Router
- **Routing**: Client-side routing (React Router)
- **Entry Point**: `_src/main.tsx` → `_src/App.tsx`
- **Status**: Not included in build process
- **Files**: 
  - `vite.config.ts` exists but unused
  - `index.html` exists but unused
  - All `_src/` code is legacy

---

## Deployment Configuration

**Active Build Process** (from `render.yaml`):
```yaml
buildCommand: cd frontend && npm install --include=dev && npm run build
startCommand: cd ../frontend && npx next start -p $PORT
```

This clearly shows **Next.js is the deployed solution**.

---

## Recommendation

The `_src/` directory and Vite configuration files (`vite.config.ts`, `index.html`) are **legacy code** and can be safely removed if you want to clean up the codebase, as they are not being used in production.

**Summary**: 
- ✅ **22 Next.js pages** are deployed and active
- ❌ **11 Vite pages** exist but are not deployed
- 🎯 All production traffic goes to Next.js pages

