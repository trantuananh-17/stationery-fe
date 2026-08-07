import { useTranslations } from 'next-intl';

interface Props {
  page: number;
  limit: number;
  total: number;
}

export default function ProductResultInfo({ page, limit, total }: Props) {
  const t = useTranslations('ProductResultInfo');
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return <p className='text-muted-foreground text-md'>{t('showing', { from, to, total })}</p>;
}
