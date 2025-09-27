/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use export for production builds, not for development
  ...(process.env.NODE_ENV === "production" && { output: "export" }),
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
