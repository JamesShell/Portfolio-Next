import withTM from 'next-transpile-modules';

// Add the 'maath' package to the list of modules to be transpiled
const nextConfig = withTM(['maath'])({
  reactStrictMode: true,
  poweredByHeader: false,
  
  // Ignore ESLint errors during build (treat as warnings)
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Ignore TypeScript errors during build (treat as warnings) 
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // SEO Optimizations
  compress: true,
  
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
});

export default nextConfig;
