import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["bcryptjs"],
  async redirects() {
    return [
      // People who search the tool by name still land on the offer page.
      { source: "/openclaw", destination: "/ai-team", permanent: true },
    ];
  },
};

export default nextConfig;
