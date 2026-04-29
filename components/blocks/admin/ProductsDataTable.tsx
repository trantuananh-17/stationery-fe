'use client';

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type VisibilityState
} from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Package } from 'lucide-react';
import { useState } from 'react';

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

import { Product } from '@/app/(admin)/admin/products/page';
import { formatCurrency } from '@/lib/utils';
import AdminPagination from './AdminPagination';
import ProductStatusBadge from './ProductStatusBadge';
import AdminTableToolbar from './AdminTableToolbar';

type ProductsTableProps = {
  products: Product[];
};

const columns: ColumnDef<Product>[] = [
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
      <Button variant='ghost' className='px-0' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Sản phẩm
        <ArrowUpDown className='ml-1 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div className='flex items-center gap-3'>
          <div className='bg-muted flex h-10 w-10 items-center justify-center rounded-xl'>
            <Package className='text-muted-foreground h-5 w-5' />
          </div>

          <div>
            <div className='text-sm font-medium'>{product.name}</div>
            <div className='text-muted-foreground line-clamp-1 text-xs'>{product.description}</div>
          </div>
        </div>
      );
    },
    enableHiding: false
  },
  {
    accessorKey: 'sku',
    header: 'Mã SKU',
    cell: ({ row }) => <span className='font-mono text-sm'>{row.original.sku}</span>,
    enableSorting: false
  },
  {
    accessorKey: 'category',
    header: ({ column }) => (
      <Button variant='ghost' className='px-0' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Danh mục
        <ArrowUpDown className='ml-1 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => <Badge variant='outline'>{row.original.category}</Badge>
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <Button variant='ghost' className='px-0' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Trạng thái
        <ArrowUpDown className='ml-1 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => <ProductStatusBadge status={row.original.status} />
  },
  {
    accessorKey: 'stock',
    header: ({ column }) => (
      <div className='flex justify-end'>
        <Button variant='ghost' className='px-0' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Tồn kho
          <ArrowUpDown className='ml-1 h-4 w-4' />
        </Button>
      </div>
    ),
    cell: ({ row }) => <div className='text-right'>{row.original.stock}</div>
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <div className='flex justify-end'>
        <Button variant='ghost' className='px-0' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Giá bán
          <ArrowUpDown className='ml-1 h-4 w-4' />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className='text-right font-semibold'>{formatCurrency(Number(row.original.price.toFixed(2)))}</div>
    )
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <Button variant='ghost' className='px-0' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Ngày tạo
        <ArrowUpDown className='ml-1 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => <span>{row.original.createdAt}</span>
  },
  {
    id: 'actions',
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon'>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align='end'>
          <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
          <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
          <DropdownMenuItem className='text-destructive'>Xóa</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    enableSorting: false,
    enableHiding: false
  }
];

export default function ProductsTable({ products }: ProductsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    category: false,
    status: false
  });

  const table = useReactTable({
    data: products,
    columns,
    state: {
      sorting,
      columnVisibility
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  return (
    <div>
      <AdminTableToolbar table={table} searchColumn='name' searchPlaceholder='Tìm sản phẩm...' />

      <div className='bg-background rounded-xl border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  Không có sản phẩm.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AdminPagination table={table} />
    </div>
  );
}
