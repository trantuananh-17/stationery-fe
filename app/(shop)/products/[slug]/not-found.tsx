import { ShoppingCart } from 'lucide-react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='flex min-h-[60vh] items-center justify-center'>
      <Empty className='p-8 md:p-12'>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <ShoppingCart />
          </EmptyMedia>

          <EmptyTitle>Không tìm thấy sản phẩm</EmptyTitle>

          <EmptyDescription>Sản phẩm bạn đang tìm có thể đã bị xoá hoặc không tồn tại.</EmptyDescription>
        </EmptyHeader>

        <EmptyContent className='flex-col justify-center gap-2 md:flex-row'>
          <Button asChild>
            <Link href='/'>
              <ArrowLeft />
              Quay về trang chủ
            </Link>
          </Button>

          <Button variant='outline' asChild>
            <Link href='/products'>Xem tất cả sản phẩm</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
