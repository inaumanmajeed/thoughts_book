/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Optimize for Vercel serverless functions
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Remove console logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'], 
    } : false,
  },
};

module.exports = nextConfig;
