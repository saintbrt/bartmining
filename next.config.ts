import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async redirects() {
    return [
      // /products was folded into /equipment. Permanent so search engines
      // transfer the old URL's signals rather than treating it as a 404.
      { source: '/products', destination: '/equipment', permanent: true },
      { source: '/products/:path*', destination: '/equipment/:path*', permanent: true },
    ]
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // mapbox-gl is loaded from CDN at runtime; skip bundling it
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : config.externals ? [config.externals] : []),
        { 'mapbox-gl': 'mapboxgl' },
      ]
    }
    return config
  },
}

export default nextConfig
