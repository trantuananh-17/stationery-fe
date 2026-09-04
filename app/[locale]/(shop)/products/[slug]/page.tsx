import type { Metadata } from 'next';

import ProductDetail from '@/components/blocks/ProductDetail';
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const product = await getProduct(slug);

  if (!product) return {};

  const title = product.seoTitle || product.name;
  const description = product.seoDescription || product.shortDescription || product.name;

  return {
    title,
    description,
    alternates: {
      canonical: `/products/${product.slug}`
    },
    openGraph: {
      type: 'website',
      title,
      description,
      images: product.thumbnail ? [{ url: product.thumbnail, alt: product.name }] : undefined
    }
  };
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
    </>
  );
}
