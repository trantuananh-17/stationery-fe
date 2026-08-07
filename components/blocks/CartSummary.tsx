import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { RotateCcw, ShieldCheck, ShoppingCart, Truck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface Props {
  totalItems: number;
  subtotal: number;
  shipping: number;
  total: number;
}

export default function CartSummary({ totalItems, subtotal, shipping, total }: Props) {
  const t = useTranslations('CartSummary');

  const formatVND = (value: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  const TRUST_SIGNALS = [
    { icon: ShieldCheck, title: t('trustPayment') },
    { icon: RotateCcw, title: t('trustReturn') },
    { icon: Truck, title: t('trustShipping') }
  ];

  return (
    <div className='bg-card rounded-xl p-6'>
      <h2 className='mb-6 text-2xl font-semibold'>{t('title')}</h2>

      <div className='space-y-4'>
        <div className='text-muted-foreground flex items-center gap-2'>
          <ShoppingCart className='size-4' />
          <span>
            {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className='flex items-center justify-between text-base'>
          <span className='text-muted-foreground'>{t('subtotal')}</span>
          <span>{formatVND(subtotal)}</span>
        </div>

        <div className='flex items-center justify-between text-base'>
          <span className='text-muted-foreground'>{t('shipping')}</span>
          <span>{t('shippingFree')}</span>
        </div>

        <Separator />

        <div className='flex items-center justify-between text-xl font-semibold'>
          <span>{t('total')}</span>
          <span>{formatVND(total)}</span>
        </div>
      </div>

      <Button asChild size='lg' className='mt-6 w-full'>
        <Link href='/checkouts'>{t('checkout')}</Link>
      </Button>

      <p className='text-muted-foreground mt-4 text-center text-sm'>{t('taxNote')}</p>

      <Separator className='my-4' />

      <div className='text-muted-foreground text-md flex flex-col gap-2'>
        {TRUST_SIGNALS.map((item, index) => (
          <div key={index} className='flex items-start justify-start gap-2'>
            <div className='flex h-full items-center justify-center'>
              <item.icon size={20} className='text-primary' />
            </div>
            <p>{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
