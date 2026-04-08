import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "old-site.portal.place",
      },
      {
        protocol: "http",
        hostname: "old-site.portal.place",
      },
    ],
  },
};

export default nextConfig;
