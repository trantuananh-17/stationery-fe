import React from 'react';
import ProductCard from './ProductCard';

export default function ProductList() {
  return (
    <section className='py-2 sm:py-4 md:py-8'>
      <h2 className='mb-4 text-2xl font-semibold'>Sản phẩm tương tự</h2>

      <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6'>
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
      </div>
    </section>
  );
}
