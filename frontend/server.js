const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = parseInt(process.env.PORT || '10000', 10);

// Create Next.js app
const nextApp = next({ dev, hostname, port });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  // Import the Express backend app (as a module, not starting its own server)
  const backendApp = require('../backend/dist/index.js').default || require('../backend/dist/index.js');
  
  // The backend app is already an Express app with all API routes configured
  // Add Next.js route handler as catch-all for non-API routes
  // This must be added AFTER all backend routes
  
  // Handle Next.js routes for all routes not handled by backend
  backendApp.all('*', (req, res) => {
    // Let Next.js handle all routes (backend middleware will have already handled /api and /health)
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // Start server using the backend app (which now includes Next.js handler)
  const server = backendApp.listen(port, hostname, (err) => {
    if (err) throw err;
    console.log(`🚀 Combined server ready on http://${hostname}:${port}`);
    console.log(`📡 API routes available at /api/*`);
    console.log(`🌐 Next.js frontend available at /*`);
  });
  
  server.on('error', (error) => {
    console.error('❌ Server error:', error);
    process.exit(1);
  });
}).catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
