import { Link } from '@/i18n/routing';
import {
  ArrowLeft,
  BadgeCheck,
  Calendar,
  CircleHelp,
  Mail,
  MoreHorizontal,
  Package,
  ShoppingBag,
  User2
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { orderStatusConfig, paymentStatusConfig } from '../../orders/[id]/page';
import { formatCurrency, formatDate, getDaysSinceText, GrpcTimestamp, grpcTimestampToDate } from '@/lib/utils';
import { getUserById } from '@/services/user.service';
import { routing } from '@/i18n/routing';
import { getToken } from '@/lib/auth';
import { setRequestLocale } from 'next-intl/server';
import NotFound from '@/app/[locale]/(shop)/products/[slug]/not-found';
import { OrderStatusUpper, PaymentStatus } from '@/types/order.type';

const customer = {
  id: 'e6d14eb9-268c-4a74-88b0-4b0d9731443b',
  fullName: 'Anh Tuấn',
  firstName: 'Anh',
  lastName: 'Tuấn',
  email: 'anhkyohauik17@gmail.com',
  isVerified: false,
  isActive: false,
  totalOrders: 2,
  amountSpent: 44000,
  customerSince: {
    seconds: {
      low: 1778295030,
      high: 0,
      unsigned: false
    },
    nanos: 249000000
  },
  lastOrder: {
    orderId: '6fa847a4-3ba2-4d06-9c2c-3aec47377985',
    orderNumber: 'ORD-20260503-76697619',
    totalPrice: 20000,
    orderStatus: 'DELIVERED',
    paymentStatus: 'PENDING',
    orderedAt: {
      seconds: {
        low: 1777826187,
        high: 0,
        unsigned: false
      },
      nanos: 827000000
    },
    items: [
      {
        productId: '4d24f89c-bb11-4c6d-b836-6e307bccaf90',
        variantId: 'cfdeece9-d138-46af-9b62-ba319108c8ee',
        name: 'Bút Bi Bấm I-5 0.5 mm – Radius – Mực Đen Đỏ',
        quantity: 10,
        subtotal: 20000
      },
      {
        productId: '4d24f89c-bb11-4c6d-b836-6e307bccaf91',
        variantId: 'cfdeece9-d138-46af-9b62-ba319108c8ee',
        name: 'Bút Bi Bấm I-5 0.5 mm – Radius – Mực Đen Đỏ',
        quantity: 10,
        subtotal: 20000
      }
    ]
  }
};

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);
};

async function getUserInfo(token: string, userId: string) {
  const res = await getUserById(token, userId);
  if (!res?.ok || !res?.data?.data) {
    return null;
  }

  console.log(res.data.data);

  return res.data.data;
}
type Props = {
  params: Promise<{
    locale: string;
    id: string;
  }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Page({ params }: Props) {
  const token = await getToken();
  const { locale, id } = await params;
  setRequestLocale(locale);

  const customer = await getUserInfo(token!, id);

  if (!customer) return <NotFound />;

  const lastOrder = customer.lastOrder;

  const status = customer.lastOrder?.orderStatus
    ? orderStatusConfig[customer.lastOrder.orderStatus as OrderStatusUpper]
    : null;

  const payment = customer.lastOrder?.paymentStatus
    ? paymentStatusConfig[customer.lastOrder.paymentStatus as PaymentStatus]
    : null;

  const StatusIcon = status?.icon ?? CircleHelp;
  const PaymentIcon = payment?.icon ?? CircleHelp;

  return (
    <section className='mx-auto max-w-5xl'>
      <header className='mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
        <div>
          <div className='flex flex-wrap items-center gap-2'>
            <Link href='/admin/orders'>
              <ArrowLeft className='h-5 w-5' />
            </Link>

            <h1 className='text-xl tracking-tight'>{customer.fullName}</h1>
          </div>
        </div>
      </header>

      {/* STATS */}
      <Card className='my-4 overflow-hidden p-2 shadow-none'>
        <div className='grid grid-cols-1 divide-y md:grid-cols-5 md:divide-x md:divide-y-0'>
          <div className='px-4'>
            <p className='text-muted-foreground text-sm font-semibold'>Chi tiêu</p>

            <h3 className='mt-2 text-sm font-semibold'>{formatCurrency(customer.amountSpent)}</h3>
          </div>

          <div className='px-4'>
            <p className='text-muted-foreground text-sm font-semibold'>Đơn hàng</p>

            <h3 className='mt-2 text-sm font-semibold'>{customer.totalOrders}</h3>
          </div>

          <div className='px-4'>
            <p className='text-muted-foreground text-sm font-semibold'>Tham gia</p>

            <h3 className='mt-2 text-sm font-semibold'>{getDaysSinceText(customer.customerSince)}</h3>
          </div>

          <div className='px-4'>
            <p className='text-muted-foreground text-sm font-semibold'>Trạng thái</p>

            <h3 className='mt-2 text-sm font-semibold'>{customer.isActive ? 'Hoạt động' : 'Không hoạt động'}</h3>
          </div>

          <div className='px-4'>
            <p className='text-muted-foreground text-sm font-semibold'>Xác thực</p>

            <h3 className='mt-2 text-sm font-semibold'>{customer.isActive ? 'Đã xác minh ' : 'Chưa xác minh '}</h3>
          </div>
        </div>
      </Card>
      <div className='grid w-full grid-cols-1 gap-4 md:grid-cols-[2fr_1fr]'>
        {/* LEFT */}
        <div className='space-y-5'>
          {/* LAST ORDER */}
          <Card className='gap-2 rounded-xl p-4'>
            <CardHeader className='p-0'>
              <CardTitle className='text-base'>Đơn hàng gần đây</CardTitle>
            </CardHeader>

            <CardContent className='mt-2 p-0'>
              {/* ORDER SUMMARY */}
              {!lastOrder ? (
                <div className='flex min-h-40 items-center justify-center rounded-xl border border-dashed border-zinc-200'>
                  <div className='text-center'>
                    <Package className='mx-auto mb-3 h-8 w-8 text-zinc-400' />

                    <p className='text-sm font-medium text-zinc-700'>Không có đơn hàng nào</p>

                    <p className='mt-1 text-xs text-zinc-500'>Khách hàng chưa phát sinh đơn hàng</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className='rounded-xl border border-zinc-200 bg-white'>
                    {/* ORDER SUMMARY */}
                    <div className='flex flex-col gap-4 border-b border-zinc-200 px-4 py-4 md:flex-row md:items-start md:justify-between'>
                      <div>
                        <div className='flex flex-wrap items-center gap-2'>
                          <h3 className='text-sm font-semibold'>#{lastOrder.orderNumber}</h3>

                          {payment && (
                            <Badge
                              variant='outline'
                              className={`gap-1.5 rounded-full px-2.5 py-1 ${payment.className}`}
                            >
                              {PaymentIcon && <PaymentIcon className='h-3.5 w-3.5' />}

                              {payment.label}
                            </Badge>
                          )}

                          {status && (
                            <Badge
                              variant='outline'
                              className={`gap-1.5 rounded-full px-2.5 py-1 ${status.badgeClassName}`}
                            >
                              {StatusIcon && <StatusIcon className='h-3.5 w-3.5' />}

                              {status.label}
                            </Badge>
                          )}
                        </div>

                        <p className='text-muted-foreground mt-2 text-sm'>
                          {formatDate(grpcTimestampToDate(lastOrder.orderedAt))}
                        </p>
                      </div>

                      <div className='text-right'>
                        <p className='text-lg font-semibold'>{formatPrice(lastOrder.totalPrice)}</p>
                      </div>
                    </div>

                    {/* ITEMS */}
                    <div className='divide-y divide-zinc-200'>
                      {lastOrder.items.map((item) => (
                        <div
                          key={item.variantId}
                          className='flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between'
                        >
                          <div className='flex items-center gap-3'>
                            <div className='grid h-14 w-14 place-items-center rounded-xl border border-zinc-200 bg-zinc-100'>
                              <Package className='h-6 w-6 text-zinc-500' />
                            </div>

                            <div>
                              <p className='text-sm font-medium'>{item.name}</p>

                              <p className='text-xs text-zinc-500'>Qty: {item.quantity}</p>
                            </div>
                          </div>

                          <div className='flex items-center justify-between gap-2 sm:justify-end'>
                            <p className='min-w-24 text-right text-sm font-medium'>{formatPrice(item.subtotal)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className='mt-4 text-right'>
                    <Button>Xem tất cả đơn hàng</Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT */}
        <Card className='h-fit gap-2 p-0 shadow-none'>
          <CardHeader className='flex items-center justify-between px-4 pt-4'>
            <CardTitle className=''>Khách hàng</CardTitle>

            <Button variant='ghost' size='icon-sm'>
              <MoreHorizontal className='h-5 w-5' />
            </Button>
          </CardHeader>

          <CardContent className='space-y-4 p-0'>
            {/* PROFILE */}
            <div className='flex items-start gap-4 px-4'>
              <div className='bg-primary/10 flex h-14 w-14 items-center justify-center rounded-full'>
                <User2 className='text-primary h-7 w-7' />
              </div>

              <div className='flex-1'>
                <div className='flex items-center gap-2'>
                  <h3 className=''>{customer.fullName}</h3>

                  {customer.isVerified && <BadgeCheck className='h-4 w-4 text-blue-500' />}
                </div>

                <div className='mt-2 flex flex-wrap gap-2'>
                  <Badge variant='outline'>{customer.totalOrders} Đơn hàng</Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* CONTACT */}
            <div className='space-y-4 px-4 pb-4'>
              <div>
                <p className='mb-2 text-sm font-medium'>Thông tin khách hàng</p>

                <div className='flex items-center gap-2 text-sm'>
                  <Mail className='text-muted-foreground h-4 w-4' />

                  <Link href={`mailto:${customer.email}`} className='text-primary hover:underline'>
                    {customer.email}
                  </Link>
                </div>
              </div>

              <div>
                <p className='mb-2 text-sm font-medium'>Ngày tham gia</p>

                <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                  <Calendar className='h-4 w-4' />
                  {formatDate(grpcTimestampToDate(customer.customerSince))}
                </div>
              </div>

              <div>
                <p className='mb-2 text-sm font-medium'>Thống kê đơn hàng</p>

                <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                  <ShoppingBag className='h-4 w-4' />
                  {customer.totalOrders} đơn hàng hoàn thành
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
