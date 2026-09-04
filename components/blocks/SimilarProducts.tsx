'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { Link } from '@/i18n/routing';
import { Card, CardContent } from '@/components/ui/card';
import { getSimilarProducts } from '@/services/discovery.service';

type SimilarProductsProps = {
  productId: string;
  className?: string;
};

export default function SimilarProducts({ productId, className }: SimilarProductsProps) {
  const t = useTranslations('Discovery');

  const { data: items } = useQuery({
    queryKey: ['similar-products', productId],
    queryFn: async () => {
      const response = await getSimilarProducts(productId, 4);

      return response.data?.data?.items ?? [];
    }
  });

  const formatVND = (value: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  // ai-service có thể chưa index hoặc đang chết — khi đó ẩn hẳn khối này.
  if (!items?.length) return null;

  return (
    <section className={className}>
      <h3 className='mb-4 text-xl font-semibold'>{t('similarTitle')}</h3>

      <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
        {items.map((item) => (
          <Card key={item.productId} className='p-0'>
            <CardContent className='space-y-2 p-3'>
              <Link href={`/products/${item.slug}`}>
                {item.thumbnail ? (
                  <Image
                    src={item.thumbnail}
                    alt={item.name}
                    width={200}
                    height={200}
                    className='aspect-square w-full rounded object-cover'
                  />
                ) : (
                  <div className='bg-muted aspect-square w-full rounded' />
                )}
              </Link>

              <Link href={`/products/${item.slug}`} className='line-clamp-2 text-sm font-medium hover:underline'>
                {item.name}
              </Link>

              <p className='text-muted-foreground text-xs'>{formatVND(item.price)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
