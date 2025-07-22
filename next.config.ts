import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '', // Leave empty if no specific port is used by Cloudinary
        pathname: '/dgkqwomyg/image/upload/**', // This is crucial for Cloudinary paths
      },
      // You can add more patterns for other image hosts if needed
      // {
      //   protocol: 'https',
      //   hostname: 'example.com',
      // },
    ],
  },
  // Other
};

export default nextConfig;
