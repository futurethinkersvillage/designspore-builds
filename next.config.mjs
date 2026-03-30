

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'wellsgrayresort.ca' },
    ],
  },
  experimental: {
    optimizePackageImports: ['gsap'],
  },
}

export default nextConfig
