/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com'],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    serverComponentsExternalPackages: ['firebase', 'firebase-admin'],
  },
  async headers() {
    return [
      // 1. CORS headers for API routes
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
      // 2. Headers for cross-origin isolation to support Firebase Auth popups
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'credentialless', // or 'require-corp' if you need to share resources
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups', // Allows popups to communicate with main window
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin', // Allows resources to be loaded from any origin
          },
        ],
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;