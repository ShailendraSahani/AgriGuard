// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
   webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      net: false,
      tls: false,
      fs: false,
    };
    return config;
  },
  images: {
    remotePatterns: [
      // Cloudinary
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      // AWS S3 buckets
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.s3.*.amazonaws.com",
      },
      // Firebase Storage
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      // Supabase
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      // Generic CDN example
      {
        protocol: "https",
        hostname: "cdn.*.com",
      },
    ],
  },
};

export default nextConfig;
