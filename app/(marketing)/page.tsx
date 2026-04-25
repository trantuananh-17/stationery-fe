import Banner from '@/components/blocks/Banner';
import BestPriceSection from '@/components/blocks/BestPriceSection';
import BrandCollection from '@/components/blocks/BrandCollection';
import CategoryList from '@/components/blocks/CategoryList';
import ProductShowCase from '@/components/blocks/ProductShowCase';
import StoreDescriptionSection from '@/components/blocks/StoreDescriptionSection';

export default function Home() {
  return (
    <>
      <Banner />

      <CategoryList />

      <ProductShowCase />

      <BestPriceSection />

      <BrandCollection />
      <ProductShowCase />
      <ProductShowCase />

      <StoreDescriptionSection />
    </>
  );
}
