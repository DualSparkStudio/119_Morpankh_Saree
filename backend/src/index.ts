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

// Serve Next.js frontend (in all environments)
{
  console.log('🔍 Starting Next.js frontend setup...');
  console.log('📂 Current working directory:', process.cwd());
  console.log('📂 __dirname:', __dirname);
  console.log('🌍 NODE_ENV:', process.env.NODE_ENV);
  
  // Calculate frontend path - handle both local and Render deployment
  // On Render: __dirname = /opt/render/project/src/backend/dist
  // So ../../frontend = /opt/render/project/src/frontend
  // startCommand runs from backend/, so process.cwd() = /opt/render/project/src/backend
  // So ../frontend = /opt/render/project/src/frontend
  const possibleFrontendPaths = [
    path.resolve(__dirname, '../../frontend'), // From backend/dist -> ../../frontend
    path.resolve(process.cwd(), '../frontend'), // From backend/ -> ../frontend
    path.resolve(process.cwd(), 'frontend'), // From root/ -> frontend
    '/opt/render/project/src/frontend', // Render specific path
    path.join(process.cwd(), '..', 'frontend'), // Alternative path resolution
  ];
  
  console.log('🔍 Checking frontend paths:');
  possibleFrontendPaths.forEach(p => {
    const exists = fs.existsSync(p);
    console.log(`   ${exists ? '✅' : '❌'} ${p}`);
  });
  
  let frontendPath: string | null = null;
  for (const possiblePath of possibleFrontendPaths) {
    if (fs.existsSync(possiblePath)) {
      frontendPath = possiblePath;
      console.log('✅ Found frontend at:', frontendPath);
      break;
    }
  }
  
  if (!frontendPath) {
    console.error('❌ Frontend directory not found! Tried paths:');
    possibleFrontendPaths.forEach(p => console.error('   -', p));
    console.error('❌ Current working directory:', process.cwd());
    console.error('❌ __dirname:', __dirname);
    console.error('❌ Make sure frontend is built: cd frontend && npm run build');
    
    // Fallback: Try to serve static HTML files if frontend path not found
    console.warn('⚠️ Attempting fallback static serving...');
    
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
      
      // If no HTML found, return a helpful error message
      console.warn(`⚠️ No HTML file found for path: ${req.path}`);
      res.status(404).send(`
        <html>
          <head><title>404 - Frontend Not Found</title></head>
          <body>
            <h1>404 - Frontend Not Found</h1>
            <p>The Next.js frontend could not be loaded.</p>
            <p>Please check the deployment logs for more information.</p>
            <p>Path: ${req.path}</p>
            <p>Working Directory: ${process.cwd()}</p>
            <p>__dirname: ${__dirname}</p>
          </body>
        </html>
      `);
    });
  } else {
    const frontendBuildPath = path.join(frontendPath, '.next');
    const staticPath = path.join(frontendBuildPath, 'static');
    
    // Declare nextHandler in this scope
    let nextHandler: ((req: express.Request, res: express.Response) => void) | null = null;
    
    console.log('📁 Frontend path:', frontendPath);
    console.log('📁 Frontend exists:', fs.existsSync(frontendPath));
    console.log('📁 .next exists:', fs.existsSync(frontendBuildPath));
    
    // Check if frontend is built - CRITICAL for production
    if (!fs.existsSync(frontendBuildPath)) {
      console.error('❌ CRITICAL: Frontend is not built! .next folder not found at:', frontendBuildPath);
      console.error('❌ Frontend path:', frontendPath);
      console.error('❌ Next.js handler cannot be created without a build.');
      console.error('❌ This usually means the frontend build step failed in render.yaml');
      // nextHandler is already null
    } else {
      console.log('✅ Frontend build found at:', frontendBuildPath);
      
      // Serve Next.js static assets
    if (fs.existsSync(staticPath)) {
      app.use('/_next/static', express.static(staticPath, { maxAge: '1y' }));
      console.log('✅ Static assets path configured:', staticPath);
    } else {
      console.warn('⚠️ Static path not found:', staticPath);
    }
    
      // Serve Next.js public assets
      const publicPath = path.join(frontendPath, 'public');
      if (fs.existsSync(publicPath)) {
        app.use(express.static(publicPath));
        console.log('✅ Public assets path configured:', publicPath);
      } else {
        console.warn('⚠️ Public path not found:', publicPath);
      }
      
      // Use Next.js package to create handler
      let nextApp: any = null;
      
      try {
      // Try to load next package (now installed in backend)
      let next: any = null;
      const nextPaths = [
        'next', // Try from backend's node_modules first (installed in backend/package.json)
        path.join(process.cwd(), 'node_modules/next'), // From backend/node_modules
        path.join(frontendPath, 'node_modules/next'), // From frontend/node_modules
        path.join(__dirname, '../../node_modules/next'), // From root/node_modules
        path.join(process.cwd(), '..', 'node_modules/next'), // From root/node_modules (alternative)
      ];
      
      console.log('🔍 Attempting to load Next.js package from paths:');
      for (const nextPath of nextPaths) {
        try {
          console.log(`   Trying: ${nextPath}`);
          next = require(nextPath);
          console.log('✅ Next.js package loaded from:', nextPath);
          break;
        } catch (e) {
          const errMsg = e instanceof Error ? e.message : String(e);
          console.log(`   ❌ Failed: ${errMsg}`);
          // Try next path
        }
      }
      
      if (!next) {
        throw new Error('Next.js package not found in any expected location');
      }
      
      // Create Next.js app instance
      nextApp = next.default({
        dev: process.env.NODE_ENV !== 'production',
        dir: frontendPath,
      });
      
      // Get the request handler (can be called before prepare)
      nextHandler = nextApp.getRequestHandler();
      console.log('✅ Next.js handler created successfully');
      
      // Prepare Next.js (this is async but we'll handle it)
      nextApp.prepare().then(() => {
        console.log('✅ Next.js prepared successfully');
      }).catch((err: unknown) => {
        console.error('❌ Next.js preparation failed:', err);
        // Don't set nextHandler to null - it can still work even if prepare fails
      });
    } catch (nextError: unknown) {
      const errorMsg = nextError instanceof Error ? nextError.message : String(nextError);
      const errorStack = nextError instanceof Error ? nextError.stack : '';
      console.error('❌ Failed to create Next.js handler:', errorMsg);
      if (errorStack) {
        console.error('❌ Stack:', errorStack);
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
      console.log('✅ Next.js route handler configured');
    } else {
      // Fallback: Add a basic route handler if Next.js is not available
      console.error('❌ Next.js handler not available - using fallback route handler');
      console.error('❌ This means Next.js handler creation failed. Check logs above for details.');
      app.all('*', (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (req.path.startsWith('/api') || req.path.startsWith('/_next') || req.path.startsWith('/health')) {
          return next();
        }
        res.status(404).json({ 
          error: 'Frontend not available. Please ensure Next.js is properly built and configured.',
          details: 'Check Render deployment logs for Next.js initialization errors.'
        });
      });
    }
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

