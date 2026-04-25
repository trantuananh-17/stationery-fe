'use client';

import { ArrowRight } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type TransactionStatus = 'Completed' | 'Processing' | 'Pending' | 'Cancelled';

interface Transaction {
  customer: string;
  initials: string;
  orderCode: string;
  amount: string;
  status: TransactionStatus;
  date: string;
}

const transactions: Transaction[] = [
  {
    customer: 'Sarah Chen',
    initials: 'SC',
    orderCode: '#ORD-1024',
    amount: '$49.99',
    status: 'Completed',
    date: 'Feb 22'
  },
  {
    customer: 'Marcus Johnson',
    initials: 'MJ',
    orderCode: '#ORD-1025',
    amount: '$199.99',
    status: 'Completed',
    date: 'Feb 22'
  },
  {
    customer: 'Priya Sharma',
    initials: 'PS',
    orderCode: '#ORD-1026',
    amount: '$29.99',
    status: 'Processing',
    date: 'Feb 21'
  },
  {
    customer: 'Alex Rivera',
    initials: 'AR',
    orderCode: '#ORD-1027',
    amount: '$39.99',
    status: 'Completed',
    date: 'Feb 21'
  },
  {
    customer: 'Emma Taylor',
    initials: 'ET',
    orderCode: '#ORD-1028',
    amount: '$39.99',
    status: 'Pending',
    date: 'Feb 20'
  },
  {
    customer: 'David Park',
    initials: 'DP',
    orderCode: '#ORD-1029',
    amount: '$14.99',
    status: 'Cancelled',
    date: 'Feb 20'
  }
];

const statusStyles: Record<TransactionStatus, string> = {
  Completed: 'bg-green-600 text-white hover:bg-green-600',
  Processing: 'bg-black text-white hover:bg-black',
  Pending: 'bg-amber-500 text-black hover:bg-amber-500',
  Cancelled: 'bg-red-600 text-white hover:bg-red-600'
};

export default function RecentTransactionsTable() {
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
              <TableHead className='w-57'>Khách hàng</TableHead>
              <TableHead>Mã đơn hàng</TableHead>
              <TableHead className='text-right'>Tổng tiền</TableHead>
              <TableHead className='text-center'>Trạng thái</TableHead>
              <TableHead className='text-right'>Ngày thanh toán</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.orderCode}>
                <TableCell>
                  <div className='flex items-center gap-4'>
                    <Avatar className='h-10 w-10'>
                      <AvatarFallback className='font-semibold'>{transaction.initials}</AvatarFallback>
                    </Avatar>

                    <span className='text-foreground font-medium'>{transaction.customer}</span>
                  </div>
                </TableCell>

                <TableCell className='font-medium'>{transaction.orderCode}</TableCell>

                <TableCell className='text-right font-semibold'>{transaction.amount}</TableCell>

                <TableCell className='text-center'>
                  <Badge className={statusStyles[transaction.status]}>{transaction.status}</Badge>
                </TableCell>

                <TableCell className='text-muted-foreground text-right'>{transaction.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
