'use client';

import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const filterValues = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'expired', 'returned'] as const;

interface OrderFilterProps {
  currentValue?: string;
  queryKey?: string;
}

export default function OrderFilter({ currentValue, queryKey = 'status' }: OrderFilterProps) {
  const t = useTranslations('OrderFilter');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleFilterChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value === 'all') {
      params.delete(queryKey);
    } else {
      params.set(queryKey, value);
    }

    params.delete('page');

    const queryString = params.toString();

    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  }

  return (
    <Select value={currentValue || 'all'} onValueChange={handleFilterChange}>
      <SelectTrigger className='h-11 w-full rounded-md sm:w-44'>
        <SelectValue placeholder={t('placeholder')} />
      </SelectTrigger>

      <SelectContent position='popper'>
        {filterValues.map((value) => (
          <SelectItem key={value} value={value}>
            {t(value)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
