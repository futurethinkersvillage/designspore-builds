import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/sunday", destination: "/rhythm", permanent: true },
      { source: "/variant-a", destination: "/", permanent: false },
      { source: "/variant-b", destination: "/", permanent: false },
      { source: "/variant-c", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
