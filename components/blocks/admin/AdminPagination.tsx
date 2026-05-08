'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AdminPaginationProps {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function AdminPagination({ pagination }: AdminPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = (params: Record<string, string>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      newSearchParams.set(key, value);
    });

    return newSearchParams.toString();
  };

  const pushWithRefresh = (query: Record<string, string>) => {
    router.push(`${pathname}?${createQueryString(query)}`);
    router.refresh();
  };

  const handlePageChange = (page: number) => {
    pushWithRefresh({ page: String(page) });
  };

  const handlePageSizeChange = (pageSize: number) => {
    pushWithRefresh({
      page: '1',
      limit: String(pageSize)
    });
  };

  const startItem = (pagination.page - 1) * pagination.limit + 1;

  const endItem = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <div className='mt-4 flex items-center justify-between'>
      <p className='text-muted-foreground text-sm'>
        Hiển thị {startItem}-{endItem} của {pagination.total} kết quả
      </p>

      <div className='flex items-center gap-2'>
        <span className='text-muted-foreground text-sm'>Số dòng</span>

        <Select value={`${pagination.limit}`} onValueChange={(value) => handlePageSizeChange(Number(value))}>
          <SelectTrigger className='h-8 w-[70px]'>
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {[10, 15, 20, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant='outline'
          size='sm'
          disabled={pagination.page <= 1}
          onClick={() => handlePageChange(pagination.page - 1)}
        >
          Trước
        </Button>

        <Button variant='default' size='sm'>
          {pagination.page}
        </Button>

        <Button
          variant='outline'
          size='sm'
          disabled={pagination.page >= pagination.totalPages}
          onClick={() => handlePageChange(pagination.page + 1)}
        >
          Sau
        </Button>
      </div>
    </div>
  );
}
