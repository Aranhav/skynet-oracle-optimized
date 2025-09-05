/** @type {import('next').NextConfig} */
const urlFromEnv = process.env.NEXT_PUBLIC_STRAPI_URL || process.env.STRAPI_API_URL || ''
let remotePatterns = []
try {
  if (urlFromEnv) {
    const u = new URL(urlFromEnv)
    remotePatterns.push({ protocol: u.protocol.replace(':',''), hostname: u.hostname, port: u.port || undefined, pathname: '/**' })
  }
} catch {}

// Fallbacks for common deployments
remotePatterns.push(
  { protocol: 'https', hostname: 'skynet-cms-production.up.railway.app', pathname: '/**' },
  { protocol: 'http', hostname: 'localhost', pathname: '/**' },
  { protocol: 'http', hostname: '127.0.0.1', pathname: '/**' },
)

const nextConfig = {
  // Output optimization for Oracle server
  output: 'standalone',
  
  // Image optimization for local storage
  images: {
    domains: ['localhost'],
    remotePatterns,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
    minimumCacheTTL: 60,
  },

  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Build optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },

  // Static optimization
  staticPageGenerationTimeout: 300,

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },

  // Webpack optimization for ARM
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    config.optimization.minimize = true;
    
    return config;
  },

  // Server configuration
  serverRuntimeConfig: {
    port: process.env.PORT || 3000,
  },
}

module.exports = nextConfig
