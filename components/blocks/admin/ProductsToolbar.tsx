'use client';

import type { Table } from '@tanstack/react-table';
import { Download, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Product } from '@/app/(admin)/admin/products/page';
import ProductsColumnsMenu from './ProductsColumnsMenu';

export default function ProductsToolbar({ table }: { table: Table<Product> }) {
  return (
    <div className='mb-4 flex items-center justify-between gap-3'>
      <div className='relative w-90'>
        <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
        <Input
          placeholder='Search products...'
          className='pl-9'
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
        />
      </div>

      <div className='flex items-center gap-2'>
        <ProductsColumnsMenu table={table} />

        <Button variant='outline' size='sm' className='gap-2'>
          <Download className='h-4 w-4' />
          Export
        </Button>
      </div>
    </div>
  );
}
