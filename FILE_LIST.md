# Complete File List: Vite vs Next.js

## Yes, both Vite and Next.js files still exist in the project

---

## 🔴 VITE FILES (Legacy/Unused - in `frontend/_src/`)

### Entry Point
- `_src/main.tsx` - Vite entry point
- `_src/App.tsx` - Main React Router app
- `_src/index.css` - Vite styles
- `index.html` - Vite HTML entry

### Vite Pages (11 pages)
1. `_src/pages/Home.tsx`
2. `_src/pages/Products.tsx`
3. `_src/pages/ProductDetail.tsx`
4. `_src/pages/Checkout.tsx`
5. `_src/pages/About.tsx`
6. `_src/pages/Contact.tsx`
7. `_src/pages/Policy.tsx`
8. `_src/pages/Wishlist.tsx`
9. `_src/pages/Cart.tsx`
10. `_src/pages/Profile.tsx`
11. `_src/pages/Login.tsx`

### Vite Components
- `_src/components/Navbar.tsx`
- `_src/components/Footer.tsx`
- `_src/components/SmoothScroll.tsx`
- `_src/components/Home/HeroCarousel.tsx`
- `_src/components/Home/CategorySection.tsx`
- `_src/components/Home/PremiumPatterns.tsx`
- `_src/components/Home/TrendingPatterns.tsx`

### Vite Context
- `_src/context/AppContext.tsx`

### Vite Config
- `vite.config.ts` - Vite configuration
- `tsconfig.node.json` - TypeScript config for Vite

---

## 🟢 NEXT.JS FILES (Active/Deployed - in `frontend/app/`)

### Entry Point
- `app/layout.tsx` - Next.js root layout
- `app/globals.css` - Next.js global styles
- `app/favicon.ico`

### Next.js Public Pages (17 pages)
1. `app/page.tsx` - Home page (/)
2. `app/about/page.tsx` - About page
3. `app/contact/page.tsx` - Contact page
4. `app/faq/page.tsx` - FAQ page
5. `app/privacy/page.tsx` - Privacy Policy
6. `app/terms/page.tsx` - Terms & Conditions
7. `app/shipping/page.tsx` - Shipping Info
8. `app/returns/page.tsx` - Returns Policy
9. `app/products/page.tsx` - Products listing
10. `app/products/[slug]/page.tsx` - Product detail (dynamic)
11. `app/categories/page.tsx` - Categories page
12. `app/cart/page.tsx` - Shopping cart
13. `app/checkout/page.tsx` - Checkout page
14. `app/order-success/page.tsx` - Order success
15. `app/orders/page.tsx` - User orders
16. `app/wishlist/page.tsx` - Wishlist
17. `app/login/page.tsx` - Login page

### Next.js Admin Pages (5 pages)
1. `app/admin/page.tsx` - Admin dashboard
2. `app/admin/products/page.tsx` - Admin products
3. `app/admin/orders/page.tsx` - Admin orders
4. `app/admin/banners/page.tsx` - Admin banners
5. `app/admin/inventory/page.tsx` - Admin inventory
6. `app/admin/layout.tsx` - Admin layout

### Next.js Components (in `frontend/components/`)
- `components/Header.tsx`
- `components/Footer.tsx`
- `components/LayoutWrapper.tsx`
- `components/Providers.tsx`
- `components/SmoothScroll.tsx`
- `components/WhatsAppButton.tsx`
- `components/HomePage/Hero.tsx`
- `components/HomePage/FlashSale.tsx`
- `components/HomePage/Buy2Get1.tsx`
- `components/HomePage/FeaturedProducts.tsx`
- `components/HomePage/CategoryShowcase.tsx`

### Next.js Config
- `next.config.cjs` - Next.js configuration
- `next-env.d.ts` - Next.js TypeScript definitions
- `package.json` - Dependencies (includes Next.js)

---

## 📊 Summary

| Category | Vite Files | Next.js Files |
|----------|------------|---------------|
| **Pages** | 11 pages | 22 pages |
| **Components** | 7 components | 11 components |
| **Status** | ❌ Not deployed (legacy) | ✅ Deployed (active) |
| **Location** | `frontend/_src/` | `frontend/app/` |
| **Build System** | Vite (unused) | Next.js (active) |

---

## 🎯 Current State

- **Next.js files** are actively used and deployed
- **Vite files** still exist but are NOT being used
- The UI from Vite pages has been migrated to Next.js pages
- Vite files can be safely deleted if you want to clean up the codebase

---

## 📝 Notes

- Both systems share the same `lib/` folder (API and store)
- Both use the same `public/` folder for assets
- Tailwind config is shared and works for both
- The `components/` folder contains Next.js components
- The `_src/` folder contains Vite components (legacy)

