import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Cloudflare R2 public bucket URL — update hostname once R2 is configured
        protocol: 'https',
        hostname: '**.r2.dev',
      },
      {
        // Custom R2 domain (if using a custom CDN)
        protocol: 'https',
        hostname: process.env.R2_PUBLIC_HOSTNAME ?? 'placeholder.r2.dev',
      },
    ],
  },
}

export default nextConfig
