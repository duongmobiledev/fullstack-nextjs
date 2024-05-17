/** @type {import('next').NextConfig} */
const { routes } = require('./src/routes');

const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return routes;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
      {
        source: '/receiver',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM=https://audinsights.app',
          },
          {
            key: 'Content-Security-Policy',
            value: `frame-ancestors 'self' https://audinsights.app`,
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
