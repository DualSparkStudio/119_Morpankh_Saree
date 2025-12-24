/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove standalone - we'll use next package directly with Express
  // This allows us to use next.getRequestHandler() in the backend
};

module.exports = nextConfig;

