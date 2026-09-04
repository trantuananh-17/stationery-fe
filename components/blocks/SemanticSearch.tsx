'use client';

import { useMutation } from '@tanstack/react-query';
import { Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';

import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { semanticSearch } from '@/services/discovery.service';
import { SemanticProduct } from '@/types/discovery.type';

export default function SemanticSearch({ className }: { className?: string }) {
  const t = useTranslations('Discovery');

  const [query, setQuery] = useState('');
  const [items, setItems] = useState<SemanticProduct[] | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const response = await semanticSearch(query.trim(), 8);

      return response.data?.data?.items ?? [];
    },
    onSuccess: setItems
  });

  const formatVND = (value: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  return (
    <section className={className}>
      <div className='space-y-2'>
        <p className='text-muted-foreground flex items-center gap-2 text-sm'>
          <Sparkles className='size-4' />
          {t('semanticHint')}
        </p>

        <div className='flex gap-2'>
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && query.trim() && mutate()}
            placeholder={t('semanticPlaceholder')}
          />

          <Button onClick={() => mutate()} disabled={isPending || !query.trim()}>
            {isPending ? t('searching') : t('search')}
          </Button>
        </div>
      </div>

      {items !== null && (
        <div className='mt-4'>
          <h3 className='mb-3 font-semibold'>{t('semanticTitle')}</h3>

          {items.length === 0 ? (
            <p className='text-muted-foreground text-sm'>{t('noResult')}</p>
          ) : (
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

                    <Link
                      href={`/products/${item.slug}`}
                      className='line-clamp-2 text-sm font-medium hover:underline'
                    >
                      {item.name}
                    </Link>

                    <p className='text-muted-foreground text-xs'>{formatVND(item.price)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
