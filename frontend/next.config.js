/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep standalone but we'll serve static files only
  // Don't use the standalone server to avoid port conflicts
  output: 'standalone',
};

module.exports = nextConfig;

