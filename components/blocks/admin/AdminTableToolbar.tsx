'use client';

import type { Table } from '@tanstack/react-table';
import { Download, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import AdminTableColumnsMenu from './AdminTableColumnsMenu';

interface Props<TData> {
  table: Table<TData>;
  searchColumn: string;
  searchPlaceholder?: string;
  columnLabels?: Record<string, string>;
}

export default function AdminTableToolbar<TData>({
  table,
  searchColumn,
  searchPlaceholder = 'Tìm kiếm...',
  columnLabels = {}
}: Props<TData>) {
  return (
    <div className='mb-4 flex items-center justify-between gap-3'>
      <div className='relative w-90'>
        <Search className='text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2' />

        <Input
          placeholder={searchPlaceholder}
          className='bg-background pl-9'
          value={(table.getColumn(searchColumn)?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn(searchColumn)?.setFilterValue(event.target.value)}
        />
      </div>

      <div className='flex items-center gap-2'>
        <AdminTableColumnsMenu table={table} labels={columnLabels} />

        <Button variant='outline' size='sm' className='gap-2'>
          <Download className='size-4' />
          Xuất
        </Button>
      </div>
    </div>
  );
}
