import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';

const topProducts = [
  {
    rank: 1,
    name: 'Pro Dashboard Template',
    price: 69,
    sold: 18,
    revenue: 1242
  },
  {
    rank: 2,
    name: 'Analytics Widget Suite',
    price: 49,
    sold: 21,
    revenue: 1029
  },
  {
    rank: 3,
    name: 'E-commerce Dashboard',
    price: 99,
    sold: 10,
    revenue: 990
  },
  {
    rank: 4,
    name: 'Data Visualization Library ádjkasdahdjasdhsjdjk ',
    price: 79,
    sold: 11,
    revenue: 869
  },
  {
    rank: 5,
    name: 'Enterprise Admin Panel',
    price: 149,
    sold: 5,
    revenue: 745
  }
];

export default function TopSellingProducts() {
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
            {topProducts.map((product) => (
              <TableRow key={product.rank}>
                <TableCell className='text-muted-foreground font-medium'>{product.rank}</TableCell>

                <TableCell>
                  <div className='max-w-60 truncate font-medium md:max-w-220' title={product.name}>
                    {product.name}
                  </div>
                  <div className='text-muted-foreground text-xs'>{formatCurrency(product.price)}</div>
                </TableCell>

                <TableCell className='text-right font-semibold'>{product.sold}</TableCell>

                <TableCell className='text-right font-semibold'>{formatCurrency(product.revenue)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
