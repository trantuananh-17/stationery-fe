'use client';

import { useTranslations } from 'next-intl';
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
  const t = useTranslations('ProductFilter');

  const brands: Option[] = [
    { label: 'Thiên Long', value: 'thien-long' },
    { label: 'Hồng Hà', value: 'hong-ha' },
    { label: 'Deli', value: 'deli' },
    { label: 'Staedtler', value: 'staedtler' },
    { label: 'Pronoti', value: 'pronoti' },
    { label: 'Flexio', value: 'flexio' },
    { label: 'IK Paper', value: 'ik-paper' },
    { label: 'Double A', value: 'double-a' },
    { label: 'Mickey', value: 'mickey' },
    { label: 'Uni Ball', value: 'uni-ball' },
    { label: 'Trà My', value: 'tra-my' },
    { label: 'Kw Trio', value: 'kw-trio' },
    { label: 'Shutter', value: 'shutter' },
    { label: 'Flexoffice', value: 'flexoffice' },
    { label: 'Casio', value: 'casio' },
    { label: 'King Star', value: 'king-star' },
    { label: 'Elephant', value: 'elephant' },
    { label: 'Bảo Kiên', value: 'bao-kien' },
    { label: 'Pentel', value: 'pentel' },
    { label: 'Hải Tiến', value: 'hai-tien' },
    { label: 'King Jim', value: 'king-jim' },
    { label: 'Plus', value: 'plus' },
    { label: 'Pagi', value: 'pagi' },
    { label: 'Hyphen', value: 'hyphen' },
    { label: 'Correction Pen', value: 'correction-pen' },
    { label: 'Toppoint', value: 'toppoint' },
    { label: 'Marvy', value: 'marvy' },
    { label: 'Keyroad', value: 'keyroad' }
  ];

  const sortOptions: Option[] = [
    { label: t('sortOptions.newest'), value: 'newest' },
    { label: t('sortOptions.oldest'), value: 'created_at_desc' },
    { label: t('sortOptions.price_asc'), value: 'price_asc' },
    { label: t('sortOptions.price_desc'), value: 'price_desc' },
    { label: t('sortOptions.name_asc'), value: 'name_asc' },
    { label: t('sortOptions.name_desc'), value: 'name_desc' }
  ];

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
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
            <SelectValue placeholder={t('filterByBrand')} />
          </SelectTrigger>

          <SelectContent position='popper'>
            <SelectItem value='__all__'>{t('allBrands')}</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand.value} value={brand.value}>
                {brand.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={currentSort || 'newest'} onValueChange={(value) => updateQuery('sort', value)}>
          <SelectTrigger className='w-60 rounded-full sm:w-56'>
            <SelectValue placeholder={t('sortNewest')} />
          </SelectTrigger>

          <SelectContent position='popper'>
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
