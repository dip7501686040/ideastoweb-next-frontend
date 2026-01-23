import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */

  // Enable experimental features for better subdomain support
  experimental: {
    // Enable server actions if needed
  },

  // Image domains for external images (if using next/image)
  images: {
    domains: []
  },

  // Headers for CORS and security
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on"
          }
        ]
      }
    ]
  }
}

export default nextConfig
