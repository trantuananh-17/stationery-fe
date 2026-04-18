import { CircleCheck } from 'lucide-react';
import BreadcrumbSection from '@/components/blocks/BreadcrumbSection';
import ProductDescription from '@/components/blocks/ProductDescription';
import ProductInfo from '@/components/blocks/ProductInfo';
import { ProductPrice } from '@/components/blocks/ProductPrice';
import ProductReview from '@/components/blocks/ProductReview';
import Reviews from '@/components/blocks/Reviews';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import RelatedProduct from '@/components/blocks/RelatedProduct';
import ProductPurchaseForm from './ProductPurchaseForm';
import ProductImages from './ProductImages';

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

const formSchemaKeys = ['color', 'quantity', 'size'] as const;
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
  size: string;
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
  hinges?: Record<FieldName, Hinges>;
  selected: ProductFormValues;
  productId: string;
}

const PRODUCT_DETAILS = {
  id: 'product-1',
  name: 'Urban Chill Jacket',
  color: 'blue',
  size: 'm',
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
    size: {
      label: 'Select size',
      id: 'size',
      name: 'size',
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
  } as Record<FieldName, Hinges>,
  images: [
    {
      srcset: '',
      src: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764033-3.jpg',
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

  const isInStock = product.hinges.size.options?.some((item) => item.stockInfo.stockStatusCode === 'IN_STOCK');

  return (
    <DefaultLayout>
      <section className='py-4 md:py-8'>
        <BreadcrumbSection />
      </section>

      <section className={cn('', className)}>
        <div className='container'>
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
                        {isInStock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <ProductPrice {...product.price} className='text-xl' />
                <p className='text-muted-foreground'>{product.description}</p>
              </div>

              <ProductPurchaseForm
                productId={product.id}
                hinges={product.hinges}
                selected={{
                  size: product.size,
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
              description={`<p><strong>Bút</strong><strong> lông dầu PILOT</strong> là một loại <a target="_blank" rel="noopener noreferrer nofollow" class="google-anno" href="https://vanphongphamminaco.com/but-long-dau-pilot/#">&nbsp;<span style="color: inherit"><u>bút</u></span></a> viết dầu có thiết kế 2 đầu, được sử dụng để viết trên nhiều loại bề mặt. Dưới đây là thông tin chi tiết về sản phẩm này:</p><p><strong>Thông số kỹ thuật:</strong></p><ul class="list-disc"><li><p><strong>Kiểu bút:</strong> Bút lông dầu 2 đầu.</p></li><li><p><strong>Số lượng trong một hộp:</strong> 12 cây/hộp.</p></li></ul><p><strong>Đặc điểm và tính năng:</strong></p><ul class="list-disc"><li><p><strong>Bút 2 đầu:</strong> Sản phẩm có hai đầu viết khác nhau hoặc màu sắc khác nhau, giúp bạn chuyển đổi giữa các đặc tính viết một cách dễ dàng.</p></li><li><p><strong>Kiểu dáng thon nhỏ:</strong> Thiết kế của bút thon nhỏ, tiện lợi và dễ sử dụng.</p></li><li><p><strong>Mực đậm:</strong> Bút lông dầu PILOT viết với mực đậm, giúp văn bản nổi bật và dễ đọc.</p></li><li><p><strong>Độ bền màu cao:</strong> Mực viết có độ bền màu cao, không bị nhòe hoặc phai màu sau thời gian sử dụng.</p></li><li><p><strong>Không độc hại:</strong> Sản phẩm không chứa các hạt kim loại nặng độc hại đối với người sử dụng.</p></li></ul><p><strong>Bảo quản:</strong></p><ul class="list-disc"><li><p>Tránh để sản phẩm gần nhiệt độ cao.</p></li><li><p>Tránh va chạm mạnh vào các vật cứng để bảo quản sản phẩm trong tình trạng tốt nhất.</p></li></ul><p><strong>Đối tượng sử dụng phù hợp:</strong></p><ul class="list-disc"><li><p><span style="color: var(--editor-text-blue)"><strong>Các cá nhân và chuyên nghiệp:</strong></span> Bút lông dầu PILOT phù hợp cho cả cá nhân và người làm việc chuyên nghiệp trong việc viết và ghi chép trên nhiều loại giấy và bề mặt.</p></li></ul><p><strong>Ứng dụng trong thực tế:</strong></p><p><span style="color: inherit">Bút viết bảng không xóa được</span></p><p></p><ul class="list-disc"><li><p>Sản phẩm có thể được sử dụng trong văn phòng, trường học, và trong các hoạt động sáng tạo và nghệ thuật.</p></li><li><p>Sản phẩm cũng thích hợp để sử dụng trong việc đánh dấu và tô màu.</p></li></ul><p><strong>Mẹo sử dụng sản phẩm hữu ích:</strong></p><ul class="list-disc"><li><p>Khi không sử dụng, nên đậy kín nắp để tránh mực khô hoặc tiết kiệm mực.</p></li><li><p>Bảo quản sản phẩm ở nhiệt độ phòng và tránh ánh nắng trực tiếp để giữ cho mực không bị chảy hoặc thay đổi màu sắc.</p></li></ul><p>Minaco chuyên cung cấp: văn phòng phẩm, thiết bị máy văn phòng, vật tư tiêu hao, vật tư phòng sạch. Tham khảo ngay danh sách Văn phòng phẩm cơ bản hoặc danh sách Văn phòng phẩm bán chạy. Để được tư vấn trực tiếp vui lòng liên hệ hotline: <a target="_blank" rel="noopener noreferrer nofollow" href="tel:0961531616">0961 53 16 16</a></p>`}
            />

            <Separator />

            <ProductReview className='' {...product.reviews} />
          </div>
        </div>
      </section>

      <RelatedProduct />
    </DefaultLayout>
  );
}
