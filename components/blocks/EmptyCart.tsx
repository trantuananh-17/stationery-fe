import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function EmptyCart() {
  return (
    <div className='bg-card flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed px-6 py-12 text-center'>
      <h2 className='text-2xl font-semibold'>Giỏ hàng của bạn còn trống</h2>
      <p className='text-muted-foreground mt-3 max-w-md'>Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>

      <Button asChild className='mt-6'>
        <Link href='/products'>Tiếp tục mua sắm</Link>
      </Button>
    </div>
  );
}
