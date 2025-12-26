-- ============================================
-- Morpankh Saree Database Schema
-- PostgreSQL Schema for Render Managed PostgreSQL
-- ============================================

-- Enable UUID extension (if needed for cuid generation)
-- Note: Prisma uses cuid() which generates string IDs, not UUIDs
-- This is kept for reference if you want to use UUIDs in the future

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'STAFF', 'CUSTOMER');
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');
CREATE TYPE "PaymentMethod" AS ENUM ('RAZORPAY', 'CASHFREE', 'COD');
CREATE TYPE "StockType" AS ENUM ('ONLINE', 'OFFLINE');
CREATE TYPE "TransactionType" AS ENUM ('IN', 'OUT');

-- ============================================
-- TABLES
-- ============================================

-- Users Table
CREATE TABLE "users" (
    "id" TEXT PRIMARY KEY,
    "email" TEXT UNIQUE,
    "phone" TEXT UNIQUE,
    "name" TEXT,
    "password" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "otp" TEXT,
    "otpExpiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Addresses Table
CREATE TABLE "addresses" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'India',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Categories Table
CREATE TABLE "categories" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "description" TEXT,
    "image" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Products Table
CREATE TABLE "products" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "description" TEXT,
    "shortDescription" TEXT,
    "sku" TEXT NOT NULL UNIQUE,
    "barcode" TEXT UNIQUE,
    "categoryId" TEXT NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "compareAtPrice" DOUBLE PRECISION,
    "costPrice" DOUBLE PRECISION,
    "images" TEXT[],
    "fabricType" TEXT,
    "sareeLength" DOUBLE PRECISION,
    "blouseIncluded" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Product Variants Table
CREATE TABLE "product_variants" (
    "id" TEXT PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "fabric" TEXT,
    "occasion" TEXT,
    "borderDesign" TEXT,
    "patternType" TEXT,
    "price" DOUBLE PRECISION,
    "sku" TEXT NOT NULL UNIQUE,
    "barcode" TEXT UNIQUE,
    "variantCode" TEXT UNIQUE,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "product_variants_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Inventory Table
CREATE TABLE "inventory" (
    "id" TEXT PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "variantId" TEXT,
    "type" "StockType" NOT NULL DEFAULT 'ONLINE',
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "reserved" INTEGER NOT NULL DEFAULT 0,
    "lowStockThreshold" INTEGER NOT NULL DEFAULT 5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "inventory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "inventory_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "inventory_productId_variantId_type_key" UNIQUE ("productId", "variantId", "type")
);

-- Stock Logs Table
CREATE TABLE "stock_logs" (
    "id" TEXT PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "variantId" TEXT,
    "transactionType" "TransactionType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "stockType" "StockType" NOT NULL DEFAULT 'ONLINE',
    "reason" TEXT,
    "scannedBy" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "stock_logs_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "stock_logs_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Coupons Table
CREATE TABLE "coupons" (
    "id" TEXT PRIMARY KEY,
    "code" TEXT NOT NULL UNIQUE,
    "description" TEXT,
    "discountType" TEXT NOT NULL,
    "discountValue" DOUBLE PRECISION NOT NULL,
    "minAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "maxDiscount" DOUBLE PRECISION,
    "usageLimit" INTEGER,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Orders Table
CREATE TABLE "orders" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL UNIQUE,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "subtotal" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tax" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "shipping" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total" DOUBLE PRECISION NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMethod" "PaymentMethod",
    "paymentId" TEXT,
    "shippingAddress" JSONB NOT NULL,
    "billingAddress" JSONB NOT NULL,
    "couponCode" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "orders_couponCode_fkey" FOREIGN KEY ("couponCode") REFERENCES "coupons"("code") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Order Items Table
CREATE TABLE "order_items" (
    "id" TEXT PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "order_items_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Payments Table
CREATE TABLE "payments" (
    "id" TEXT PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "razorpayOrderId" TEXT,
    "razorpayPaymentId" TEXT,
    "razorpaySignature" TEXT,
    "transactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Reviews Table
CREATE TABLE "reviews" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "comment" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "reviews_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Wishlist Items Table
CREATE TABLE "wishlist_items" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "wishlist_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "wishlist_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "wishlist_items_userId_productId_key" UNIQUE ("userId", "productId")
);

-- Banners Table
CREATE TABLE "banners" (
    "id" TEXT PRIMARY KEY,
    "title" TEXT,
    "description" TEXT,
    "image" TEXT NOT NULL,
    "link" TEXT,
    "linkText" TEXT,
    "position" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "validFrom" TIMESTAMP(3),
    "validUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Homepage Sections Table
CREATE TABLE "homepage_sections" (
    "id" TEXT PRIMARY KEY,
    "title" TEXT,
    "type" TEXT NOT NULL,
    "products" JSONB,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "settings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Social Links Table
CREATE TABLE "social_links" (
    "id" TEXT PRIMARY KEY,
    "platform" TEXT NOT NULL UNIQUE,
    "url" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Settings Table
CREATE TABLE "settings" (
    "id" TEXT PRIMARY KEY,
    "key" TEXT NOT NULL UNIQUE,
    "value" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Carts Table
CREATE TABLE "carts" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT UNIQUE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "carts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Cart Items Table
CREATE TABLE "cart_items" (
    "id" TEXT PRIMARY KEY,
    "cartId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "cart_items_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "cart_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "cart_items_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "cart_items_cartId_productId_variantId_key" UNIQUE ("cartId", "productId", "variantId")
);

-- ============================================
-- INDEXES (for better query performance)
-- ============================================

-- User indexes
CREATE INDEX "users_email_idx" ON "users"("email");
CREATE INDEX "users_phone_idx" ON "users"("phone");
CREATE INDEX "users_role_idx" ON "users"("role");

-- Address indexes
CREATE INDEX "addresses_userId_idx" ON "addresses"("userId");

-- Product indexes
CREATE INDEX "products_categoryId_idx" ON "products"("categoryId");
CREATE INDEX "products_slug_idx" ON "products"("slug");
CREATE INDEX "products_isActive_idx" ON "products"("isActive");
CREATE INDEX "products_isFeatured_idx" ON "products"("isFeatured");

-- Product Variant indexes
CREATE INDEX "product_variants_productId_idx" ON "product_variants"("productId");

-- Inventory indexes
CREATE INDEX "inventory_productId_idx" ON "inventory"("productId");
CREATE INDEX "inventory_variantId_idx" ON "inventory"("variantId");

-- Order indexes
CREATE INDEX "orders_userId_idx" ON "orders"("userId");
CREATE INDEX "orders_orderNumber_idx" ON "orders"("orderNumber");
CREATE INDEX "orders_status_idx" ON "orders"("status");
CREATE INDEX "orders_paymentStatus_idx" ON "orders"("paymentStatus");
CREATE INDEX "orders_createdAt_idx" ON "orders"("createdAt");

-- Order Item indexes
CREATE INDEX "order_items_orderId_idx" ON "order_items"("orderId");
CREATE INDEX "order_items_productId_idx" ON "order_items"("productId");

-- Payment indexes
CREATE INDEX "payments_orderId_idx" ON "payments"("orderId");
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- Review indexes
CREATE INDEX "reviews_userId_idx" ON "reviews"("userId");
CREATE INDEX "reviews_productId_idx" ON "reviews"("productId");
CREATE INDEX "reviews_isApproved_idx" ON "reviews"("isApproved");

-- Wishlist indexes
CREATE INDEX "wishlist_items_userId_idx" ON "wishlist_items"("userId");
CREATE INDEX "wishlist_items_productId_idx" ON "wishlist_items"("productId");

-- Cart indexes
CREATE INDEX "cart_items_cartId_idx" ON "cart_items"("cartId");
CREATE INDEX "cart_items_productId_idx" ON "cart_items"("productId");

-- Stock Log indexes
CREATE INDEX "stock_logs_productId_idx" ON "stock_logs"("productId");
CREATE INDEX "stock_logs_variantId_idx" ON "stock_logs"("variantId");
CREATE INDEX "stock_logs_createdAt_idx" ON "stock_logs"("createdAt");

-- ============================================
-- COMMENTS (Documentation)
-- ============================================

COMMENT ON TABLE "users" IS 'User accounts with authentication and role management';
COMMENT ON TABLE "addresses" IS 'User shipping and billing addresses';
COMMENT ON TABLE "categories" IS 'Product categories';
COMMENT ON TABLE "products" IS 'Main product catalog';
COMMENT ON TABLE "product_variants" IS 'Product variants (color, size, etc.)';
COMMENT ON TABLE "inventory" IS 'Stock management for products and variants';
COMMENT ON TABLE "stock_logs" IS 'Audit trail for inventory changes';
COMMENT ON TABLE "orders" IS 'Customer orders';
COMMENT ON TABLE "order_items" IS 'Items in each order';
COMMENT ON TABLE "payments" IS 'Payment transactions';
COMMENT ON TABLE "coupons" IS 'Discount coupons';
COMMENT ON TABLE "reviews" IS 'Product reviews and ratings';
COMMENT ON TABLE "wishlist_items" IS 'User wishlists';
COMMENT ON TABLE "banners" IS 'Marketing banners';
COMMENT ON TABLE "homepage_sections" IS 'Homepage content sections';
COMMENT ON TABLE "social_links" IS 'Social media links';
COMMENT ON TABLE "settings" IS 'Application settings';
COMMENT ON TABLE "carts" IS 'Shopping carts';
COMMENT ON TABLE "cart_items" IS 'Items in shopping carts';

