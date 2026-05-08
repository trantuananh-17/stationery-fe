import { OrderActions } from '@/components/blocks/admin/OrderActions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  CreditCard,
  ExternalLink,
  LoaderCircle,
  Package,
  PackageCheck,
  ReceiptText,
  RotateCcw,
  Truck,
  XCircle
} from 'lucide-react';
import Link from 'next/link';

type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELED';
type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

type OrderDetail = {
  id: string;

  orderNumber: string;

  userId: string;

  customerEmail: string;

  status: OrderStatus;

  paymentStatus: PaymentStatus;

  paymentMethod: string;

  subtotal: number;

  tax: number;

  shippingCost: number;

  discount: number;

  total: number;

  notes: string;

  shippingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    address2: string;
    city: string;
    phone: string;
  };

  billingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    address2: string;
    city: string;
    phone: string;
  };

  items: {
    id: string;
    productId: string;
    variantId: string;

    name: string;

    sku: string;

    price: number;

    quantity: number;

    subtotal: number;

    attributes: {
      name: string;
      value: string;
    }[];
  }[];

  totalItems: number;

  totalUniqueItems: number;

  createdAt: {
    seconds: {
      low: number;
    };
  };

  updatedAt: {
    seconds: {
      low: number;
    };
  };
};

const orderStatusConfig: Record<
  OrderStatus,
  {
    label: string;

    description: string;

    icon: React.ElementType;

    badgeClassName: string;

    cardClassName: string;

    primaryAction?: {
      label: string;

      nextStatus: OrderStatus;
    };

    secondaryActions?: {
      label: string;

      nextStatus: OrderStatus;

      destructive?: boolean;
    }[];
  }
> = {
  PENDING: {
    label: 'Chờ xác nhận',

    description: 'Đơn hàng đang chờ xác nhận.',

    icon: Clock,

    badgeClassName: 'bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200',

    cardClassName: 'bg-amber-100 text-amber-900 text-xs!',

    primaryAction: {
      label: 'Xác nhận đơn',

      nextStatus: 'PROCESSING'
    },

    secondaryActions: [
      {
        label: 'Hủy đơn',

        nextStatus: 'CANCELED',

        destructive: true
      }
    ]
  },

  PROCESSING: {
    label: 'Đang xử lý',

    description: 'Đơn hàng đang được chuẩn bị.',

    icon: LoaderCircle,

    badgeClassName: 'bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200',

    cardClassName: 'bg-blue-100 text-blue-900 text-xs!',

    primaryAction: {
      label: 'Giao hàng',

      nextStatus: 'SHIPPED'
    },

    secondaryActions: [
      {
        label: 'Hủy đơn',

        nextStatus: 'CANCELED',

        destructive: true
      }
    ]
  },

  SHIPPED: {
    label: 'Đang giao',

    description: 'Đơn hàng đang được giao tới khách.',

    icon: Truck,

    badgeClassName: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-100 border-indigo-200',

    cardClassName: 'bg-indigo-100 text-xs! text-indigo-900',

    primaryAction: {
      label: 'Xác nhận đã giao',

      nextStatus: 'DELIVERED'
    }
  },

  DELIVERED: {
    label: 'Đã giao',

    description: 'Đơn hàng đã được giao thành công.',

    icon: CheckCircle2,

    badgeClassName: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200',

    cardClassName: 'bg-emerald-100 text-emerald-900 text-xs!'
  },

  CANCELED: {
    label: 'Đã hủy',

    description: 'Đơn hàng đã bị hủy.',

    icon: XCircle,

    badgeClassName: 'bg-red-100 text-red-800 hover:bg-red-100 border-red-200',

    cardClassName: 'bg-red-100 text-red-900 text-xs!'
  }
};

const paymentStatusConfig: Record<
  PaymentStatus,
  {
    label: string;

    className: string;

    icon: React.ElementType;
  }
> = {
  PENDING: {
    label: 'Chờ thanh toán',

    className: 'bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200',

    icon: Clock
  },

  PAID: {
    label: 'Đã thanh toán',

    className: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200',

    icon: ReceiptText
  },

  FAILED: {
    label: 'Thanh toán thất bại',

    className: 'bg-red-100 text-red-800 hover:bg-red-100 border-red-200',

    icon: XCircle
  },

  REFUNDED: {
    label: 'Đã hoàn tiền',

    className: 'bg-slate-100 text-slate-700 hover:bg-slate-100 border-slate-200',

    icon: RotateCcw
  }
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);

const formatDate = (seconds: number) => {
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(seconds * 1000));
};

const joinAddress = (address: { address1: string; address2?: string; city: string }) => {
  return [address.address1, address.address2, address.city].filter(Boolean).join(', ');
};

const getPaymentMethodLabel = (method: string) => {
  const map: Record<string, string> = {
    stripe: 'Stripe',
    cod: 'Thanh toán khi nhận hàng',
    paypal: 'PayPal',
    bank_transfer: 'Chuyển khoản'
  };

  return map[method.toLowerCase()] || method;
};

async function getOrder(orderId: string): Promise<OrderDetail> {
  // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`, {
  //   cache: 'no-store'
  // });

  // if (!response.ok) {
  //   throw new Error('Không thể tải đơn hàng');
  // }

  // const result = await response.json();
  const result = {
    id: '6fa847a4-3ba2-4d06-9c2c-3aec47377985',

    orderNumber: 'ORD-20260503-76697619',

    userId: 'e6d14eb9-268c-4a74-88b0-4b0d9731443b',

    customerEmail: 'anhkyohauik17@gmail.com',

    status: 'SHIPPED',

    paymentStatus: 'PAID',

    paymentMethod: 'cod',

    subtotal: 20000,

    tax: 0,

    shippingCost: 0,

    discount: 0,

    total: 20000,

    notes: '',

    shippingAddress: {
      firstName: 'Anh',
      lastName: 'Tuấn',
      address1: 'Thái Bình',
      address2: '',
      city: 'Thái Bình',
      phone: '0987654321'
    },

    billingAddress: {
      firstName: 'Anh',
      lastName: 'Tuấn',
      address1: 'Thái Bình',
      address2: '',
      city: 'Thái Bình',
      phone: '0987654321'
    },

    items: [
      {
        id: '7038cb3f-1a2f-4be0-974d-e9f35b37649d',

        productId: '4d24f89c-bb11-4c6d-b836-6e307bccaf90',

        variantId: 'cfdeece9-d138-46af-9b62-ba319108c8ee',

        name: 'Bút Bi Bấm I-5 0.5 mm – Radius – Mực Đen Đỏ',

        sku: 'BUT-RE-VAR-42E4F6',

        price: 2000,

        quantity: 10,

        subtotal: 20000,

        attributes: [
          {
            name: 'Màu sắc',
            value: 'Đỏ'
          }
        ]
      },
      {
        id: '7038cb3f-1a2f-4be0-974d-e9f35b376491',

        productId: '4d24f89c-bb11-4c6d-b836-6e307bccaf90',

        variantId: 'cfdeece9-d138-46af-9b62-ba319108c8ee',

        name: 'Bút Bi Bấm I-5 0.5 mm – Radius – Mực Đen Đỏ',

        sku: 'BUT-RE-VAR-42E4F6',

        price: 2000,

        quantity: 10,

        subtotal: 20000,

        attributes: [
          {
            name: 'Màu sắc',
            value: 'Đỏ'
          }
        ]
      }
    ],

    totalItems: 10,

    totalUniqueItems: 1,

    createdAt: {
      seconds: {
        low: 1777826187
      }
    },

    updatedAt: {
      seconds: {
        low: 1777826187
      }
    }
  };

  return result;
}

type Props = {
  params: Promise<{
    orderId: string;
  }>;
};

export default async function OrderDetailPage({ params }: Props) {
  const { orderId } = await params;

  const order = await getOrder(orderId);

  const status = orderStatusConfig[order.status];

  const payment = paymentStatusConfig[order.paymentStatus];

  const StatusIcon = status.icon;

  const PaymentIcon = payment.icon;

  const customerName = `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`;

  return (
    <section className='mx-auto max-w-5xl'>
      {/* HEADER */}
      <header className='mb-6 flex flex-col gap-4 md:mb-8 lg:flex-row lg:items-start lg:justify-between'>
        <div>
          <div className='flex flex-wrap items-center gap-2'>
            <Link href='/admin/orders'>
              <ArrowLeft className='h-5 w-5' />
            </Link>

            <h1 className='text-xl font-semibold tracking-tight md:text-2xl'>{order.orderNumber}</h1>

            <Badge variant='outline' className={`gap-1.5 rounded-full px-2.5 py-2 ${payment.className}`}>
              <PaymentIcon className='h-3.5 w-3.5' />

              {payment.label}
            </Badge>

            <Badge variant='outline' className={`gap-1.5 rounded-full px-2.5 py-2 ${status.badgeClassName}`}>
              <StatusIcon className='h-3.5 w-3.5' />

              {status.label}
            </Badge>
          </div>

          <p className='text-muted-foreground mt-1 text-xs md:text-sm'>{formatDate(order.createdAt.seconds.low)}</p>
        </div>
      </header>

      {/* CONTENT */}
      <main className='grid w-full grid-cols-1 gap-4 md:grid-cols-[2fr_1fr]'>
        {/* LEFT */}
        <section className='space-y-4'>
          {/* SHIPPING */}
          <Card className='rounded-xl border-zinc-200 bg-white p-4 shadow-sm'>
            <CardContent className='p-0'>
              <div
                className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium md:text-sm ${status.cardClassName}`}
              >
                <StatusIcon className='h-4 w-4' />

                {status.label}
              </div>

              <div className='mt-3 rounded-xl border border-zinc-200 bg-white'>
                <div className='flex items-center gap-3 border-b border-zinc-200 px-4 py-4'>
                  <Truck className='text-muted-foreground h-5 w-5' />

                  <div>
                    <p className='font-medium'>Vận chuyển</p>

                    <p className='text-sm text-zinc-500'>{status.description}</p>
                  </div>
                </div>

                <div className='divide-y divide-zinc-200'>
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className='flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between'
                    >
                      <div className='flex items-center gap-3'>
                        <div className='grid h-14 w-14 place-items-center rounded-xl border border-zinc-200 bg-zinc-100'>
                          <Package className='h-6 w-6 text-zinc-500' />
                        </div>

                        <div>
                          <p className='text-sm font-semibold'>{item.name}</p>

                          <p className='text-xs text-zinc-500'>SKU: {item.sku}</p>

                          {item.attributes?.length > 0 && (
                            <div className='mt-1 flex flex-wrap gap-2'>
                              {item.attributes.map((attr, index) => (
                                <span
                                  key={`${attr.name}-${index}`}
                                  className='text-muted-foreground rounded-full bg-zinc-100 px-2 py-1 text-xs'
                                >
                                  {attr.name}: {attr.value}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className='flex items-center justify-between gap-2 sm:justify-end'>
                        <p className='text-muted-foreground'>
                          {formatCurrency(item.price)}

                          <span className='mx-2 text-zinc-400'>×</span>

                          <span className='text-muted-foreground rounded-full bg-zinc-100 px-2 py-1 text-sm font-medium'>
                            {item.quantity}
                          </span>
                        </p>

                        <p className='min-w-24 text-right font-medium'>{formatCurrency(item.subtotal)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACTIONS */}
              <OrderActions
                orderId={order.id}
                status={order.status}
                paymentMethod={order.paymentMethod}
                primaryAction={status.primaryAction}
                secondaryActions={status.secondaryActions}
              />
            </CardContent>
          </Card>

          {/* PAYMENT */}
          <Card className='rounded-xl border-zinc-200 bg-white p-4 shadow-sm'>
            <CardContent className='p-0'>
              <div className='flex flex-wrap items-center gap-2'>
                <div className='text-muted-foreground inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2 text-xs! font-medium'>
                  <ReceiptText className='h-4 w-4' />

                  {payment.label}
                </div>

                <div className='text-muted-foreground inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2 text-xs! font-medium'>
                  <CreditCard className='h-4 w-4' />

                  {getPaymentMethodLabel(order.paymentMethod)}
                </div>
              </div>

              <div className='mt-3 rounded-xl border border-zinc-200'>
                <div className='space-y-3 px-4 py-4'>
                  <div className='grid grid-cols-[1fr_auto_auto] gap-4 text-xs sm:text-sm'>
                    <span className='text-muted-foreground'>Tạm tính</span>

                    <span className='text-muted-foreground'>{order.totalItems} sản phẩm</span>

                    <span className='font-medium'>{formatCurrency(order.subtotal)}</span>
                  </div>

                  <div className='grid grid-cols-[1fr_auto] gap-4 text-xs sm:text-sm'>
                    <span className='text-muted-foreground'>Thuế</span>

                    <span>{formatCurrency(order.tax)}</span>
                  </div>

                  <div className='grid grid-cols-[1fr_auto] gap-4 text-xs sm:text-sm'>
                    <span className='text-muted-foreground'>Phí vận chuyển</span>

                    <span>{formatCurrency(order.shippingCost)}</span>
                  </div>

                  <div className='grid grid-cols-[1fr_auto] gap-4 text-xs sm:text-sm'>
                    <span className='text-muted-foreground'>Giảm giá</span>

                    <span>- {formatCurrency(order.discount)}</span>
                  </div>

                  <div className='grid grid-cols-[1fr_auto] gap-4 text-xs font-semibold sm:text-sm'>
                    <span>Tổng cộng</span>

                    <span>{formatCurrency(order.total)}</span>
                  </div>
                </div>

                <Separator />

                <div className='grid grid-cols-[1fr_auto] gap-4 px-4 py-4 text-xs sm:text-sm'>
                  <span className='text-muted-foreground'>Trạng thái thanh toán</span>

                  <span className='font-medium'>{payment.label}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* RIGHT */}
        <aside className='space-y-4'>
          {/* NOTES */}
          <Card className='gap-2 rounded-xl border-zinc-200 bg-white p-4 shadow-sm'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 p-0'>
              <CardTitle className='text-base'>Ghi chú</CardTitle>
            </CardHeader>

            <CardContent className='text-muted-foreground p-0 text-xs md:text-sm'>
              {order.notes?.trim() ? order.notes : 'Không có ghi chú từ khách hàng'}
            </CardContent>
          </Card>

          {/* CUSTOMER */}
          <Card className='gap-2 rounded-xl border-zinc-200 bg-white p-4 shadow-sm'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 p-0'>
              <CardTitle className='text-base'>Khách hàng</CardTitle>

              {/* <Button variant='ghost' size='icon' className='h-8 w-8 text-zinc-500'>
                <MoreHorizontal className='h-4 w-4' />
              </Button> */}
            </CardHeader>

            <CardContent className='space-y-4 p-0'>
              <Link
                href={`/admin/customers/${order.userId}`}
                className='inline-flex items-center gap-1 font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline'
              >
                {customerName}

                <ExternalLink className='h-3.5 w-3.5' />
              </Link>

              <div className='space-y-1'>
                <p className='font-semibold'>Thông tin liên hệ</p>

                <p className='text-zinc-500'>Email: {order.customerEmail}</p>

                <p className='text-zinc-500'>SĐT: {order.shippingAddress.phone}</p>
              </div>

              <div className='space-y-1'>
                <p className='font-semibold'>Địa chỉ giao hàng</p>

                <p className='text-zinc-500'>{joinAddress(order.shippingAddress)}</p>
              </div>

              <div className='space-y-1'>
                <p className='font-semibold'>Địa chỉ thanh toán</p>

                <p className='text-zinc-500'>{joinAddress(order.billingAddress)}</p>
              </div>
            </CardContent>
          </Card>

          {/* INFO */}
          <Card className='rounded-xl border-dashed bg-white/70 p-4 shadow-sm'>
            <CardContent className='p-0'>
              <div className='flex items-start gap-3'>
                <PackageCheck className='text-muted-foreground mt-0.5 h-5 w-5' />

                <div>
                  <p className='font-medium'>Thông tin đơn hàng</p>

                  <p className='text-muted-foreground mt-1 text-sm'>ID: {order.id}</p>

                  <p className='text-muted-foreground mt-1 text-sm'>Tổng loại sản phẩm: {order.totalUniqueItems}</p>

                  <p className='text-muted-foreground mt-1 text-sm'>
                    Cập nhật lần cuối: {formatDate(order.updatedAt.seconds.low)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </main>
    </section>
  );
}
