import AdminPagination from '@/components/blocks/admin/AdminPagination';
import ProductsDataTable from '@/components/blocks/admin/ProductsDataTable';
import TitlePage from '@/components/blocks/admin/TitlePage';
import { getValidLimit, getValidPage } from '@/lib/utils';
import { AdminProductStatus, getAdminProducts } from '@/services/product.service';

export type AdminProductOrderBy =
  | 'name_asc'
  | 'name_desc'
  | 'stock_asc'
  | 'stock_desc'
  | 'price_asc'
  | 'price_desc'
  | 'created_at_asc'
  | 'created_at_desc';

interface Props {
  searchParams: Promise<{
    page?: string;
    status?: string;
    sort?: string;
    search?: string;
    limit?: string;
  }>;
}

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
  return value === 'active' || value === 'draft' || value === 'archived';
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
  const res = await getAdminProducts({
    page,
    limit,
    orderBy: SORT_TO_ORDER_BY[sort] ?? SORT_TO_ORDER_BY.newest,
    status: isProductStatus(status) ? status : undefined,
    search: search || undefined
  });

  if (!res?.ok || !res?.data?.data) {
    return {
      items: [],
      total: 0,
      page,
      limit,
      totalPages: 1
    };
  }

  console.log(res.data.data);

  return res.data.data;
}

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;

  const currentPage = getValidPage(params.page);
  const currentLimit = getValidLimit(params.limit);

  const currentStatus = params.status ?? 'all';
  const currentSort = params.sort ?? 'newest';
  const currentSearch = params.search ?? '';

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
        subtitle='Browse and manage your product catalog.'
        button={{
          label: 'Thêm sản phẩm',
          href: '/admin/products/create'
        }}
      />

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
