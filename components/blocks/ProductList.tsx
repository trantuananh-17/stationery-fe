import React from 'react';
import ProductCard from './ProductCard';

export default function ProductList() {
  return (
    <section className='py-2 sm:py-4 md:py-8'>
      <h2 className='sr-only'>Danh sách sản phẩm</h2>

      <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5'>
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
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
