'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type TabItem = {
  label: string;
  value: string;
};

interface Props {
  items: TabItem[];
  queryKey: string;
  currentValue?: string;
}

export function QueryTabs({ items, queryKey, currentValue }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(value: string) {
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
    <div className='bg-muted-foreground/10 inline-flex rounded-xl p-1'>
      {items.map((item) => {
        const isActive = currentValue === item.value || (!currentValue && item.value === 'all');

        return (
          <button
            key={item.value}
            type='button'
            onClick={() => handleChange(item.value)}
            className={[
              'rounded-lg px-2 py-1 text-sm transition',
              isActive ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
            ].join(' ')}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
