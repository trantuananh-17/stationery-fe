import Banner from '@/components/blocks/Banner';
import BestPriceSection from '@/components/blocks/BestPriceSection';
import BrandCollection from '@/components/blocks/BrandCollection';
import CategoryList from '@/components/blocks/CategoryList';
import ProductShowCase from '@/components/blocks/ProductShowCase';
import StoreDescriptionSection from '@/components/blocks/StoreDescriptionSection';
import DefaultLayout from '@/components/layouts/DefaultLayout';

export default function Home() {
  return (
    <DefaultLayout>
      <Banner />

      <CategoryList />

      <ProductShowCase />

      <BestPriceSection />

      <BrandCollection />
      <ProductShowCase />
      <ProductShowCase />

      <StoreDescriptionSection />
    </DefaultLayout>
  );
}
