import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Exclude mali-musavir-app from build
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
};

export default nextConfig;
