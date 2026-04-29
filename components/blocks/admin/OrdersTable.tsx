'use client';

import { useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState
} from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';

import type { Order } from '@/app/(admin)/admin/orders/page';

import AdminPagination from '@/components/blocks/admin/AdminPagination';
import AdminTableToolbar from '@/components/blocks/admin/AdminTableToolbar';

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

type OrdersTableProps = {
  orders: Order[];
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);

const statusClass = {
  PENDING: 'bg-yellow-600 text-white hover:bg-yellow-500',
  PROCESSING: 'bg-blue-600 text-white hover:bg-blue-500',
  DELIVERED: 'bg-green-600 text-white hover:bg-green-500',
  CANCELLED: 'bg-red-600 text-white hover:bg-red-500'
};

const statusLabel = {
  PENDING: 'Chờ xử lý',
  PROCESSING: 'Đang xử lý',
  DELIVERED: 'Hoàn thành',
  CANCELLED: 'Đã hủy'
};

const columns: ColumnDef<Order>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} />
    )
  },
  {
    accessorKey: 'number',
    header: ({ column }) => (
      <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Mã đơn
        <ArrowUpDown className='ml-1 size-4' />
      </Button>
    )
  },
  {
    accessorKey: 'customer',
    header: 'Khách hàng'
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'product',
    header: 'Sản phẩm',
    cell: ({ row }) => <div className='max-w-[220px] truncate'>{row.original.product}</div>
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => (
      <Badge className={`${statusClass[row.original.status]} rounded-full px-3 py-1`}>
        {statusLabel[row.original.status]}
      </Badge>
    )
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Ngày tạo
        <ArrowUpDown className='ml-1 size-4' />
      </Button>
    ),
    cell: ({ row }) => <p className='text-center'>{row.original.createdAt}</p>
  },
  {
    accessorKey: 'total',
    header: ({ column }) => (
      <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Tổng tiền
        <ArrowUpDown className='ml-1 size-4' />
      </Button>
    ),
    cell: ({ row }) => <div className='text-center font-medium'>{formatCurrency(row.original.total)}</div>
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
          <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
          <DropdownMenuItem>Cập nhật</DropdownMenuItem>
          <DropdownMenuItem className='text-destructive'>Hủy đơn</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
];

export default function OrdersTable({ orders }: OrdersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: orders,
    columns,
    state: {
      sorting
    },
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
        searchColumn='number'
        searchPlaceholder='Tìm đơn hàng...'
        columnLabels={{
          number: 'Mã đơn',
          customer: 'Khách hàng',
          email: 'Email',
          product: 'Sản phẩm',
          status: 'Trạng thái',
          createdAt: 'Ngày tạo',
          total: 'Tổng tiền'
        }}
      />

      <div className='rounded-xl border'>
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
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AdminPagination table={table} />
    </div>
  );
}
