import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

import { cn } from '@/lib/utils';
import { ProductAdvisorItem, ProductAdvisorResponse } from '@/types/chatbot.type';

type ProductAdvisorMessageProps = {
  data: ProductAdvisorResponse;
  fullscreen?: boolean;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(value);
}

function ProductItem({ item, fullscreen }: { item: ProductAdvisorItem; fullscreen?: boolean }) {
  const imageSize = fullscreen ? 112 : 80;

  return (
    <div className='bg-background overflow-hidden rounded-xl border'>
      <div className={cn('flex', fullscreen ? 'gap-4 p-4' : 'gap-3 p-3')}>
        {item.variantImage && (
          <Image
            src={item.variantImage}
            alt={item.productName}
            width={imageSize}
            height={imageSize}
            sizes={fullscreen ? '112px' : '80px'}
            className={cn('shrink-0 rounded-lg object-cover', fullscreen ? 'h-24 w-24 md:h-28 md:w-28' : 'h-20 w-20')}
          />
        )}

        <div className='min-w-0 flex-1'>
          <p className={cn('line-clamp-2 leading-snug font-medium', fullscreen ? 'text-base' : 'text-sm')}>
            {item.productName}
          </p>

          {item.variantName && <p className='text-muted-foreground mt-1 text-xs'>Phân loại: {item.variantName}</p>}

          <div className='mt-2 flex flex-wrap items-center gap-2'>
            <span className={cn('text-primary font-semibold', fullscreen ? 'text-base' : 'text-sm')}>
              {formatCurrency(item.price)}
            </span>

            {!!item.compareAtPrice && item.compareAtPrice > item.price && (
              <span className='text-muted-foreground text-xs line-through'>{formatCurrency(item.compareAtPrice)}</span>
            )}
          </div>

          {typeof item.stock === 'number' && (
            <p className='text-muted-foreground mt-1 text-xs'>Còn hàng: {item.stock}</p>
          )}
        </div>
      </div>

      {item.productUrl && (
        <a
          href={item.productUrl}
          className={cn(
            'text-primary hover:text-primary/80 flex items-center justify-center gap-1 border-t font-medium',
            fullscreen ? 'px-3 py-2 text-sm' : 'px-2 py-1.5 text-xs'
          )}
        >
          Xem sản phẩm
          <ExternalLink className='h-3 w-3' />
        </a>
      )}
    </div>
  );
}

export function ProductAdvisorMessage({ data, fullscreen }: ProductAdvisorMessageProps) {
  return (
    <div className='bg-muted text-foreground max-w-full rounded-2xl px-4 py-3 text-sm leading-relaxed'>
      <p className='whitespace-pre-line'>{data.response}</p>

      {data.items.length > 0 && (
        <div className={cn('mt-3 gap-3', fullscreen ? 'grid grid-cols-1 2xl:grid-cols-2' : 'flex flex-col')}>
          {data.items.map((item, index) => (
            <ProductItem
              key={`${item.productId ?? item.productUrl ?? item.productName}-${item.variantName ?? 'default'}-${index}`}
              item={item}
              fullscreen={fullscreen}
            />
          ))}
        </div>
      )}
    </div>
  );
}
