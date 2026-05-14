import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';

export type TopSellingProductItem = {
  productId: string;
  productName: string;
  quantitySold: number;
  totalRevenue: number;
};

interface Props {
  products?: TopSellingProductItem[];
}

const ROW_COUNT = 5;

export default function TopSellingProducts({ products = [] }: Props) {
  const rows = Array.from({ length: ROW_COUNT }, (_, index) => products[index]);

  return (
    <Card className='gap-0 rounded-xl p-6 shadow-sm'>
      <div className='mb-4 flex items-start justify-between gap-4'>
        <div>
          <h3 className='text-base font-semibold'>Sản phẩm bán chạy</h3>
          <p className='text-muted-foreground text-xs'>Sản phẩm có hiệu suất tốt nhất tháng này</p>
        </div>

        <Button variant='ghost' size='sm' className='gap-2'>
          Xem tất cả
          <ArrowRight className='size-4' />
        </Button>
      </div>

      <CardContent className='p-0'>
        <Table>
          <TableHeader>
            <TableRow className='text-xs'>
              <TableHead className='w-10'>#</TableHead>
              <TableHead>Sản phẩm</TableHead>
              <TableHead className='text-right'>Đã bán</TableHead>
              <TableHead className='text-right'>Doanh thu</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((product, index) => (
              <TableRow key={product?.productId ?? `empty-row-${index}`}>
                <TableCell className='text-muted-foreground font-medium'>{index + 1}</TableCell>

                <TableCell>
                  {product ? (
                    <div className='max-w-60 truncate font-medium md:max-w-220' title={product.productName}>
                      {product.productName}
                    </div>
                  ) : (
                    <span className='text-muted-foreground'>-</span>
                  )}
                </TableCell>

                <TableCell className='text-right font-semibold'>
                  {product ? product.quantitySold.toLocaleString('vi-VN') : '-'}
                </TableCell>

                <TableCell className='text-right font-semibold'>
                  {product ? formatCurrency(product.totalRevenue) : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
