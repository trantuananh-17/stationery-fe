import ProductDetail from '@/components/blocks/ProductDetail';
import { getProductBySlug } from '@/services/product.service';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getProduct(slug: string) {
  try {
    const res = await getProductBySlug(slug);

    if (!res?.ok || !res?.data?.data) {
      return null;
    }

    return res.data.data;
  } catch {
    return null;
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
