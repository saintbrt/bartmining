import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Admin PDFs (src/lib/proposals/server.ts) print with headless Chromium.
  // Both packages stay out of the bundle, and the Chromium binary, which is
  // only read at runtime, is traced into the two routes that launch it.
  serverExternalPackages: ['puppeteer-core', '@sparticuz/chromium'],
  outputFileTracingIncludes: {
    '/api/admin/pdf': ['./node_modules/@sparticuz/chromium/bin/**'],
    '/api/admin/send': ['./node_modules/@sparticuz/chromium/bin/**'],
  },
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
      // Four products were withdrawn from the catalogue after they shipped
      // in #34, so their URLs may already be crawled. Send them to the hub
      // rather than leaving 404s behind.
      { source: '/equipment/diamond-core-drilling-rig', destination: '/equipment', permanent: true },
      { source: '/equipment/portable-xrf-analyser', destination: '/equipment', permanent: true },
      { source: '/equipment/magnetometer-geophysical-survey', destination: '/equipment', permanent: true },
      { source: '/equipment/borehole-water-pump', destination: '/equipment', permanent: true },
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
