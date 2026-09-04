import { getTranslations, setRequestLocale } from 'next-intl/server';

import AdminPagination from '@/components/blocks/admin/AdminPagination';
import InventoryTable from '@/components/blocks/admin/InventoryTable';
import InventoryToolbar from '@/components/blocks/admin/InventoryToolbar';
import TitlePage from '@/components/blocks/admin/TitlePage';
import { getToken } from '@/lib/auth';
import { getValidLimit, getValidPage } from '@/lib/utils';
import { getInventories } from '@/services/inventory.service';

/** Ngưỡng cảnh báo sắp hết hàng, tính trên tồn khả dụng (stock - reserved). */
const LOW_STOCK_THRESHOLD = 5;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; limit?: string; search?: string; lowStock?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'AdminInventories' });
  return { title: t('title') };
}

export default async function Page({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'AdminInventories' });

  const sp = await searchParams;
  const currentPage = getValidPage(sp.page);
  const currentLimit = getValidLimit(sp.limit);
  const currentSearch = sp.search ?? '';
  const lowStockOnly = sp.lowStock === '1';

  const token = await getToken();

  const response = await getInventories(token, {
    page: currentPage,
    limit: currentLimit,
    search: currentSearch || undefined,
    lowStockThreshold: lowStockOnly ? LOW_STOCK_THRESHOLD : undefined
  });

  const data = response.data?.data;

  return (
    <div className='space-y-4'>
      <TitlePage title={t('title')} subtitle={t('subtitle')} />

      <InventoryToolbar currentSearch={currentSearch} lowStockOnly={lowStockOnly} />

      <InventoryTable
        accessToken={token}
        items={data?.items ?? []}
        lowStockThreshold={LOW_STOCK_THRESHOLD}
      />

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
