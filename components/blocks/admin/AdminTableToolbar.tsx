// 'use client';

// import type { Table } from '@tanstack/react-table';
// import { Download, Search } from 'lucide-react';
// import { usePathname, useRouter, useSearchParams } from 'next/navigation';

// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';

// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// import AdminTableColumnsMenu from './AdminTableColumnsMenu';

// type FilterItem = {
//   label: string;
//   value: string;
// };

// interface Props<TData> {
//   table: Table<TData>;
//   searchColumn: string;
//   searchPlaceholder?: string;
//   columnLabels?: Record<string, string>;

//   filterItems?: FilterItem[];
//   queryKey?: string;
//   currentValue?: string;
// }

// export default function AdminTableToolbar<TData>({
//   table,
//   searchColumn,
//   searchPlaceholder = 'Tìm kiếm...',
//   columnLabels = {},

//   filterItems = [],
//   queryKey = 'status',
//   currentValue
// }: Props<TData>) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   function handleFilterChange(value: string) {
//     const params = new URLSearchParams(searchParams.toString());

//     if (value === 'all') {
//       params.delete(queryKey);
//     } else {
//       params.set(queryKey, value);
//     }

//     params.delete('page');

//     const queryString = params.toString();

//     router.push(queryString ? `${pathname}?${queryString}` : pathname);
//   }

//   return (
//     <div className='mb-4 flex items-center justify-between gap-3'>
//       <div className='flex items-center gap-2'>
//         {/* Search */}
//         <div className='relative w-90'>
//           <Search className='text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2' />

//           <Input
//             placeholder={searchPlaceholder}
//             className='bg-background pl-9'
//             value={(table.getColumn(searchColumn)?.getFilterValue() as string) ?? ''}
//             onChange={(event) => table.getColumn(searchColumn)?.setFilterValue(event.target.value)}
//           />
//         </div>
//       </div>

//       <div className='flex items-stretch gap-2'>
//         {/* Select filter */}
//         {filterItems.length > 0 && (
//           <Select value={currentValue || 'all'} onValueChange={handleFilterChange}>
//             <SelectTrigger className='w-40 flex-1'>
//               <SelectValue placeholder='Chọn' />
//             </SelectTrigger>

//             <SelectContent position={'popper'}>
//               {filterItems.map((item) => (
//                 <SelectItem key={item.value} value={item.value}>
//                   {item.label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         )}
//         <AdminTableColumnsMenu table={table} labels={columnLabels} />

//         <Button variant='outline' size='lg' className='h-9 gap-2'>
//           <Download className='size-4' />
//           Xuất
//         </Button>
//       </div>
//     </div>
//   );
// }

'use client';

import type { Table } from '@tanstack/react-table';
import { Download, Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import AdminTableColumnsMenu from './AdminTableColumnsMenu';

type FilterItem = {
  label: string;
  value: string;
};

interface Props<TData> {
  table: Table<TData>;
  searchColumn: string;
  searchPlaceholder?: string;
  columnLabels?: Record<string, string>;

  filterItems?: FilterItem[];
  queryKey?: string;
  currentValue?: string;
}

/* -------------------- Debounce Hook -------------------- */

function useDebounce<T>(value: T, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/* -------------------- Component -------------------- */

export default function AdminTableToolbar<TData>({
  table,
  searchColumn,
  searchPlaceholder = 'Tìm kiếm...',
  columnLabels = {},

  filterItems = [],
  queryKey = 'status',
  currentValue
}: Props<TData>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /* -------------------- Search -------------------- */

  const [search, setSearch] = useState(searchParams.get('search') ?? '');

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    const currentSearch = searchParams.get('search') ?? '';

    if (debouncedSearch === currentSearch) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    if (!debouncedSearch.trim()) {
      params.delete('search');
    } else {
      params.set('search', debouncedSearch);
    }

    params.delete('page');

    const queryString = params.toString();

    router.replace(queryString ? `${pathname}?${queryString}` : pathname);
  }, [debouncedSearch, pathname, router, searchParams]);

  /* -------------------- Filter -------------------- */

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
    <div className='mb-4 flex items-center justify-between gap-3'>
      <div className='flex items-center gap-2'>
        {/* Search */}
        <div className='relative w-90'>
          <Search className='text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2' />

          <Input
            placeholder={searchPlaceholder}
            className='bg-background pl-9'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className='flex items-stretch gap-2'>
        {/* Select filter */}
        {filterItems.length > 0 && (
          <Select value={currentValue || 'all'} onValueChange={handleFilterChange}>
            <SelectTrigger className='w-40 flex-1'>
              <SelectValue placeholder='Chọn' />
            </SelectTrigger>

            <SelectContent position={'popper'}>
              {filterItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <AdminTableColumnsMenu table={table} labels={columnLabels} />

        <Button variant='outline' size='lg' className='h-9 gap-2'>
          <Download className='size-4' />
          Xuất
        </Button>
      </div>
    </div>
  );
}
