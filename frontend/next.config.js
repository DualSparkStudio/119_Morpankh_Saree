/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimizations for Render deployment
  output: undefined, // Use default output (not standalone) so Express can serve it
  poweredByHeader: false, // Remove X-Powered-By header for security
  compress: true, // Enable compression
  reactStrictMode: true,
  // Ensure API routes work correctly when served from Express
  async rewrites() {
    return [];
  },
};

module.exports = nextConfig;

