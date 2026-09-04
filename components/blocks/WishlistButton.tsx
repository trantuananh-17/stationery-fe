'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { addWishlistItem, getWishlist, removeWishlistItem } from '@/services/wishlist.service';
import { useAuthStore } from '@/stores/auth-store';
import { WishlistItemInput } from '@/types/wishlist.type';

type WishlistButtonProps = {
  product: WishlistItemInput;
  className?: string;
};

export default function WishlistButton({ product, className }: WishlistButtonProps) {
  const t = useTranslations('Wishlist');
  const queryClient = useQueryClient();

  const accessToken = useAuthStore((state) => state.accessToken);

  const { data: items } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const response = await getWishlist(accessToken);

      return response.data?.data ?? [];
    },
    enabled: !!accessToken
  });

  const inWishlist = !!items?.some((item) => item.productId === product.productId);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const response = inWishlist
        ? await removeWishlistItem(accessToken, product.productId)
        : await addWishlistItem(accessToken, product);

      if (!response.ok) throw new Error('wishlist request failed');
    },
    onSuccess: () => {
      toast.success(inWishlist ? t('removed') : t('added'), { position: 'top-right' });
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
    onError: () => {
      toast.error(t('error'), { position: 'top-right' });
    }
  });

  function handleClick() {
    if (!accessToken) {
      toast.error(t('needLogin'), { position: 'top-right' });
      return;
    }

    mutate();
  }

  return (
    <Button
      type='button'
      variant='outline'
      size='icon'
      aria-label={inWishlist ? t('remove') : t('add')}
      onClick={handleClick}
      disabled={isPending}
      className={className}
    >
      <Heart className={cn(inWishlist && 'fill-red-500 text-red-500')} />
    </Button>
  );
}
