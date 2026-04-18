import BreadcrumbSection from '@/components/blocks/BreadcrumbSection';
import PaginationSection from '@/components/blocks/PaginationSection';
import ProductList from '@/components/blocks/ProductList';
import ProductResultInfo from '@/components/blocks/ProductsResultInfo';
import ProductToolbarFilter from '@/components/blocks/ProductToolbarFilter';
import DefaultLayout from '@/components/layouts/DefaultLayout';

interface Props {
  searchParams: Promise<{
    page?: string;
    sort?: string;
    brand?: string;
  }>;
}

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const currentPage = Number(params.page || '1');
  const currentSort = params.sort || 'newest';
  const currentBrand = params.brand || '';

  const pagination = {
    page: currentPage,
    totalPages: 20
  };

  console.log(params.page);
  console.log(params.brand);
  console.log(params.sort);
  return (
    <DefaultLayout>
      <section className='flex flex-col gap-4 py-4 md:flex-row md:justify-between md:py-8'>
        <BreadcrumbSection />
        <ProductResultInfo page={currentPage} limit={8} total={100} />
      </section>

      <ProductToolbarFilter title='Bút nước - Bút gel - Bút bi' currentSort={currentSort} currentBrand={currentBrand} />

      <ProductList />

      <PaginationSection
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        basePath='/products'
        searchParams={params}
      />
    </DefaultLayout>
  );
}
