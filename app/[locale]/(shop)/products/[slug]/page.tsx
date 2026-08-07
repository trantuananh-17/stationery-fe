import ProductDetail from '@/components/blocks/ProductDetail';
import RelatedProduct from '@/components/blocks/RelatedProduct';
import { routing } from '@/i18n/routing';
import { getProductBySlug } from '@/services/product.service';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

async function getProduct(slug: string) {
  try {
    const res = await getProductBySlug(slug);
    if (!res?.ok || !res?.data?.data) return null;
    return res.data.data;
  } catch {
    return null;
  }
}

export function generateStaticParams() {
  // Generate per locale; slug is dynamic (fetched on demand)
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Page({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const product = await getProduct(slug);

  if (!product) notFound();

  return (
    <>
      <ProductDetail product={product} />
      <RelatedProduct />
    </>
  );
}
