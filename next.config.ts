import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PSV (Photo Sphere Viewer) uses THREE.js and manages its own WebGL context.
  // It is not compatible with React StrictMode's double-effect behaviour in dev
  // (StrictMode creates+destroys+recreates the viewer, leaving the second
  // instance's loading spinner stuck permanently). Disabling StrictMode here
  // matches the production behaviour where effects only run once.
  reactStrictMode: false,
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
      // The member sales deck lives at /membership. /join is a legacy alias.
      { source: "/join", destination: "/membership", permanent: false },
    ];
  },
};

export default nextConfig;
