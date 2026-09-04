'use client';

import { Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { createReview } from '@/services/review.service';

type ReviewFormProps = {
  productId: string;
  accessToken: string | null;
  initialRating?: number;
  initialComment?: string;
  onSubmitted: () => void;
};

const MAX_STARS = 5;

export default function ReviewForm({
  productId,
  accessToken,
  initialRating = 0,
  initialComment = '',
  onSubmitted
}: ReviewFormProps) {
  const t = useTranslations('ProductReview');

  const [rating, setRating] = useState(initialRating);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState(initialComment);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (rating < 1) {
      toast.error(t('ratingRequired'), { position: 'top-right' });
      return;
    }

    if (!comment.trim()) {
      toast.error(t('commentRequired'), { position: 'top-right' });
      return;
    }

    setSubmitting(true);

    const response = await createReview(accessToken, productId, { rating, comment: comment.trim() });

    setSubmitting(false);

    if (!response.ok) {
      toast.error(t('submitError'), { position: 'top-right' });
      return;
    }

    toast.success(t('submitSuccess'), { position: 'top-right' });
    onSubmitted();
  }

  return (
    <div className='space-y-3 rounded-lg border p-4'>
      <p className='font-medium'>{t('writeReview')}</p>

      <div className='flex gap-1'>
        {Array.from({ length: MAX_STARS }).map((_, index) => {
          const value = index + 1;
          const active = value <= (hovered || rating);

          return (
            <button
              key={value}
              type='button'
              aria-label={t('starLabel', { value })}
              onClick={() => setRating(value)}
              onMouseEnter={() => setHovered(value)}
              onMouseLeave={() => setHovered(0)}
            >
              <Star
                className={cn('size-6', active ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground')}
              />
            </button>
          );
        })}
      </div>

      <Textarea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder={t('commentPlaceholder')}
        maxLength={2000}
        rows={4}
      />

      <div className='flex justify-end'>
        <Button onClick={handleSubmit} disabled={submitting}>
          {submitting ? t('submitting') : t('submit')}
        </Button>
      </div>
    </div>
  );
}
