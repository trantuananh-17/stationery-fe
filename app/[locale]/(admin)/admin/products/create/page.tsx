import ProductForm from '@/components/blocks/admin/ProductForm';

export default async function page() {
  return (
    <section className='mx-auto max-w-5xl'>
      <h1 className='mb-4 text-xl font-semibold lg:text-2xl'>Thêm sản phẩm</h1>

      <ProductForm />
    </section>
  );
}
