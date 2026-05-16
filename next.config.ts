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
      },
      {
        protocol: 'https',
        hostname: 'shoes-ecommerce.s3.ap-southeast-1.amazonaws.com',
        port: '',
        pathname: '/**'
      }
    ]
  }
};

export default nextConfig;
