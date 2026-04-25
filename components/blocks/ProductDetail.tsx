import { CircleCheck } from 'lucide-react';

import BreadcrumbSection from '@/components/blocks/BreadcrumbSection';
import ProductDescription from '@/components/blocks/ProductDescription';
import ProductInfo from '@/components/blocks/ProductInfo';
import { ProductPrice } from '@/components/blocks/ProductPrice';
import ProductReview from '@/components/blocks/ProductReview';
import Reviews from '@/components/blocks/Reviews';
import RelatedProduct from '@/components/blocks/RelatedProduct';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import ProductImages from './ProductImages';
import ProductPurchaseForm from './ProductPurchaseForm';

type StockStatusCode = 'IN_STOCK' | 'OUT_OF_STOCK';

interface StockInfo {
  stockStatusCode?: StockStatusCode;
  stockQuantity?: number;
}

type Option = {
  id: string;
  label: string;
  stockInfo: StockInfo;
  color?: string;
  value: string;
};

const formSchemaKeys = ['color', 'quantity', 'sizes'] as const;

type FieldName = (typeof formSchemaKeys)[number];

interface Hinges {
  label: string;
  id: string;
  name: FieldName;
  options?: Option[];
  min?: number;
  max?: number;
}

export type ProductFormValues = {
  color: string;
  quantity: number;
  sizes: string;
};

export interface ProductImagesProps {
  images: Array<{
    srcset: string;
    src: string;
    alt: string;
    width: number;
    height: number;
    sizes: string;
  }>;
}

export interface ProductPurchaseFormProps {
  hinges?: Partial<Record<FieldName, Hinges>>;
  selected: ProductFormValues;
  productId: string;
}

const PRODUCT_DETAILS = {
  id: 'product-1',
  name: 'Urban Chill Jacket',
  color: 'blue',
  sizes: 'm',
  reviews: {
    rate: 4.5,
    totalReviewers: 0
  },
  description:
    'This denim puffer jacket blends warmth and street style, featuring tonal blue shades for a distinctive look thats both bold and versatile.',
  price: {
    regular: 300000,
    sale: 200000,
    currency: 'USD'
  },
  hinges: {
    sizes: {
      label: 'Select size',
      id: 'sizes',
      name: 'sizes',
      options: [
        {
          id: 'xs',
          label: 'xs',
          value: 'xs',
          stockInfo: { stockStatusCode: 'OUT_OF_STOCK' }
        },
        {
          id: 's',
          label: 's',
          value: 's',
          stockInfo: { stockStatusCode: 'OUT_OF_STOCK' }
        },
        {
          id: 'm',
          label: 'm',
          value: 'm',
          stockInfo: { stockStatusCode: 'IN_STOCK' }
        },
        {
          id: 'l',
          label: 'l',
          value: 'l',
          stockInfo: { stockStatusCode: 'IN_STOCK' }
        },
        {
          id: 'xl',
          label: 'xl',
          value: 'xl',
          stockInfo: { stockStatusCode: 'IN_STOCK' }
        }
      ]
    }
  },
  images: [
    {
      srcset:
        'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764033-3.jpg 1920w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764033-2.jpg 1280w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764033-1.jpg 640w',
      src: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764033-3.jpg',
      alt: '',
      width: 1920,
      height: 2880,
      sizes: '(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw'
    },
    {
      srcset:
        'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764699-3.jpg 1920w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764699-2.jpg 1280w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764699-2.jpg 640w',
      src: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764699-3.jpg',
      alt: '',
      width: 1920,
      height: 2880,
      sizes: '(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw'
    },
    {
      srcset:
        'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764036-3.jpg 1920w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764036-2.jpg 1280w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764036-1.jpg 640w',
      src: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764036-3.jpg',
      alt: '',
      width: 1920,
      height: 2880,
      sizes: '(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw'
    },
    {
      srcset:
        'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764040-3.jpg 1920w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764040-2.jpg 1280w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764040-1.jpg 640w',
      src: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764040-3.jpg',
      alt: '',
      width: 1920,
      height: 2880,
      sizes: '(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw'
    }
  ]
};

interface ProductDetailProps {
  className?: string;
}

export default async function ProductDetail({ className }: ProductDetailProps) {
  const product = PRODUCT_DETAILS;

  const isInStock = product.hinges.sizes?.options?.some((item) => item.stockInfo.stockStatusCode === 'IN_STOCK');

  return (
    <>
      <section className='py-4 md:py-8'>
        <BreadcrumbSection />
      </section>

      <section className={cn('', className)}>
        <div>
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12'>
            <div>
              <ProductImages images={product.images} />
            </div>

            <div className='space-y-6'>
              <div className='space-y-4'>
                <div className='flex flex-wrap items-start justify-between gap-4'>
                  <div className='flex-1'>
                    <h1 className='text-xl font-bold tracking-tight lg:text-3xl'>{product.name}</h1>

                    <div className='mt-3 flex flex-wrap items-center gap-4'>
                      <Reviews rate={product.reviews.rate} totalReviewers={product.reviews.totalReviewers} />

                      <Badge variant='secondary'>
                        <CircleCheck />
                        {isInStock ? 'Còn hàng' : 'Hết hàng'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <ProductPrice showBadge={false} {...product.price} className='text-xl' />

                <p className='text-muted-foreground'>{product.description}</p>
              </div>

              <ProductPurchaseForm
                productId={product.id}
                hinges={product.hinges}
                selected={{
                  size: product.sizes,
                  color: product.color,
                  quantity: 1
                }}
              />

              <ProductInfo
                info={[
                  { label: 'Material', value: '100% Premium Denim' },
                  { label: 'Style', value: 'Puffer Jacket' },
                  { label: 'Season', value: 'All Season' },
                  { label: 'Care', value: 'Machine Washable' },
                  { label: 'Origin', value: 'Made in Italy' },
                  { label: 'Fit', value: 'Regular Fit' }
                ]}
              />
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 py-4'>
            <Separator />

            <ProductDescription
              className='md:pr-2'
              description={`<p><strong>Bút</strong><strong> lông dầu PILOT</strong> là một loại <a target="_blank" rel="noopener noreferrer nofollow" class="google-anno" href="https://vanphongphamminaco.com/but-long-dau-pilot/#">&nbsp;<span style="color: inherit"><u>bút</u></span></a> viết dầu có thiết kế 2 đầu, được sử dụng để viết trên nhiều loại bề mặt.</p>`}
            />

            <Separator />

            <ProductReview className='' {...product.reviews} />
          </div>
        </div>
      </section>

      <RelatedProduct />
    </>
  );
}
