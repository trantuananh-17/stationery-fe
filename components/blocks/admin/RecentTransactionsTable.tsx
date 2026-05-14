import { ArrowRight } from 'lucide-react';

import { StatusBadge } from '@/components/blocks/admin/StatusBadge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency, formatDate, grpcTimestampToDate } from '@/lib/utils';
import { RecentTransactionItem } from '@/types/analytics.type';

interface Props {
  transactions?: RecentTransactionItem[];
}

const ROW_COUNT = 10;

function getInitials(name?: string) {
  if (!name) return '-';

  const words = name.trim().split(/\s+/);

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  return `${words[0].charAt(0)}${words[words.length - 1].charAt(0)}`.toUpperCase();
}

function formatOrderCode(orderId?: string) {
  if (!orderId) return '-';

  return `#${orderId.slice(0, 8).toUpperCase()}`;
}

function formatAmount(amount?: string) {
  const value = Number(amount ?? 0);

  if (!Number.isFinite(value)) return '-';

  return formatCurrency(value);
}

export default function RecentTransactionsTable({ transactions = [] }: Props) {
  const rows = Array.from({ length: ROW_COUNT }, (_, index) => transactions[index]);

  return (
    <Card className='gap-0 rounded-xl p-5 shadow-sm'>
      <div className='mb-4 flex items-start justify-between gap-4'>
        <div>
          <h3 className='text-base font-semibold'>Giao dịch gần đây</h3>
          <p className='text-muted-foreground text-xs'>Các đơn hàng mới nhất từ khách hàng</p>
        </div>

        <Button variant='ghost' size='sm' className='gap-2'>
          Xem tất cả
          <ArrowRight className='size-4' />
        </Button>
      </div>

      <CardContent className='p-0'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-10'>#</TableHead>
              <TableHead className='w-57'>Khách hàng</TableHead>
              <TableHead>Mã đơn hàng</TableHead>
              <TableHead className='text-right'>Tổng tiền</TableHead>
              <TableHead className='text-center'>Trạng thái</TableHead>
              <TableHead className='text-right'>Ngày đặt hàng</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((transaction, index) => (
              <TableRow key={transaction?.orderId ?? `empty-transaction-${index}`}>
                <TableCell className='text-muted-foreground font-medium'>{index + 1}</TableCell>

                <TableCell>
                  {transaction ? (
                    <div className='flex items-center gap-4'>
                      {/* <Avatar className='h-10 w-10'>
                        <AvatarFallback className='font-semibold'>
                          {getInitials(transaction.customerName)}
                        </AvatarFallback>
                      </Avatar> */}

                      <span className='text-foreground max-w-40 truncate font-medium' title={transaction.customerName}>
                        {transaction.customerName}
                      </span>
                    </div>
                  ) : (
                    <span className='text-muted-foreground'>-</span>
                  )}
                </TableCell>

                <TableCell className='font-medium'>{formatOrderCode(transaction?.orderId)}</TableCell>

                <TableCell className='text-right font-semibold'>
                  {transaction ? formatAmount(transaction.totalAmount) : '-'}
                </TableCell>

                <TableCell className='text-center'>
                  {transaction ? (
                    <StatusBadge status={transaction.status} />
                  ) : (
                    <span className='text-muted-foreground'>-</span>
                  )}
                </TableCell>

                <TableCell className='text-muted-foreground text-right'>
                  {transaction ? formatDate(grpcTimestampToDate(transaction.orderedAt)) : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
