'use client';

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  VisibilityState,
  type ColumnDef
} from '@tanstack/react-table';

import { ArrowUpDown, MoreHorizontal } from 'lucide-react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useMemo, useState } from 'react';

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

import { Order } from '@/types/order.type';

import { formatDate, grpcTimestampToDate } from '@/lib/utils';
import { StatusBadge } from './StatusBadge';

export type OrderSort = 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'created_at_asc' | 'created_at_desc';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);

const statusClass = {
  PENDING: 'border border-amber-500/30 bg-amber-500/25 text-amber-800 hover:bg-amber-500/25',
  PROCESSING: 'border border-sky-500/30 bg-sky-500/25 text-sky-800 hover:bg-sky-500/25',
  SHIPPED: 'border border-indigo-500/30 bg-indigo-500/25 text-indigo-800 hover:bg-indigo-500/25',
  DELIVERED: 'border border-emerald-500/30 bg-emerald-500/25 text-emerald-800 hover:bg-emerald-500/25',
  CANCELLED: 'border border-rose-500/30 bg-rose-500/25 text-rose-800 hover:bg-rose-500/25'
};

const statusLabel = {
  PENDING: 'Chờ xử lý',
  PROCESSING: 'Đang xử lý',
  SHIPPED: 'Đang vận chuyển',
  DELIVERED: 'Hoàn thành',
  CANCELLED: 'Đã hủy'
};

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export const paymentStatusLabel = {
  PENDING: 'Chưa thanh toán',
  PAID: 'Đã thanh toán',
  FAILED: 'Thanh toán lỗi',
  REFUNDED: 'Đã hoàn tiền'
};

export const paymentStatusClass = {
  PENDING: 'bg-amber-600 text-white hover:bg-amber-600',
  PAID: 'bg-emerald-600 text-white hover:bg-emerald-600',
  FAILED: 'bg-rose-600 text-white hover:bg-rose-600',
  REFUNDED: 'bg-sky-600 text-white hover:bg-sky-600'
};

function getNextSort(currentSort: string, asc: OrderSort, desc: OrderSort) {
  if (currentSort === asc) {
    return desc;
  }

  return asc;
}

type OrdersTableProps = {
  orders: Order[];
  currentSort: string;
  currentStatus: string;
};

export default function OrdersTable({ orders, currentSort, currentStatus }: OrdersTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    actions: false,
    product: false
  });

  function handleSort(sort: OrderSort) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sort);
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  }

  const columns = useMemo<ColumnDef<Order>[]>(
    () => [
      {
        id: 'select',
        accessorKey: 'select',
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
        enableHiding: false
      },

      {
        accessorKey: 'number',
        header: 'Mã đơn',
        cell: ({ row }) => <div className='truncate'>{row.original.orderNumber}</div>
      },
      {
        accessorKey: 'customer',
        header: 'Khách hàng',
        cell: ({ row }) => <div className='max-w-[100px] truncate'>{row.original.customerName}</div>
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => <div className='truncate'>{row.original.customerEmail}</div>
      },
      {
        accessorKey: 'product',
        header: 'Sản phẩm',
        cell: ({ row }) => <div className='max-w-[220px] truncate'>{row.original.productName}</div>
      },
      {
        accessorKey: 'status',
        header: 'Trạng thái',
        cell: ({ row }) => <StatusBadge status={row.original.status} />
      },
      {
        accessorKey: 'payemnt-status',
        header: 'Trạng thái',
        cell: ({ row }) => {
          const paymentStatus = (
            row.original.paymentStatus === 'PENDING' ? 'PAYMENT_PENDING' : row.original.paymentStatus
          ) as PaymentStatus;

          return <StatusBadge status={paymentStatus} />;
        }
      },
      {
        accessorKey: 'createdAt',
        header: () => (
          <div className='text-right'>
            <Button
              variant='ghost'
              className='px-0'
              onClick={() => handleSort(getNextSort(currentSort, 'created_at_asc', 'created_at_desc'))}
            >
              Ngày tạo
              <ArrowUpDown className='ml-1 size-4' />
            </Button>
          </div>
        ),
        cell: ({ row }) => <p className='text-right'>{formatDate(grpcTimestampToDate(row.original.createdAt))}</p>
      },
      {
        accessorKey: 'total',
        header: () => (
          <div className='text-right'>
            <Button
              variant='ghost'
              className='px-0'
              onClick={() => handleSort(getNextSort(currentSort, 'price_asc', 'price_desc'))}
            >
              Tổng tiền
              <ArrowUpDown className='ml-1 size-4' />
            </Button>
          </div>
        ),
        cell: ({ row }) => <div className='text-right font-medium'>{formatCurrency(row.original.total)}</div>
      },
      {
        id: 'actions',
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon-xs' className='cursor-pointer px-2'>
                <MoreHorizontal className='size-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={() => router.push(`/admin/orders/${row.original.id}/`)}>
                Xem chi tiết
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/admin/orders/${row.original.id}/edit`)}>
                Cập nhật
              </DropdownMenuItem>
              <DropdownMenuItem className='text-destructive'>Hủy đơn</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    ],
    [currentSort, searchParams]
  );

  const table = useReactTable({
    data: orders,
    columns,
    state: {
      columnVisibility
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
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
          select: 'Lựa chọn',
          number: 'Mã đơn',
          customer: 'Khách hàng',
          email: 'Email',
          product: 'Sản phẩm',
          status: 'Trạng thái',
          createdAt: 'Ngày tạo',
          total: 'Tổng tiền',
          actions: 'Hành động'
        }}
        currentValue={currentStatus}
        filterItems={[
          { label: 'Tất cả', value: 'all' },
          { label: 'Chờ xử lý', value: 'pending' },
          { label: 'Đang xử lý', value: 'processing' },
          { label: 'Đang vận chuyển', value: 'shipped' },
          { label: 'Đã giao', value: 'delivered' },
          { label: 'Đã hủy', value: 'cancelled' }
        ]}
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
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                onClick={() => router.push(`/admin/orders/${row.original.id}`)}
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
    </div>
  );
}
