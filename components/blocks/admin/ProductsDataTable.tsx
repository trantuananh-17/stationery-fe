'use client';

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  PaginationState,
  useReactTable,
  type ColumnDef,
  type VisibilityState
} from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Package } from 'lucide-react';
import { useTranslations } from 'next-intl';
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

import { cn, formatCurrency, formatDate, grpcTimestampToDate } from '@/lib/utils';
import ProductStatusBadge from './ProductStatusBadge';
import AdminTableToolbar from './AdminTableToolbar';
import { ProductItem } from '@/types/product.type';
import Image from 'next/image';
import { StatusBadge } from './StatusBadge';
import { deleteProduct, restoreProduct } from '@/services/product.service';
import { getToken } from '@/lib/auth';
import { toast } from 'sonner';

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

interface ProductsDataTableProps {
  products: ProductItem[];
  currentSort: string;
  currentStatus: string;
}

function getNextSort(currentSort: string, asc: AdminProductSort, desc: AdminProductSort) {
  if (currentSort === asc) return desc;
  return asc;
}

export default function ProductsDataTable({ products, currentSort, currentStatus }: ProductsDataTableProps) {
  const t = useTranslations('AdminProducts');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isTrashMode = currentStatus === 'deleted';

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    category: false,
    status: false
    // actions: false
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
          <div onClick={(e) => e.stopPropagation()}>
            <Checkbox
              className='cursor-pointer'
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
            />
          </div>
        ),
        enableSorting: false
        // enableHiding: false
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

              <div className='max-w-80'>
                <div className='text-sm font-medium'>{product.name}</div>
                <div className='text-muted-foreground truncate text-xs'>{product.description}</div>
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
        cell: ({ row }) => <StatusBadge status={row.original.status} />
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
          <div className='text-right'>
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
        cell: ({ row }) => <div className='text-right font-medium'>{formatCurrency(row.original.price)}</div>
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
              <ArrowUpDown className='ml-1 h-4 w-4' />
            </Button>
          </div>
        ),
        cell: ({ row }) => <p className='text-right'>{formatDate(grpcTimestampToDate(row.original.createdAt))}</p>
      },
      {
        id: 'actions',
        cell: ({ row }) => (
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='icon'>
                  <MoreHorizontal className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>

              {/* <DropdownMenuContent align='end'> */}
              {/* <DropdownMenuItem>Xem chi tiết</DropdownMenuItem> */}
              {/* <DropdownMenuItem onClick={() => router.push(`/admin/products/${row.original.id}/edit`)}>
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem className='text-destructive'>Xóa</DropdownMenuItem>
            </DropdownMenuContent> */}
              <DropdownMenuContent align='end'>
                {isTrashMode ? (
                  <>
                    <DropdownMenuItem onClick={() => handleRestore(row.original.id)}>Khôi phục</DropdownMenuItem>

                    {/* <DropdownMenuItem
        className='text-destructive'
        onClick={() => handleForceDelete(row.original.id)}
      >
        Xóa vĩnh viễn
      </DropdownMenuItem> */}
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => router.push(`/admin/products/${row.original.id}/edit`)}>
                      Chỉnh sửa
                    </DropdownMenuItem>

                    <DropdownMenuItem className='text-destructive' onClick={() => handleDelete(row.original.id)}>
                      Xóa
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
        enableSorting: false
        // enableHiding: false
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

    manualPagination: true,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  });

  const rows = table.getRowModel().rows;

  async function handleDelete(productId: string) {
    try {
      const accessToken = await getToken();
      await deleteProduct(accessToken, productId);

      toast.success(t('deleteSuccess'), {
        description: t('deleteSuccessDesc', { id: productId }),
        position: 'top-right'
      });

      router.refresh();
    } catch (error) {
      console.error(error);

      toast.error(t('deleteError'), {
        description: t('tryAgain'),
        position: 'top-right'
      });
    }
  }

  async function handleRestore(productId: string) {
    try {
      const accessToken = await getToken();
      await restoreProduct(accessToken, productId);

      toast.success(t('restoreSuccess'), {
        description: t('restoreSuccessDesc', { id: productId }),
        position: 'top-right'
      });

      router.refresh();
    } catch (error) {
      console.error(error);

      toast.error(t('restoreError'), {
        description: t('tryAgain'),
        position: 'top-right'
      });
    }
  }

  return (
    <div>
      <AdminTableToolbar
        table={table}
        searchColumn='name'
        searchPlaceholder='Tìm sản phẩm...'
        columnLabels={{
          select: 'Lựa chọn',
          sku: 'Mã SKU',
          category: 'Danh mục',
          stock: 'Tòn kho',
          price: 'Giá bán',
          status: 'Trạng thái',
          createdAt: 'Ngày tạo',
          total: 'Tổng tiền',
          actions: 'Hành động'
        }}
        currentValue={currentStatus}
        filterItems={[
          { label: 'Tất cả', value: 'all' },
          { label: 'Đang bán', value: 'active' },
          { label: 'Nháp', value: 'draft' },
          { label: 'Đã lưu trữ', value: 'archived' },
          { label: 'Đã xóa', value: 'deleted' }
        ]}
      />
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
                <TableRow
                  key={row.id}
                  className={cn(
                    !isTrashMode && 'hover:bg-muted/50 cursor-pointer',
                    isTrashMode && 'cursor-not-allowed opacity-80'
                  )}
                  onClick={() => {
                    if (isTrashMode) return;

                    router.push(`/admin/products/${row.original.id}/edit`);
                  }}
                >
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
