import AdminPagination from '@/components/blocks/admin/AdminPagination';
import ProductsDataTable from '@/components/blocks/admin/ProductsDataTable';
import TitlePage from '@/components/blocks/admin/TitlePage';
import ReindexButton from '@/components/blocks/admin/ReindexButton';
import { routing } from '@/i18n/routing';
import { getToken } from '@/lib/auth';
import { getValidLimit, getValidPage } from '@/lib/utils';
import { AdminProductStatus, getAdminProducts } from '@/services/product.service';
import { setRequestLocale } from 'next-intl/server';

export type AdminProductOrderBy =
  | 'name_asc'
  | 'name_desc'
  | 'stock_asc'
  | 'stock_desc'
  | 'price_asc'
  | 'price_desc'
  | 'created_at_asc'
  | 'created_at_desc';

const SORT_TO_ORDER_BY: Record<string, AdminProductOrderBy> = {
  newest: 'created_at_desc',
  oldest: 'created_at_asc',
  name_asc: 'name_asc',
  name_desc: 'name_desc',
  stock_asc: 'stock_asc',
  stock_desc: 'stock_desc',
  price_asc: 'price_asc',
  price_desc: 'price_desc',
  created_at_asc: 'created_at_asc',
  created_at_desc: 'created_at_desc'
};

function isProductStatus(value?: string): value is AdminProductStatus {
  return value === 'active' || value === 'draft' || value === 'archived' || value === 'deleted';
}

async function getProductList({
  page,
  limit,
  sort,
  status,
  search
}: {
  page: number;
  limit: number;
  sort: string;
  status: string;
  search?: string;
}) {
  const token = await getToken();

  const res = await getAdminProducts(token, {
    page,
    limit,
    orderBy: SORT_TO_ORDER_BY[sort] ?? SORT_TO_ORDER_BY.newest,
    status: isProductStatus(status) ? status : undefined,
    search: search || undefined
  });
  if (!res?.ok || !res?.data?.data) return { items: [], total: 0, page, limit, totalPages: 1 };
  return res.data.data;
}

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; status?: string; sort?: string; search?: string; limit?: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Page({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const sp = await searchParams;
  const currentPage = getValidPage(sp.page);
  const currentLimit = getValidLimit(sp.limit);
  const currentStatus = sp.status ?? 'all';
  const currentSort = sp.sort ?? 'newest';
  const currentSearch = sp.search ?? '';

  const productsData = await getProductList({
    page: currentPage,
    limit: currentLimit,
    sort: currentSort,
    status: currentStatus,
    search: currentSearch
  });

  return (
    <div className='space-y-4'>
      <TitlePage
        title='Quản lý sản phẩm'
        subtitle='Theo dõi và quản lý toàn bộ sản phẩm, tồn kho và trạng thái hiển thị.'
        button={{ label: 'Thêm sản phẩm', href: '/admin/products/create' }}
      />
      <div className='flex justify-end'>
        <ReindexButton />
      </div>

      <ProductsDataTable products={productsData.items ?? []} currentSort={currentSort} currentStatus={currentStatus} />
      <AdminPagination
        pagination={{
          page: currentPage,
          limit: currentLimit,
          total: productsData.total,
          totalPages: productsData.totalPages
        }}
      />
    </div>
  );
}
