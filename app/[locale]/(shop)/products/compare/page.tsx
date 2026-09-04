import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Link } from '@/i18n/routing';
import { getProductBySlug } from '@/services/product.service';
import { Product } from '@/types/product.type';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ slugs?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Compare' });
  return { title: t('title') };
}

/** Gom tên thuộc tính của mọi sản phẩm để bảng có đủ hàng, kể cả khi một bên thiếu. */
function collectSpecNames(products: Product[]): string[] {
  const names = new Set<string>();

  products.forEach((product) => {
    product.specifications?.forEach((spec) => names.add(spec.attributeName));
  });

  return [...names];
}

export default async function Page({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Compare' });

  const sp = await searchParams;
  const slugs = (sp.slugs ?? '').split(',').filter(Boolean).slice(0, 3);

  const responses = await Promise.all(slugs.map((slug) => getProductBySlug(slug)));

  const products = responses
    .map((response) => response.data?.data)
    .filter((product): product is Product => !!product);

  const formatVND = (value: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  if (!products.length) {
    return (
      <section className='py-10 text-center'>
        <h1 className='text-xl font-semibold'>{t('title')}</h1>
        <p className='text-muted-foreground mt-2'>{t('empty')}</p>
      </section>
    );
  }

  const specNames = collectSpecNames(products);

  return (
    <section className='space-y-4 py-8'>
      <h1 className='text-2xl font-semibold'>{t('title')}</h1>

      <div className='overflow-x-auto'>
        <table className='w-full min-w-[640px] border-collapse text-sm'>
          <tbody>
            <tr>
              <th className='w-40 border p-3 text-left'>{t('product')}</th>
              {products.map((product) => (
                <th key={product.id} className='border p-3 text-left font-medium'>
                  <Link href={`/products/${product.slug}`} className='hover:underline'>
                    {product.name}
                  </Link>
                </th>
              ))}
            </tr>

            <tr>
              <th className='border p-3 text-left'>{t('price')}</th>
              {products.map((product) => (
                <td key={product.id} className='border p-3'>
                  {formatVND(product.variants?.[0]?.price ?? 0)}
                </td>
              ))}
            </tr>

            <tr>
              <th className='border p-3 text-left'>{t('brand')}</th>
              {products.map((product) => (
                <td key={product.id} className='border p-3'>
                  {product.brand?.name}
                </td>
              ))}
            </tr>

            {specNames.map((name) => (
              <tr key={name}>
                <th className='border p-3 text-left'>{name}</th>
                {products.map((product) => (
                  <td key={product.id} className='border p-3'>
                    {product.specifications?.find((spec) => spec.attributeName === name)?.value ?? '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
