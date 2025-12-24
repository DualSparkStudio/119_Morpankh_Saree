/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // This allows Next.js to be served from Express backend
  // In production, API calls use relative paths (/api) since same domain
};

module.exports = nextConfig;

