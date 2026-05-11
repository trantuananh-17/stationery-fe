'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const filterItems = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Chờ xử lý', value: 'pending' },
  { label: 'Đang xử lý', value: 'processing' },
  { label: 'Đang vận chuyển', value: 'shipped' },
  { label: 'Đã giao', value: 'delivered' },
  { label: 'Đã hủy', value: 'cancelled' }
];

interface OrderFilterProps {
  currentValue?: string;
  queryKey?: string;
}

export default function OrderFilter({ currentValue, queryKey = 'status' }: OrderFilterProps) {
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
        <SelectValue placeholder='Tất cả đơn hàng' />
      </SelectTrigger>

      <SelectContent position='popper'>
        {filterItems.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
