import BreadcrumbSection from '@/components/blocks/BreadcrumbSection';
import PaginationSection from '@/components/blocks/PaginationSection';
import ProductList from '@/components/blocks/ProductList';
import ProductResultInfo from '@/components/blocks/ProductsResultInfo';
import ProductToolbarFilter from '@/components/blocks/ProductToolbarFilter';
import { getProducts, type ProductOrderBy } from '@/services/product.service';

interface Props {
  searchParams: Promise<{
    page?: string;
    sort?: string;
    brand?: string;
    category?: string;
    search?: string;
  }>;
}

const SORT_TO_ORDER_BY: Record<string, ProductOrderBy> = {
  newest: 'created_at_desc',
  oldest: 'created_at_asc',
  price_asc: 'price_asc',
  price_desc: 'price_desc',
  name_asc: 'name_asc',
  name_desc: 'name_desc'
};

const DEFAULT_LIMIT = 1;

async function getProductList({
  page,
  sort,
  brand,
  category,
  search
}: {
  page: number;
  sort: string;
  brand?: string;
  category?: string;
  search?: string;
}) {
  const res = await getProducts({
    page,
    limit: DEFAULT_LIMIT,
    orderBy: SORT_TO_ORDER_BY[sort] ?? SORT_TO_ORDER_BY.newest,
    brand: brand || undefined,
    category: category || undefined,
    search: search || undefined
  });

  if (!res?.ok || !res?.data?.data) {
    return {
      items: [],
      total: 0,
      page,
      limit: DEFAULT_LIMIT,
      totalPages: 1
    };
  }

  return res.data.data;
}

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;

  const currentPage = Number(params.page ?? 1);
  const currentSort = params.sort ?? 'newest';
  const currentBrand = params.brand ?? '';
  const currentCategory = params.category ?? '';
  const currentSearch = params.search ?? '';

  const productsData = await getProductList({
    page: currentPage,
    sort: currentSort,
    brand: currentBrand,
    category: currentCategory,
    search: currentSearch
  });

  const title = currentSearch
    ? `Kết quả tìm kiếm: ${currentSearch}`
    : currentCategory
      ? 'Sản phẩm theo danh mục'
      : 'Tất cả sản phẩm';

  return (
    <>
      <section className='flex flex-col gap-4 py-4 md:flex-row md:justify-between md:py-8'>
        <BreadcrumbSection />

        <ProductResultInfo page={productsData.page} limit={productsData.limit} total={productsData.total} />
      </section>

      <ProductToolbarFilter title={title} currentSort={currentSort} currentBrand={currentBrand} />

      <ProductList products={productsData.items} />

      <PaginationSection
        currentPage={productsData.page}
        totalPages={productsData.totalPages}
        basePath='/products'
        searchParams={params}
      />
    </>
  );
}
