interface Props {
  info?: Array<{
    label: string;
    value: string;
  }>;
}

export default function ProductInfo({ info }: Props) {
  if (!info) return;

  return (
    <div>
      <h2 className='mb-4 text-lg font-semibold'>Product Details</h2>
      <dl>
        {info.map((item, index) => (
          <div
            key={`product-detail-1-info-${index}`}
            className='flex items-center justify-between border-b py-3 last:border-b-0'
          >
            <dt className='text-muted-foreground text-sm font-medium'>{item.label}</dt>
            <dd className='text-sm font-medium'>{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
