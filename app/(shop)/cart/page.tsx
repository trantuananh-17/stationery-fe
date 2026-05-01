import CartClient from '@/components/blocks/CartClient';

export default async function page() {
  return (
    <section className='py-8 lg:py-12'>
      <div className='container'>
        <h1 className='mb-4 text-2xl font-semibold lg:text-3xl'>Giỏ Hàng</h1>

        <CartClient />
      </div>
    </section>
  );
}
