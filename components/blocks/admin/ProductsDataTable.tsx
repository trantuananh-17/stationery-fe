'use client';

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
  type VisibilityState
} from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Package } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

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

import { formatCurrency, grpcTimestampToDate } from '@/lib/utils';
import ProductStatusBadge from './ProductStatusBadge';
import AdminTableToolbar from './AdminTableToolbar';
import { ProductItem } from '@/types/product.type';
import Image from 'next/image';

export type AdminProductSort =
  | 'newest'
  | 'oldest'
  | 'name_asc'
  | 'name_desc'
  | 'stock_asc'
  | 'stock_desc'
  | 'price_asc'
  | 'price_desc'
  | 'created_at_asc'
  | 'created_at_desc';

type ProductsDataTableProps = {
  products: ProductItem[];
  currentSort: string;
};

function formatDate(value?: Date | string | null) {
  if (!value) return '-';

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleDateString('vi-VN');
}

function getNextSort(currentSort: string, asc: AdminProductSort, desc: AdminProductSort) {
  if (currentSort === asc) return desc;
  return asc;
}

export default function ProductsDataTable({ products, currentSort }: ProductsDataTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    category: false,
    status: false
  });

  function handleSort(sort: AdminProductSort) {
    const params = new URLSearchParams(searchParams.toString());

    params.set('sort', sort);
    params.delete('page');

    router.push(`${pathname}?${params.toString()}`);
  }

  const columns = useMemo<ColumnDef<ProductItem>[]>(
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
          <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} />
        ),
        enableSorting: false,
        enableHiding: false
      },
      {
        accessorKey: 'name',
        header: () => (
          <Button
            variant='ghost'
            className='px-0'
            onClick={() => handleSort(getNextSort(currentSort, 'name_asc', 'name_desc'))}
          >
            Sản phẩm
            <ArrowUpDown className='ml-1 h-4 w-4' />
          </Button>
        ),
        cell: ({ row }) => {
          const product = row.original;

          return (
            <div className='flex items-center gap-3'>
              <div className='bg-muted relative h-10 w-10 overflow-hidden rounded-xl'>
                {product.thumbnail ? (
                  <Image src={product.thumbnail} alt={product.name} fill sizes='40px' className='object-cover' />
                ) : (
                  <div className='flex h-full w-full items-center justify-center'>
                    <Package className='text-muted-foreground h-5 w-5' />
                  </div>
                )}
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
        header: 'Danh mục',
        cell: ({ row }) => <Badge variant='outline'>{row.original.category}</Badge>
      },
      {
        accessorKey: 'status',
        header: 'Trạng thái',
        cell: ({ row }) => <ProductStatusBadge status={row.original.status} />
      },
      {
        accessorKey: 'stock',
        header: () => (
          <div className='flex justify-end'>
            <Button
              variant='ghost'
              className='px-0'
              onClick={() => handleSort(getNextSort(currentSort, 'stock_asc', 'stock_desc'))}
            >
              Tồn kho
              <ArrowUpDown className='ml-1 h-4 w-4' />
            </Button>
          </div>
        ),
        cell: ({ row }) => <div className='text-right'>{row.original.stock}</div>
      },
      {
        accessorKey: 'price',
        header: () => (
          <div className='flex justify-end'>
            <Button
              variant='ghost'
              className='px-0'
              onClick={() => handleSort(getNextSort(currentSort, 'price_asc', 'price_desc'))}
            >
              Giá bán
              <ArrowUpDown className='ml-1 h-4 w-4' />
            </Button>
          </div>
        ),
        cell: ({ row }) => <div className='text-right font-semibold'>{formatCurrency(row.original.price)}</div>
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
            <ArrowUpDown className='ml-1 h-4 w-4' />
          </Button>
        ),
        cell: ({ row }) => <span>{formatDate(grpcTimestampToDate(row.original.createdAt))}</span>
      },
      {
        id: 'actions',
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon'>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align='end'>
              <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/admin/products/${row.original.id}/edit`)}>
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem className='text-destructive'>Xóa</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        enableSorting: false,
        enableHiding: false
      }
    ],
    [currentSort, searchParams]
  );

  const table = useReactTable({
    data: products,
    columns,
    state: {
      columnVisibility
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  });

  const rows = table.getRowModel().rows;

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
            {rows.length ? (
              rows.map((row) => (
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
    </div>
  );
}
