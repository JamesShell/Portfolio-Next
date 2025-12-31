/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Use built-in transpilation instead of deprecated next-transpile-modules
  transpilePackages: ['maath'],

  // Ignore ESLint errors during build (treat as warnings)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Ignore TypeScript errors during build (treat as warnings)
  typescript: {
    ignoreBuildErrors: true,
  },

  // Performance optimizations
  compress: true,

  // Experimental features for faster compilation
  experimental: {
    // Enable optimized package imports for heavy libraries
    optimizePackageImports: [
      '@phosphor-icons/react',
      'lucide-react',
      'react-icons',
      '@radix-ui/react-icons',
      'framer-motion',
      'gsap',
    ],
  },

  // Image optimization
  images: {
    domains: ['yourwebsite.com'], // Add your domain
    formats: ['image/webp', 'image/avif'],
  },

  // Headers for better SEO
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400',
          },
        ],
      },
    ];
  },

  // Redirects for better SEO
  async redirects() {
    return [
      // Add any necessary redirects here
    ];
  },
};

// Bundle analyzer configuration (run with ANALYZE=true npm run build)
const withBundleAnalyzer =
  process.env.ANALYZE === 'true'
    ? require('@next/bundle-analyzer')({ enabled: true })
    : (config) => config;

export default withBundleAnalyzer(nextConfig);
