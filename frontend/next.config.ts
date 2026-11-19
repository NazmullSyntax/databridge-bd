import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  allowedDevOrigins: ["172.30.0.1", "localhost"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
}

export default nextConfig
