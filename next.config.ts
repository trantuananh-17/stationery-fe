import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'deifkwefumgah.cloudfront.net'
      },
      {
        protocol: 'https',
        hostname: 'vanphongphamminaco.com'
      }
    ]
  }
};

export default nextConfig;
