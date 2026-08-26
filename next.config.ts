import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  images: {
    unoptimized: true,
  },
  outputFileTracingIncludes: {
    '/api/muestra/[id]': ['./private/**'],
  },
}

export default nextConfig
