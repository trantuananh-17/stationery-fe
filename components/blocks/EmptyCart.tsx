import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';

export default function EmptyCart() {
  const t = useTranslations('EmptyCart');

  return (
    <div className='bg-card flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed px-6 py-12 text-center'>
      <h2 className='text-2xl font-semibold'>{t('title')}</h2>
      <p className='text-muted-foreground mt-3 max-w-md'>{t('description')}</p>

      <Button asChild className='mt-6'>
        <Link href='/products'>{t('continueShopping')}</Link>
      </Button>
    </div>
  );
}
