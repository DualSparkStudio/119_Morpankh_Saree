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
  const frontendPath = path.join(__dirname, '../../frontend');
  const frontendBuildPath = path.join(frontendPath, '.next');
  const standalonePath = path.join(frontendBuildPath, 'standalone');
  const staticPath = path.join(frontendBuildPath, 'static');
  
  // Serve Next.js static assets
  if (fs.existsSync(staticPath)) {
    app.use('/_next/static', express.static(staticPath, { maxAge: '1y' }));
  }
  
  // Serve Next.js public assets
  const publicPath = path.join(frontendPath, 'public');
  if (fs.existsSync(publicPath)) {
    app.use(express.static(publicPath));
  }
  
  // Try to use Next.js standalone handler
  let nextHandler: ((req: express.Request, res: express.Response) => void) | null = null;
  
  // First, try using next package directly (requires source code)
  try {
    const nextPath = path.join(frontendPath, 'node_modules/next');
    if (fs.existsSync(nextPath)) {
      const next = require(nextPath);
      if (next.default && typeof next.default.createServer === 'function') {
        const nextApp = next.default({ dev: false, dir: frontendPath });
        const handler = nextApp.getRequestHandler();
        nextHandler = handler;
        console.log('✅ Next.js handler created using next package');
      }
    }
  } catch (nextPackageError) {
    // If next package approach fails, try standalone
    console.log('⚠️ Next package approach failed, trying standalone...');
  }
  
  // If next package approach didn't work, try standalone server.js
  if (!nextHandler && fs.existsSync(standalonePath)) {
    try {
      const nextServerPath = path.join(standalonePath, 'frontend/server.js');
      if (fs.existsSync(nextServerPath)) {
        const originalPort = process.env.PORT;
        delete process.env.PORT;
        
        try {
          const nextServerModule = require(nextServerPath);
          
          if (originalPort) {
            process.env.PORT = originalPort;
          }
          
          // Try different exports
          if (typeof nextServerModule === 'function') {
            nextHandler = nextServerModule;
          } else if (nextServerModule.default && typeof nextServerModule.default === 'function') {
            nextHandler = nextServerModule.default;
          } else if (nextServerModule.handler && typeof nextServerModule.handler === 'function') {
            nextHandler = nextServerModule.handler;
          } else if (nextServerModule.requestHandler && typeof nextServerModule.requestHandler === 'function') {
            nextHandler = nextServerModule.requestHandler;
          }
          
          if (nextHandler) {
            console.log('✅ Next.js standalone handler loaded');
          } else {
            console.warn('⚠️ Next.js handler not found. Module type:', typeof nextServerModule);
            console.warn('⚠️ Available keys:', Object.keys(nextServerModule || {}));
          }
        } catch (loadError: unknown) {
          if (originalPort) {
            process.env.PORT = originalPort;
          }
          const errorMsg = loadError instanceof Error ? loadError.message : String(loadError);
          console.warn('⚠️ Failed to load Next.js server:', errorMsg);
        }
      }
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      console.warn('⚠️ Next.js standalone handler not available:', errorMessage);
    }
  }
  
  // Handle all non-API routes with Next.js
  if (nextHandler) {
    app.all('*', (req: express.Request, res: express.Response, next: express.NextFunction) => {
      // Skip API routes, static assets, and health check
      if (req.path.startsWith('/api') || req.path.startsWith('/_next') || req.path.startsWith('/health')) {
        return next();
      }
      // Use Next.js handler
      return nextHandler!(req, res);
    });
  } else {
    // Fallback: Try to serve static HTML files
    console.warn('⚠️ Next.js handler not available, using fallback static serving');
    
    // Check for HTML files in various possible locations
    const htmlPaths = [
      path.join(__dirname, '../../frontend/.next/server/pages'),
      path.join(__dirname, '../../frontend/out'),
      path.join(__dirname, '../../frontend/.next/standalone/frontend/.next/server/pages'),
    ];
    
    let htmlBasePath = null;
    for (const htmlPath of htmlPaths) {
      if (fs.existsSync(htmlPath)) {
        htmlBasePath = htmlPath;
        console.log(`✅ Found HTML files at: ${htmlPath}`);
        break;
      }
    }
    
    if (htmlBasePath) {
      app.use(express.static(htmlBasePath));
    } else {
      console.warn('⚠️ No HTML files found in expected locations');
      // Log what directories do exist for debugging
      const checkDirs = [
        path.join(__dirname, '../../frontend/.next'),
        path.join(__dirname, '../../frontend/.next/standalone'),
        path.join(__dirname, '../../frontend'),
      ];
      checkDirs.forEach(dir => {
        if (fs.existsSync(dir)) {
          console.log(`📁 Directory exists: ${dir}`);
          try {
            const contents = fs.readdirSync(dir);
            console.log(`   Contents: ${contents.slice(0, 5).join(', ')}${contents.length > 5 ? '...' : ''}`);
          } catch (e) {
            // Ignore read errors
          }
        }
      });
    }
    
    // Fallback: serve index.html for all non-API routes
    app.get('*', (req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (req.path.startsWith('/api') || req.path.startsWith('/_next') || req.path.startsWith('/health')) {
        return next();
      }
      
      const possiblePaths = [
        path.join(__dirname, '../../frontend/.next/server/pages/index.html'),
        path.join(__dirname, '../../frontend/out/index.html'),
        path.join(__dirname, '../../frontend/.next/standalone/frontend/.next/server/pages/index.html'),
      ];
      
      for (const indexPath of possiblePaths) {
        if (fs.existsSync(indexPath)) {
          return res.sendFile(path.resolve(indexPath));
        }
      }
      
      // If no HTML found, return a helpful error
      console.warn(`⚠️ No HTML file found for path: ${req.path}`);
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

