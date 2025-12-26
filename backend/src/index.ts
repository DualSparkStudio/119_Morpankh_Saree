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
app.use('/api/banners', bannerRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/payments', paymentRoutes);

// Serve Vite frontend (static files from dist folder)
{
  console.log('🔍 Starting Vite frontend setup...');
  console.log('📂 Current working directory:', process.cwd());
  console.log('📂 __dirname:', __dirname);
  console.log('🌍 NODE_ENV:', process.env.NODE_ENV);
  
  // Calculate frontend dist path - handle both local and Render deployment
  // On Render: startCommand runs from backend/, so process.cwd() = /opt/render/project/src/backend
  // So ../frontend/dist = /opt/render/project/src/frontend/dist
  const possibleDistPaths = [
    path.resolve(process.cwd(), '../frontend/dist'), // From backend/ -> ../frontend/dist (MOST LIKELY ON RENDER)
    path.resolve(__dirname, '../../frontend/dist'), // From backend/dist -> ../../frontend/dist
    path.resolve(process.cwd(), 'frontend/dist'), // From root/ -> frontend/dist
    path.join(process.cwd(), '..', 'frontend', 'dist'), // Alternative path resolution
    '/opt/render/project/src/frontend/dist', // Render specific absolute path
    path.resolve(__dirname, '..', '..', 'frontend', 'dist'), // Alternative relative from dist
  ];
  
  console.log('🔍 Checking frontend dist paths:');
  possibleDistPaths.forEach(p => {
    const exists = fs.existsSync(p);
    console.log(`   ${exists ? '✅' : '❌'} ${p}`);
  });
  
  let distPath: string | null = null;
  for (const possiblePath of possibleDistPaths) {
    if (fs.existsSync(possiblePath)) {
      distPath = possiblePath;
      console.log('✅ Found frontend dist at:', distPath);
      break;
    }
  }
  
  if (!distPath) {
    console.error('❌ Frontend dist directory not found! Tried paths:');
    possibleDistPaths.forEach(p => console.error('   -', p));
    console.error('❌ Current working directory:', process.cwd());
    console.error('❌ __dirname:', __dirname);
    console.error('❌ Make sure frontend is built: cd frontend && npm run build');
  } else {
    // Serve static files from dist folder
    app.use(express.static(distPath, { 
      maxAge: '1y',
      etag: true
    }));
    console.log('✅ Static files path configured:', distPath);
    
    // Serve index.html for all non-API routes (SPA routing)
    app.get('*', (req: express.Request, res: express.Response, next: express.NextFunction) => {
      // Skip API routes and health check
      if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
        return next();
      }
      
      // Serve index.html for all other routes (React Router will handle routing)
      const indexPath = path.join(distPath!, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(path.resolve(indexPath));
      } else {
        res.status(404).send(`
          <html>
            <head><title>404 - Frontend Not Found</title></head>
            <body>
              <h1>404 - Frontend Not Found</h1>
              <p>The Vite frontend could not be loaded.</p>
              <p>Please check the deployment logs for more information.</p>
              <p>Path: ${req.path}</p>
              <p>Working Directory: ${process.cwd()}</p>
              <p>__dirname: ${__dirname}</p>
            </body>
          </html>
        `);
      }
    });
    console.log('✅ Vite SPA route handler configured');
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

