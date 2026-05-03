import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';
import { CartItem } from '@/stores/cart-store';
import { CheckoutStockItem } from '@/types/order.type';
import Image from 'next/image';
import { Card } from '../ui/card';
import { Separator } from '../ui/separator';

const stockStatusConfig = {
  reserved: {
    label: 'Đã giữ hàng',
    badgeClass: 'bg-green-50 text-green-600 ring-green-200',
    boxClass: 'border-green-400 bg-green-50 text-green-700'
  },
  insufficient_stock: {
    label: 'Không đủ hàng',
    badgeClass: 'bg-red-50 text-red-600 ring-red-200',
    boxClass: 'border-red-400 bg-red-50 text-red-700'
  },
  not_found: {
    label: 'Không tồn tại',
    badgeClass: 'bg-gray-50 text-gray-600 ring-gray-200',
    boxClass: 'border-gray-400 bg-gray-50 text-gray-700'
  },
  inactive: {
    label: 'Ngừng bán',
    badgeClass: 'bg-orange-50 text-orange-600 ring-orange-200',
    boxClass: 'border-orange-400 bg-orange-50 text-orange-700'
  },
  invalid_quantity: {
    label: 'Số lượng lỗi',
    badgeClass: 'bg-yellow-50 text-yellow-600 ring-yellow-200',
    boxClass: 'border-yellow-400 bg-yellow-50 text-yellow-700'
  }
};

interface Props {
  item: CartItem;
  isPaymentPage?: boolean;
  stockError?: CheckoutStockItem;
}

export default function CheckoutItem({ item, isPaymentPage, stockError }: Props) {
  const formatVND = (value: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);

  return (
    <div className={cn(isPaymentPage && 'my-4')}>
      <div className='bg-card relative flex flex-col gap-4 sm:flex-row'>
        <Card className='w-full shrink-0 p-0 sm:w-28'>
          <AspectRatio ratio={1} className='bg-muted relative overflow-hidden rounded-lg'>
            {item.imageVariantSnapshot ? (
              <Image src={item.imageVariantSnapshot} alt={item.productNameSnapshot} fill className='object-cover' />
            ) : (
              <Image src={item.productThumbnailSnapshot} alt={item.productNameSnapshot} fill className='object-cover' />
            )}
          </AspectRatio>
        </Card>

        <div className='flex flex-1 flex-col justify-between gap-0'>
          <h2 className='text-lg font-semibold'>{item.productNameSnapshot}</h2>
          <div className='text-muted-foreground flex items-center gap-2 text-sm'>
            {item.variantNameSnapshot && <p className=''>{item.variantNameSnapshot}</p>} •
            <p className=''>Số lượng: {item.quantity}</p>
            {stockError && (
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-xs font-medium ring-1',
                  stockStatusConfig[stockError.status].badgeClass
                )}
              >
                {getStockBadgeText(stockError)}
              </span>
            )}
          </div>
          <p className='text-muted-foreground text-sm'>Đơn giá: {formatVND(item.unitPriceSnapshot)} mỗi sản phẩm</p>

          {!isPaymentPage && (
            <p className='text-sm font-semibold'>Thành tiền: {formatVND(item.unitPriceSnapshot * item.quantity)}</p>
          )}
        </div>
      </div>
      {stockError && (
        <div
          className={cn('mt-3 rounded-md border-l-4 px-3 py-2 text-sm', stockStatusConfig[stockError.status].boxClass)}
        >
          <div className='font-medium'>{stockStatusConfig[stockError.status].label}</div>
        </div>
      )}
      {!isPaymentPage && <Separator className='my-4' />}
    </div>
  );
}

function getStockBadgeText(error: CheckoutStockItem) {
  if (error.status === 'insufficient_stock') {
    return error.availableStock === 0 ? 'Hết hàng' : `Chỉ còn ${error.availableStock}`;
  }

  return stockStatusConfig[error.status].label;
}
