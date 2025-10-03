/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use default server output to support dynamic API routes
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
