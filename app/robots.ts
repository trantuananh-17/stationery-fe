import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Khu vực cần đăng nhập hoặc quyền admin, không có gì để index.
        disallow: ['/api/', '/vi/admin/', '/en/admin/', '/vi/account/', '/en/account/', '/vi/checkouts', '/en/checkouts']
      }
    ],
    sitemap: `${BASE_URL}/sitemap.xml`
  };
}
