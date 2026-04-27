'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const tabs = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Draft', value: 'draft' },
  { label: 'Archived', value: 'archived' }
];

export function ProductsTabs({ currentStatus }: { currentStatus: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChangeStatus(status: string) {
    const params = new URLSearchParams(searchParams);

    if (status === 'all') {
      params.delete('status');
    } else {
      params.set('status', status);
    }

    router.push(`?${params.toString()}`);
  }

  return (
    <div className='bg-muted inline-flex rounded-xl p-1'>
      {tabs.map((tab) => {
        const isActive = currentStatus === tab.value || (!currentStatus && tab.value === 'all');

        return (
          <button
            key={tab.value}
            onClick={() => handleChangeStatus(tab.value)}
            className={[
              'rounded-lg px-4 py-2 text-sm transition',
              isActive ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            ].join(' ')}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
