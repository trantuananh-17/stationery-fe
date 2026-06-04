import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['192.168.30.103'],
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

export default withNextIntl(nextConfig);
