/** @type {import('next').NextConfig} */
const nextConfig = {
  // Don't use standalone - use custom server instead
  poweredByHeader: false,
  reactStrictMode: true,
};

module.exports = nextConfig;

