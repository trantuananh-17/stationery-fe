'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import ReviewForm from '@/components/blocks/ReviewForm';
import Reviews from '@/components/blocks/Reviews';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { deleteReview, getReviews } from '@/services/review.service';
import { useAuthStore } from '@/stores/auth-store';

type ProductReviewSectionProps = {
  productId: string;
  className?: string;
};

const PAGE_SIZE = 5;

export default function ProductReviewSection({ productId, className }: ProductReviewSectionProps) {
  const t = useTranslations('ProductReview');
  const queryClient = useQueryClient();

  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);

  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['reviews', productId, page],
    queryFn: async () => {
      const response = await getReviews(productId, { page, limit: PAGE_SIZE });

      return response.data?.data ?? null;
    }
  });

  const invalidate = () => {
    setPage(1);
    queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
  };

  const myReview = data?.items.find((review) => review.userId === user?.userId);

  async function handleDelete() {
    const response = await deleteReview(accessToken, productId);

    if (!response.ok) {
      toast.error(t('deleteError'), { position: 'top-right' });
      return;
    }

    toast.success(t('deleteSuccess'), { position: 'top-right' });
    invalidate();
  }

  const summary = data?.summary ?? { average: 0, count: 0 };

  return (
    <div className={className}>
      <h3 className='mb-4 text-2xl font-semibold'>{t('title')}</h3>

      <div className='space-y-5'>
        <Reviews rate={summary.average} totalReviewers={summary.count} size='lg' />

        {accessToken && !myReview && (
          <ReviewForm productId={productId} accessToken={accessToken} onSubmitted={invalidate} />
        )}

        {isLoading ? (
          <div className='flex justify-center py-6'>
            <Spinner className='text-primary size-8' />
          </div>
        ) : data?.items.length ? (
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            {data.items.map((review) => (
              <Card key={review.id} className='p-0'>
                <CardContent className='space-y-3 p-4'>
                  <div className='flex items-center justify-between gap-2'>
                    <div className='flex items-center gap-2'>
                      <Avatar className='size-8'>
                        <AvatarFallback>{review.userName.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>

                      <div>
                        <p className='text-sm font-medium'>{review.userName}</p>
                        <Reviews rate={review.rating} size='sm' />
                      </div>
                    </div>

                    {review.userId === user?.userId && (
                      <Button variant='ghost' size='sm' className='text-destructive' onClick={handleDelete}>
                        <Trash2 />
                      </Button>
                    )}
                  </div>

                  <Separator />

                  <p className='text-sm'>{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className='text-muted-foreground text-sm'>{t('empty')}</p>
        )}

        {data && data.totalPages > 1 && (
          <div className='flex justify-center gap-2'>
            <Button variant='outline' size='sm' disabled={page <= 1} onClick={() => setPage(page - 1)}>
              {t('previous')}
            </Button>

            <Button
              variant='outline'
              size='sm'
              disabled={page >= data.totalPages}
              onClick={() => setPage(page + 1)}
            >
              {t('next')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
