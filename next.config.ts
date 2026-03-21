import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "designspore.co",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
