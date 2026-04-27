import ProductForm from '@/components/blocks/admin/ProductForm';

export default async function page() {
  return (
    <section className='mx-auto max-w-4xl'>
      <span>Page</span>

      <ProductForm />
    </section>
  );
}
