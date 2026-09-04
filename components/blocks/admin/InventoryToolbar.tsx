'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type InventoryToolbarProps = {
  currentSearch: string;
  lowStockOnly: boolean;
};

export default function InventoryToolbar({ currentSearch, lowStockOnly }: InventoryToolbarProps) {
  const t = useTranslations('AdminInventories');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(currentSearch);

  function pushParams(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());

    mutate(params);
    params.delete('page');

    const queryString = params.toString();

    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  }

  function handleSearch() {
    pushParams((params) => {
      if (search.trim()) {
        params.set('search', search.trim());
      } else {
        params.delete('search');
      }
    });
  }

  function toggleLowStock() {
    pushParams((params) => {
      if (lowStockOnly) {
        params.delete('lowStock');
      } else {
        params.set('lowStock', '1');
      }
    });
  }

  return (
    <div className='flex flex-col gap-2 sm:flex-row'>
      <div className='flex flex-1 gap-2'>
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && handleSearch()}
          placeholder={t('searchPlaceholder')}
        />

        <Button variant='outline' onClick={handleSearch}>
          <Search />
        </Button>
      </div>

      <Button variant={lowStockOnly ? 'default' : 'outline'} onClick={toggleLowStock}>
        {t('lowStockOnly')}
      </Button>
    </div>
  );
}
