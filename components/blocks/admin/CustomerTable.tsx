'use client';

import { useState, useMemo } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
  type ColumnDef,
  type SortingState
} from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Search } from 'lucide-react';

import type { Customer } from '@/app/(admin)/admin/customers/page';

import AdminPagination from '@/components/blocks/admin/AdminPagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminTableToolbar from './AdminTableToolbar';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { StatusBadge } from './StatusBadge';

export type CustomerSort =
  | 'newest'
  | 'oldest'
  | 'order_asc'
  | 'order_desc'
  | 'total_asc'
  | 'total_desc'
  | 'created_at_asc'
  | 'created_at_desc';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);

type CustomersTableProps = {
  customers: Customer[];
  currentSort: string;
};

export default function CustomersTable({ customers, currentSort }: CustomersTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleSort(sort: CustomerSort) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sort);
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  }

  function getNextSort(currentSort: string, asc: CustomerSort, desc: CustomerSort) {
    if (currentSort === asc) {
      console.log('desc');

      return desc;
    }

    console.log('hello asc');

    return asc;
  }

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    firstName: false,
    lastName: false,
    isActive: false,
    isVerified: false,
    actions: false
  });

  const columns = useMemo<ColumnDef<Customer>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          />
        ),
        cell: ({ row }) => (
          <div onClick={(e) => e.stopPropagation()}>
            <Checkbox
              className='cursor-pointer'
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: true
      },
      {
        accessorKey: 'name',
        header: 'Họ tên'
      },
      {
        accessorKey: 'firstName',
        header: 'Tên đệm'
      },
      {
        accessorKey: 'lastName',
        header: 'Tên'
      },
      {
        accessorKey: 'email',
        header: 'Email'
      },
      {
        accessorKey: 'address',
        header: 'Địa chỉ',
        cell: ({ row }) => <div className='max-w-60 truncate'>{row.original.address}</div>
      },
      {
        accessorKey: 'isActive',
        header: 'Trạng thái',
        cell: ({ row }) => <StatusBadge status={row.original.isActive ? 'ACTIVE_TRUE' : 'ACTIVE_FALSE'} />
      },
      {
        accessorKey: 'isVerified',
        header: 'Xác minh',
        cell: ({ row }) => <StatusBadge status={row.original.isVerified ? 'VERIFIED_TRUE' : 'VERIFIED_FALSE'} />
      },
      {
        accessorKey: 'orders',
        header: () => (
          <Button variant='ghost' onClick={() => handleSort(getNextSort(currentSort, 'order_asc', 'order_desc'))}>
            Đơn hàng
            <ArrowUpDown className='ml-1 size-4' />
          </Button>
        ),
        cell: ({ row }) => <div className='text-center'>{row.original.orders}</div>
      },
      {
        accessorKey: 'amountSpent',
        header: () => (
          <Button variant='ghost' onClick={() => handleSort(getNextSort(currentSort, 'total_asc', 'total_desc'))}>
            Chi tiêu
            <ArrowUpDown className='ml-1 size-4' />
          </Button>
        ),
        cell: ({ row }) => <div className='text-center'>{formatCurrency(row.original.amountSpent)}</div>
      },
      {
        accessorKey: 'createdAt',
        header: () => (
          <Button
            variant='ghost'
            className='px-0'
            onClick={() => handleSort(getNextSort(currentSort, 'created_at_asc', 'created_at_desc'))}
          >
            Ngày tạo
            <ArrowUpDown className='ml-1 size-4' />
          </Button>
        )
      },
      {
        id: 'actions',
        cell: () => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon'>
                <MoreHorizontal className='size-4' />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align='end'>
              <DropdownMenuItem>Xem thông tin</DropdownMenuItem>
              <DropdownMenuItem className='text-destructive'>Xóa</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        enableSorting: false,
        enableHiding: true
      }
    ],
    []
  );

  const table = useReactTable({
    data: customers,
    columns,
    state: {
      sorting,
      columnVisibility
    },
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  return (
    <div className='space-y-4'>
      <AdminTableToolbar
        table={table}
        searchColumn='name'
        searchPlaceholder='Tìm khách hàng...'
        columnLabels={{
          select: 'Lựa chọn',
          name: 'Họ tên',
          firstName: 'Tên đệm',
          lastName: 'Tên',
          email: 'Email',
          address: 'Địa chỉ',
          isActive: 'Trạng thái',
          isVerified: 'Xác minh',
          orders: 'Đơn hàng',
          amountSpent: 'Chi tiêu',
          createdAt: 'Ngày tạo',
          actions: 'Hành động'
        }}
      />

      <div className='bg-background rounded-xl border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => router.push(`/admin/customers/${row.original.id}`)}
                className='cursor-pointer'
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* <AdminPagination table={table} /> */}
    </div>
  );
}
