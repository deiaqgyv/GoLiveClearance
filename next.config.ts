import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // outputFileTracingRoot: path.resolve(__dirname, '../../'),  // Uncomment and add 'import path from "path"' if needed
  /* config options here */
  allowedDevOrigins: ['*.dev.coze.site'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/nextjs-launch-checklist",
        destination: "/nextjs-production-checklist",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
