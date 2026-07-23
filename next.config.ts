import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray package-lock.json in the user home dir makes Turbopack infer the
  // wrong workspace root, breaking module resolution (tailwindcss not found).
  turbopack: {
    root: __dirname,
  },
  // Standalone apps live in public/projects/<name>/index.html. Without this,
  // the clean URL /projects/<name> 404s and only the explicit .../index.html
  // works. Returning an array applies these AFTER the filesystem/public check,
  // so real files (e.g. /projects/foo.html) still resolve directly.
  async rewrites() {
    return [
      { source: "/projects/:name", destination: "/projects/:name/index.html" },
    ];
  },
};

export default nextConfig;
