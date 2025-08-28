import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "**.whatsapp.net",
      },
      {
        protocol: "https",
        hostname: "**.liara.run",
      }
    ]
  }
};

export default nextConfig;
