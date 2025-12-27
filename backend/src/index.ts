import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { prisma } from './config/database';

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
import adminBannersRoutes from './routes/admin/banners';
import bannerRoutes from './routes/banners';
import couponRoutes from './routes/coupons';
import reviewRoutes from './routes/reviews';
import wishlistRoutes from './routes/wishlist';
import inventoryRoutes from './routes/inventory';
import paymentRoutes from './routes/payment';

dotenv.config();

// Warn if DATABASE_URL is not set, but don't exit (for testing without DB)
if (!process.env.DATABASE_URL) {
  console.warn('⚠️  WARNING: DATABASE_URL is not set. Backend will run in test mode without database.');
  console.warn('API endpoints that require database will return appropriate responses.');
}

const app = express();
// Render provides PORT via environment variable - use it directly
const PORT = parseInt(process.env.PORT || '10000', 10);

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

// Serve uploaded files
const uploadsPath = path.join(process.cwd(), 'uploads');
if (fs.existsSync(uploadsPath)) {
  app.use('/uploads', express.static(uploadsPath));
}

// Log all requests for debugging (can be removed in production)
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.path.includes('.css') || req.path.startsWith('/_next/static')) {
    console.log('🎨 CSS/Static request:', req.method, req.path);
  }
  next();
});

// Rate limiting
app.use('/api/', rateLimiter);

// Health check
app.get('/health', (req: express.Request, res: express.Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Database health check
app.get('/health/db', async (req: express.Request, res: express.Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: 'ok', 
      database: 'connected',
      timestamp: new Date().toISOString() 
    });
  } catch (error: any) {
    console.error('Database connection error:', error);
    const isDevelopment = process.env.NODE_ENV !== 'production';
    res.status(500).json({ 
      status: 'error', 
      database: 'disconnected',
      error: error.message || 'Unknown database error',
      code: error.code,
      ...(isDevelopment && { 
        stack: error.stack,
        meta: error.meta 
      }),
      timestamp: new Date().toISOString() 
    });
  }
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
app.use('/api/admin/banners', adminBannersRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/payments', paymentRoutes);

// Serve Next.js frontend
{
  console.log('🔍 Starting Next.js frontend setup...');
  
  const frontendPath = path.resolve(process.cwd(), '../frontend');
  const nextStaticPath = path.resolve(frontendPath, '.next/static');
  const nextPublicPath = path.resolve(frontendPath, 'public');
  
  // Serve Next.js static files
  if (fs.existsSync(nextStaticPath)) {
    app.use('/_next/static', express.static(path.join(nextStaticPath, 'static'), { maxAge: '1y' }));
    console.log('✅ Next.js static files configured');
  }
  
  // Serve public files
  if (fs.existsSync(nextPublicPath)) {
    app.use(express.static(nextPublicPath, { maxAge: '1y' }));
    console.log('✅ Next.js public files configured');
  }
  
  // Handle Next.js routes - will be handled by Next.js server in standalone mode
  // For now, serve a simple message for non-API routes
  app.get('*', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Skip API routes and health check
    if (req.path.startsWith('/api') || req.path.startsWith('/health') || req.path.startsWith('/_next')) {
      return next();
    }
    
    // Next.js will handle these routes in production (standalone server)
    res.status(404).send('Next.js frontend not loaded. Make sure Next.js standalone server is running.');
  });
  
  console.log('✅ Next.js frontend configuration ready');
}

// Error handling
app.use(errorHandler);

// 404 handler (only for API routes if frontend not served)
if (process.env.NODE_ENV !== 'production') {
  app.use((req: express.Request, res: express.Response) => {
    res.status(404).json({ error: 'Route not found' });
  });
}

// Start server - Render will provide PORT via environment variable
// Guard against double-start
let serverStarted = false;

if (!serverStarted) {
  serverStarted = true;
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
  
  server.on('error', (error: NodeJS.ErrnoException) => {
    // Error handler - fires if port is already in use
    console.error('❌ Failed to start server:', error.message);
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use`);
      console.error('This usually means Render is restarting - wait a moment and try again');
    }
    process.exit(1);
  });
}

export default app;

