import { getTranslations, setRequestLocale } from 'next-intl/server';

import AdminPagination from '@/components/blocks/admin/AdminPagination';
import CouponTable from '@/components/blocks/admin/CouponTable';
import TitlePage from '@/components/blocks/admin/TitlePage';
import { getToken } from '@/lib/auth';
import { getValidLimit, getValidPage } from '@/lib/utils';
import { getCoupons } from '@/services/coupon.service';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; limit?: string; search?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Coupon' });
  return { title: t('title') };
}

export default async function Page({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Coupon' });

  const sp = await searchParams;
  const currentPage = getValidPage(sp.page);
  const currentLimit = getValidLimit(sp.limit);

  const token = await getToken();

  const response = await getCoupons(token, {
    page: currentPage,
    limit: currentLimit,
    search: sp.search || undefined
  });

  const data = response.data?.data;

  return (
    <div className='space-y-4'>
      <TitlePage title={t('title')} subtitle={t('subtitle')} />

      <CouponTable accessToken={token} coupons={data?.items ?? []} />

      <AdminPagination
        pagination={{
          page: currentPage,
          limit: currentLimit,
          total: data?.total ?? 0,
          totalPages: data?.totalPages ?? 0
        }}
      />
    </div>
  );
}
