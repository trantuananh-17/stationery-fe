'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Heart, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { toast } from 'sonner';

import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Spinner } from '@/components/ui/spinner';
import { getWishlist, removeWishlistItem } from '@/services/wishlist.service';
import { useAuthStore } from '@/stores/auth-store';

export default function WishlistClient() {
  const t = useTranslations('Wishlist');
  const queryClient = useQueryClient();

  const accessToken = useAuthStore((state) => state.accessToken);

  const { data: items, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const response = await getWishlist(accessToken);

      return response.data?.data ?? [];
    },
    enabled: !!accessToken
  });

  async function handleRemove(productId: string) {
    const response = await removeWishlistItem(accessToken, productId);

    if (!response.ok) {
      toast.error(t('error'), { position: 'top-right' });
      return;
    }

    toast.success(t('removed'), { position: 'top-right' });
    queryClient.invalidateQueries({ queryKey: ['wishlist'] });
  }

  const formatVND = (value: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  if (isLoading) {
    return (
      <div className='flex justify-center py-10'>
        <Spinner className='text-primary size-10' />
      </div>
    );
  }

  if (!items?.length) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <Heart />
          </EmptyMedia>

          <EmptyTitle>{t('emptyTitle')}</EmptyTitle>
          <EmptyDescription>{t('emptyDescription')}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {items.map((item) => (
        <Card key={item.id} className='p-0'>
          <CardContent className='space-y-3 p-4'>
            <Link href={`/products/${item.productSlug}`} className='block'>
              {item.thumbnail ? (
                <Image
                  src={item.thumbnail}
                  alt={item.productName}
                  width={300}
                  height={300}
                  className='aspect-square w-full rounded object-cover'
                />
              ) : (
                <div className='bg-muted aspect-square w-full rounded' />
              )}
            </Link>

            <div className='space-y-1'>
              <Link href={`/products/${item.productSlug}`} className='line-clamp-2 font-medium hover:underline'>
                {item.productName}
              </Link>

              <p className='text-muted-foreground text-sm'>{formatVND(item.price)}</p>
            </div>

            <Button
              variant='outline'
              size='sm'
              className='text-destructive w-full'
              onClick={() => handleRemove(item.productId)}
            >
              <Trash2 /> {t('remove')}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
