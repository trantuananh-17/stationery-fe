import type { MetadataRoute } from 'next';

import { routing } from '@/i18n/routing';
import { getProducts } from '@/services/product.service';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

const STATIC_PATHS = ['', '/products', '/cart'];

// BFF trả tối đa theo `limit`; lấy một trang đủ lớn thay vì phân trang toàn bộ.
const PRODUCT_LIMIT = 500;

async function getProductSlugs(): Promise<string[]> {
  try {
    const res = await getProducts({ page: 1, limit: PRODUCT_LIMIT });

    if (!res?.ok || !res?.data?.data) return [];

    return res.data.data.items.map((item) => item.slug);
  } catch {
    // BFF chết thì vẫn phải trả sitemap của các trang tĩnh, không để vỡ build.
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getProductSlugs();

  const staticEntries = routing.locales.flatMap((locale) =>
    STATIC_PATHS.map((path) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: path === '' ? 1 : 0.8
    }))
  );

  const productEntries = routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({
      url: `${BASE_URL}/${locale}/products/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6
    }))
  );

  return [...staticEntries, ...productEntries];
}
