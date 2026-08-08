import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Cloudflare R2 public bucket URL — actualizar hostname cuando R2 esté configurado
        protocol: 'https',
        hostname: '**.r2.dev',
      },
      {
        // Dominio personalizado de R2 (si se usa CDN propio)
        protocol: 'https',
        hostname: process.env.R2_PUBLIC_HOSTNAME ?? 'placeholder.r2.dev',
      },
    ],
  },
}

export default nextConfig
