// Custom Next.js Server with Express API Integration
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname: 'localhost', port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Import and start Express API server
  const expressPath = path.resolve(__dirname, '../backend/dist/index.js');
  let expressApp;
  
  try {
    // Express will handle its own server
    require(expressPath);
    console.log('✅ Express API server started');
  } catch (error) {
    console.error('⚠️  Could not start Express API:', error.message);
  }
  
  // Create Next.js server
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname } = parsedUrl;
      
      // Proxy API requests to Express (if running separately)
      if (pathname?.startsWith('/api')) {
        // For production, API should be on same server
        // This will be handled by Next.js rewrites
        return handle(req, res, parsedUrl);
      }
      
      // Handle Next.js routes
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  }).listen(port, () => {
    console.log(`> Next.js ready on http://localhost:${port}`);
  });
});

