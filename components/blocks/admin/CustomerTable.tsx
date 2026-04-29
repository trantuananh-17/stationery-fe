'use client';

import { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminTableToolbar from './AdminTableToolbar';

type CustomersTableProps = {
  customers: Customer[];
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);

const columns: ColumnDef<Customer>[] = [
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
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Họ tên
        <ArrowUpDown className='ml-1 size-4' />
      </Button>
    )
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
    cell: ({ row }) => <div className='max-w-[220px] truncate'>{row.original.address}</div>
  },
  {
    accessorKey: 'isActive',
    header: 'Trạng thái',
    cell: ({ row }) => (
      <Badge
        className={
          row.original.isActive
            ? 'inline-flex min-w-27.5 justify-center rounded-full bg-green-600 p-2 px-3 text-white'
            : 'inline-flex min-w-27.5 justify-center rounded-full bg-gray-300 px-3 py-1 text-black'
        }
      >
        <p className='p-0'>{row.original.isActive ? 'Hoạt động' : 'Không hoạt động'}</p>
      </Badge>
    )
  },
  {
    accessorKey: 'isVerfied',
    header: 'Xác minh',
    cell: ({ row }) => (
      <Badge
        className={
          row.original.isActive
            ? 'inline-flex min-w-27.5 justify-center rounded-full bg-green-600 p-2 px-3 py-1 text-white'
            : 'inline-flex min-w-27.5 justify-center rounded-full bg-gray-300 px-3 py-1 text-black'
        }
      >
        <p className='p-0'>{row.original.isVerfied ? 'Đã xác minh' : 'Chưa xác minh'}</p>
      </Badge>
    )
  },
  {
    accessorKey: 'orders',
    header: ({ column }) => (
      <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Đơn hàng
        <ArrowUpDown className='ml-1 size-4' />
      </Button>
    ),
    cell: ({ row }) => <div className='text-center'>{row.original.orders}</div>
  },
  {
    accessorKey: 'amountSpent',
    header: ({ column }) => (
      <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Chi tiêu
        <ArrowUpDown className='ml-1 size-4' />
      </Button>
    ),
    cell: ({ row }) => <div className='text-center'>{formatCurrency(row.original.amountSpent)}</div>
  },
  {
    accessorKey: 'createdAt',
    header: 'Ngày tạo'
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
          <DropdownMenuItem>Xem</DropdownMenuItem>
          <DropdownMenuItem>Sửa</DropdownMenuItem>
          <DropdownMenuItem className='text-destructive'>Xóa</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    enableSorting: false,
    enableHiding: false
  }
];

export default function CustomersTable({ customers }: CustomersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    firstName: false,
    lastName: false,
    isActive: false,
    isVerfied: false
  });

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
          name: 'Họ tên',
          firstName: 'Tên đệm',
          lastName: 'Tên',
          email: 'Email',
          address: 'Địa chỉ',
          isActive: 'Trạng thái',
          isVerfied: 'Xác minh',
          orders: 'Đơn hàng',
          amountSpent: 'Chi tiêu',
          createdAt: 'Ngày tạo'
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
