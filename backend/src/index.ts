import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';

// Import routes
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import categoryRoutes from './routes/categories';
import orderRoutes from './routes/orders';
import cartRoutes from './routes/cart';
import userRoutes from './routes/users';
import adminRoutes from './routes/admin';
import adminProductsRoutes from './routes/admin/products';
import adminOrdersRoutes from './routes/admin/orders';
import adminDashboardRoutes from './routes/admin/dashboard';
import bannerRoutes from './routes/banners';
import couponRoutes from './routes/coupons';
import reviewRoutes from './routes/reviews';
import wishlistRoutes from './routes/wishlist';
import inventoryRoutes from './routes/inventory';
import paymentRoutes from './routes/payment';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allow Next.js to handle CSP
}));
app.use(compression());
// CORS - allow same origin in production (single URL)
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? false // Same origin, no CORS needed
    : (process.env.FRONTEND_URL || 'http://localhost:3000'),
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use('/api/', rateLimiter);

// Health check
app.get('/health', (req: express.Request, res: express.Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/products', adminProductsRoutes);
app.use('/api/admin/orders', adminOrdersRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/payments', paymentRoutes);

// Serve Next.js frontend (only in production)
if (process.env.NODE_ENV === 'production') {
  const frontendBuildPath = path.join(__dirname, '../../frontend/.next');
  const staticPath = path.join(frontendBuildPath, 'static');
  const standalonePath = path.join(frontendBuildPath, 'standalone');
  
  // Serve Next.js static assets
  if (fs.existsSync(staticPath)) {
    app.use('/_next/static', express.static(staticPath, { maxAge: '1y' }));
  }
  
  // Serve Next.js public assets
  const publicPath = path.join(__dirname, '../../frontend/public');
  if (fs.existsSync(publicPath)) {
    app.use(express.static(publicPath));
  }
  
  // Try to use Next.js standalone server
  let nextHandler = null;
  if (fs.existsSync(standalonePath)) {
    try {
      // Next.js standalone creates server.js in standalone/frontend/server.js
      const nextServerPath = path.join(standalonePath, 'frontend/server.js');
      if (fs.existsSync(nextServerPath)) {
        const nextServer = require(nextServerPath);
        nextHandler = nextServer.default || nextServer;
        console.log('✅ Next.js standalone server loaded');
      }
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      console.warn('⚠️ Next.js standalone server not available:', errorMessage);
    }
  }
  
  // Handle all non-API routes with Next.js
  if (nextHandler) {
    app.all('*', (req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (req.path.startsWith('/api') || req.path.startsWith('/_next') || req.path.startsWith('/health')) {
        return next();
      }
      return nextHandler(req, res);
    });
  } else {
    // Fallback: serve index.html for SPA routing
    app.get('*', (req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (req.path.startsWith('/api') || req.path.startsWith('/_next') || req.path.startsWith('/health')) {
        return next();
      }
      // Try to find and serve the HTML file
      const possiblePaths = [
        path.join(__dirname, '../../frontend/.next/server/pages/index.html'),
        path.join(__dirname, '../../frontend/.next/standalone/frontend/.next/server/pages/index.html'),
      ];
      
      for (const indexPath of possiblePaths) {
        if (fs.existsSync(indexPath)) {
          return res.sendFile(indexPath);
        }
      }
      next();
    });
  }
}

// Error handling
app.use(errorHandler);

// 404 handler (only for API routes if frontend not served)
if (process.env.NODE_ENV !== 'production') {
  app.use((req: express.Request, res: express.Response) => {
    res.status(404).json({ error: 'Route not found' });
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;

