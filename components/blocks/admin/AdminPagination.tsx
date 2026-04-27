'use client';

import type { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type AdminPaginationProps<TData> = {
  table: Table<TData>;
};

export default function AdminPagination<TData>({ table }: AdminPaginationProps<TData>) {
  return (
    <div className='mt-4 flex items-center justify-between'>
      <p className='text-muted-foreground text-sm'>
        Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
        {Math.min(
          (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
          table.getFilteredRowModel().rows.length
        )}{' '}
        of {table.getFilteredRowModel().rows.length} results
      </p>

      <div className='flex items-center gap-2'>
        <span className='text-muted-foreground text-sm'>Rows</span>

        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => table.setPageSize(Number(value))}
        >
          <SelectTrigger className='h-8 w-[70px]'>
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {[10, 20, 30].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant='outline' size='sm' disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}>
          Previous
        </Button>

        <Button variant='default' size='sm'>
          {table.getState().pagination.pageIndex + 1}
        </Button>

        <Button variant='outline' size='sm' disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}>
          Next
        </Button>
      </div>
    </div>
  );
}
