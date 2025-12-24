import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // This allows Next.js to be served from Express backend
  // In production, API calls use relative paths (/api) since same domain
};

export default nextConfig;
