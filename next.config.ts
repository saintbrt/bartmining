import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
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
