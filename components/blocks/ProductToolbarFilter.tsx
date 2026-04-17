'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type Option = {
  label: string;
  value: string;
};

interface Props {
  title: string;
  currentSort: string;
  currentBrand: string;
}
export default function ProductToolbarFilter({ title, currentSort, currentBrand }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const brands: Option[] = [
    { label: 'Thiên Long', value: 'thien-long' },
    { label: 'Deli', value: 'deli' },
    { label: 'Pilot', value: 'pilot' },
    { label: 'Stabilo', value: 'stabilo' }
  ];

  const sortOptions: Option[] = [
    { label: 'Sắp xếp theo độ phổ biến', value: 'popular' },
    { label: 'Sắp xếp theo mới nhất', value: 'newest' },
    { label: 'Sắp xếp theo giá tăng dần', value: 'price-asc' },
    { label: 'Sắp xếp theo giá giảm dần', value: 'price-desc' },
    { label: 'Sắp xếp theo tên A-Z', value: 'name-asc' }
  ];

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.set('page', '1');

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <section className='flex flex-col justify-between gap-4 sm:flex-row'>
      <h2 className='text-lg font-semibold lg:text-2xl'>{title}</h2>

      <div className='flex flex-col gap-3 sm:flex-row'>
        <Select
          value={currentBrand || '__all__'}
          onValueChange={(value) => updateQuery('brand', value === '__all__' ? '' : value)}
        >
          <SelectTrigger className='w-60 rounded-full sm:w-45'>
            <SelectValue placeholder='Lọc theo thương hiệu' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='__all__'>Tất cả thương hiệu</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand.value} value={brand.value}>
                {brand.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={currentSort} onValueChange={(value) => updateQuery('sort', value)}>
          <SelectTrigger className='w-60 rounded-full sm:w-48'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((sort) => (
              <SelectItem key={sort.value} value={sort.value}>
                {sort.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </section>
  );
}
