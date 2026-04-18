import { cn } from '@/lib/utils';

interface Props {
  className?: string;
  description: string;
}

export default function ProductDescription({ className, description }: Props) {
  return (
    <div className={cn('px-2 md:px-6', className)}>
      <h3 className='mb-4 text-2xl font-semibold'>Mô tả sản phẩm</h3>

      <div className='ProseMirror' dangerouslySetInnerHTML={{ __html: description }} />
    </div>
  );
}
