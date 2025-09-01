// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Don’t fail the Vercel build on ESLint errors
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
