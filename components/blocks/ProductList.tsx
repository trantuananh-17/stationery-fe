import ProductCard from './ProductCard';
import type { ProductItem } from '@/types/product.type';

interface ProductListProps {
  products?: ProductItem[];
}

export default function ProductList({ products = [] }: ProductListProps) {
  return (
    <section className='py-2 sm:py-4 md:py-8'>
      <h2 className='sr-only'>Danh sách sản phẩm</h2>

      {products.length === 0 ? (
        <div className='flex min-h-40 items-center justify-center rounded-lg border border-dashed'>
          <p className='text-muted-foreground text-sm'>Không có sản phẩm nào.</p>
        </div>
      ) : (
        <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5'>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
