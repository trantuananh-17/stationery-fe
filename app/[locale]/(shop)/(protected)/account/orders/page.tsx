import { StatusBadge } from '@/components/blocks/admin/StatusBadge';
import OrderFilter from '@/components/blocks/OrdersFilter';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getToken } from '@/lib/auth';
import { formatCurrency, formatDate, grpcTimestampToDate } from '@/lib/utils';
import { routing } from '@/i18n/routing';
import { getMyOrders } from '@/services/order.service';
import { setRequestLocale } from 'next-intl/server';
import { OrderStatus, OrderStatusUpper, PaymentStatus } from '@/types/order.type';
import { CreditCard, MapPin, Package } from 'lucide-react';
import Image from 'next/image';

function isOrderStatus(value?: string): value is OrderStatus {
  return (
    value === 'pending' ||
    value === 'processing' ||
    value === 'shipped' ||
    value === 'delivered' ||
    value === 'cancelled'
  );
}

async function getOrders(
  token: string,
  { status, page = 1, limit = 25 }: { status?: string; page?: number; limit?: number }
) {
  const res = await getMyOrders(token, {
    page,
    limit,
    status: isOrderStatus(status) ? status : undefined
  });
  if (!res?.ok || !res?.data?.data) {
    return { data: [], total: 0, page, limit, totalPages: 1 };
  }
  return res.data.data;
}

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Page({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const token = await getToken();
  const sp = await searchParams;
  const currentStatus = sp.status ?? 'all';
  const orders = await getOrders(token!, { status: currentStatus });

  return (
    <section className='px-6 py-4'>
      <div className='mb-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between'>
        <div className='space-y-1'>
          <h1 className='text-xl font-medium'>Đơn hàng của tôi</h1>
          <p className='text-muted-foreground'>Quản lý, theo dõi các giao dịch mua hàng của bạn</p>
        </div>
        <OrderFilter currentValue={currentStatus} />
      </div>

      {!orders?.data?.length ? (
        <div className='flex min-h-[50vh] items-center justify-center'>
          <div className='text-center'>
            <Package className='mx-auto mb-3 h-8 w-8 text-zinc-400' />
            <p className='text-sm font-medium text-zinc-700'>Không có đơn hàng nào</p>
            <p className='mt-1 text-xs text-zinc-500'>Bạn chưa có đơn hàng nào ở trạng thái này.</p>
          </div>
        </div>
      ) : (
        <Accordion type='single' collapsible className='space-y-4'>
          {orders.data.map((order) => (
            <AccordionItem key={order.id} value={order.id} className='overflow-hidden'>
              <AccordionTrigger className='hover:no-underline [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-slate-500'>
                <div className='grid flex-1 grid-cols-1 items-center gap-6 text-left md:grid-cols-[1fr_auto_auto_auto_auto]'>
                  <div className='flex items-center gap-1'>
                    <div className='relative h-20 w-20 overflow-hidden rounded-md border border-slate-200'>
                      <Image
                        src={order.items[0].image}
                        alt={order.items[0].name}
                        fill
                        className='object-cover'
                        sizes='80px'
                      />
                    </div>
                    <div>
                      <h3 className='text-sm'>{order.items[0].name}</h3>
                      <p className='mt-1 text-xs text-slate-500'>
                        {order.items[0].attributes[0].name} | {order.items[0].attributes[0].value}
                      </p>
                    </div>
                  </div>
                  <p className='text-xs text-slate-500'>{formatDate(grpcTimestampToDate(order.createdAt))}</p>
                  <StatusBadge status={order.status as OrderStatusUpper} />
                  <p className='text-sm font-medium'>{formatCurrency(order.total)}</p>
                </div>
              </AccordionTrigger>

              <AccordionContent className='border-t px-4 py-6'>
                <div>
                  <h4 className='mb-5 text-lg'>Sản phẩm đã đặt</h4>
                  <div className='space-y-4'>
                    {order.items.map((item) => (
                      <div key={item.id} className='flex items-center justify-between gap-3'>
                        <div className='flex items-center gap-3'>
                          <div className='relative h-16 w-16 overflow-hidden rounded-md border border-slate-200 bg-white'>
                            <Image src={item.image} alt={item.name} fill className='object-cover p-1' sizes='80px' />
                          </div>
                          <div>
                            <p className='text-sm'>{item.name}</p>
                            <p className='text-xs text-slate-500'>
                              {item.attributes?.map((a) => a.value).join(', ')} · Số lượng: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className='text-sm font-medium whitespace-nowrap'>
                          {item.subtotal.toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='mt-8 grid gap-8 border-t pt-6 lg:grid-cols-[1fr_1fr]'>
                  <div className='space-y-4'>
                    <div>
                      <div className='mb-4 flex items-center gap-2'>
                        <MapPin className='h-5 w-5 text-slate-500' />
                        <h4 className='text-base'>Địa chỉ giao hàng</h4>
                      </div>
                      <div className='px-4 pt-1'>
                        <p className='font-medium'>
                          {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                        </p>
                        <p className='mt-2 text-sm text-slate-500'>{order.shippingAddress.phone}</p>
                        <p className='mt-2 text-sm text-slate-500'>
                          {[order.shippingAddress.address1, order.shippingAddress.address2, order.shippingAddress.city]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      </div>
                    </div>

                    <Separator orientation='vertical' />

                    <div>
                      <div className='mb-4 flex items-center gap-2'>
                        <CreditCard className='h-5 w-5 text-slate-500' />
                        <h4 className='text-base'>Thông tin thanh toán</h4>
                      </div>
                      <div className='space-y-3 px-4'>
                        <div className='flex justify-between text-sm'>
                          <span className='text-slate-500'>Phương thức</span>
                          <span className='font-medium uppercase'>{order.paymentMethod}</span>
                        </div>
                        <div className='flex justify-between text-sm'>
                          <span className='text-slate-500'>Trạng thái</span>
                          <StatusBadge
                            status={
                              order.paymentStatus === 'PENDING'
                                ? 'PAYMENT_PENDING'
                                : (order.paymentStatus as PaymentStatus)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='lg:pl-4'>
                    <h4 className='mb-4 text-base'>Tóm tắt đơn hàng</h4>
                    <div className='space-y-4'>
                      <div className='flex justify-between text-sm'>
                        <span className='text-slate-500'>Tạm tính</span>
                        <span>{formatCurrency(order.subtotal)}</span>
                      </div>
                      <div className='flex justify-between text-sm'>
                        <span className='text-slate-500'>Thuế</span>
                        <span>{formatCurrency(0)}</span>
                      </div>
                      <div className='flex justify-between text-sm'>
                        <span className='text-slate-500'>Phí vận chuyển</span>
                        <span>{formatCurrency(order.shippingCost)}</span>
                      </div>
                      <div className='flex justify-between text-sm'>
                        <span className='text-slate-500'>Giảm giá</span>
                        <span>- {formatCurrency(order.discount)}</span>
                      </div>
                      <div className='flex justify-between border-t pt-3 text-base font-medium'>
                        <span>Tổng cộng</span>
                        <span>{formatCurrency(order.total)}</span>
                      </div>
                    </div>
                    <div className='mt-6 flex justify-end gap-3'>
                      {order.status === 'PENDING' && (
                        <Button variant='outline' className='h-10 rounded-md shadow-sm'>
                          Hủy đơn hàng
                        </Button>
                      )}
                      {order.status === 'DELIVERED' && (
                        <Button className='h-10 rounded-md shadow-sm'>Đánh giá sản phẩm</Button>
                      )}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </section>
  );
}
