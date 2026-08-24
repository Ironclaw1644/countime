import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['maplibre-gl'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      // One canonical host. Both are attached to the Vercel project, so
      // without this they would serve the same pages at two URLs.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.countime.net' }],
        destination: 'https://countime.net/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
