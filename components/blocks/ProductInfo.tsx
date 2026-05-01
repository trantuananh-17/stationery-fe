export interface ProductSpecification {
  id: string;
  attributeId: string;
  attributeName: string;
  value: string;
}

interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  parent?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

interface ProductBrand {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  specifications?: ProductSpecification[];
  category?: ProductCategory;
  brand?: ProductBrand;
}

export default function ProductInfo({ specifications = [], category, brand }: Props) {
  const hasInfo = category || brand || specifications.length > 0;

  if (!hasInfo) return null;

  return (
    <div>
      <h2 className='mb-4 text-lg font-semibold'>Thông tin sản phẩm</h2>

      <dl>
        {category && (
          <div className='flex items-center justify-between border-b py-3'>
            <dt className='text-muted-foreground text-sm font-medium'>Danh mục</dt>
            <dd className='text-sm font-medium'>{category.name}</dd>
          </div>
        )}

        {brand && (
          <div className='flex items-center justify-between border-b py-3'>
            <dt className='text-muted-foreground text-sm font-medium'>Thương hiệu</dt>
            <dd className='text-sm font-medium'>{brand.name}</dd>
          </div>
        )}

        {specifications.map((item) => (
          <div key={item.id} className='flex items-center justify-between border-b py-3 last:border-b-0'>
            <dt className='text-muted-foreground text-sm font-medium'>{item.attributeName}</dt>
            <dd className='text-sm font-medium'>{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
