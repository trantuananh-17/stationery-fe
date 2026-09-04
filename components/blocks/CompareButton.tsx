'use client';

import { GitCompareArrows } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSyncExternalStore } from 'react';
import { toast } from 'sonner';

import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import {
  CompareProduct,
  getCompareServerSnapshot,
  getCompareSnapshot,
  MAX_COMPARE_ITEMS,
  subscribeCompare,
  toggleCompare
} from '@/lib/compare';

type CompareButtonProps = {
  product: CompareProduct;
  className?: string;
};

export default function CompareButton({ product, className }: CompareButtonProps) {
  const t = useTranslations('Compare');

  const items = useSyncExternalStore(subscribeCompare, getCompareSnapshot, getCompareServerSnapshot);

  const selected = items.some((item) => item.productId === product.productId);

  function handleClick() {
    const ok = toggleCompare(product);

    if (!ok) {
      toast.error(t('limit', { max: MAX_COMPARE_ITEMS }), { position: 'top-right' });
    }
  }

  const compareHref = `/products/compare?slugs=${items.map((item) => item.slug).join(',')}`;

  return (
    <div className={className}>
      <Button type='button' variant={selected ? 'default' : 'outline'} size='icon' onClick={handleClick}>
        <GitCompareArrows />
      </Button>

      {items.length > 1 && (
        <Button asChild variant='link' size='sm'>
          <Link href={compareHref}>{t('compareCount', { count: items.length })}</Link>
        </Button>
      )}
    </div>
  );
}
