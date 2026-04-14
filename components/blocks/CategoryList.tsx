import GEL_PENS from '@/assets/images/but-bi-thien-long-tl-img.jpg';
import HIGHLIGHTERS_AND_MARKERS from '@/assets/images/but-nho-tl-img.jpg';
import SIGNATURE_PENS from '@/assets/images/but-ky-img.jpg';
import MULTI_LAYER_FILE_FOLDERS from '@/assets/images/file-nan-img.jpg';
import PRINTING_PAPER from '@/assets/images/giay-in-img.webp';
import STICKY_NOTES_AND_TABS from '@/assets/images/phan-trang-img.jpg';
import CALCULATORS from '@/assets/images/may-tinh-img.jpg';
import LEATHER_NOTEBOOKS from '@/assets/images/diary-img.jpg';
import SPIRAL_NOTEBOOKS from '@/assets/images/book-img.jpg';
import CategoryItem from './CategoryItem';

export default function CategoryList() {
  const categories = [
    {
      image: GEL_PENS,
      label: 'Bút bi - Bút bi nước',
      link: { href: '#', target: '_self' as const }
    },
    {
      image: HIGHLIGHTERS_AND_MARKERS,
      label: 'Bút dạ - Bút nhớ',
      link: { href: '#', target: '_self' as const }
    },
    {
      image: SIGNATURE_PENS,
      label: 'Bút ký',
      link: { href: '#', target: '_self' as const }
    },
    {
      image: MULTI_LAYER_FILE_FOLDERS,
      label: 'File nhiều ngăn',
      link: { href: '#', target: '_self' as const }
    },
    {
      image: PRINTING_PAPER,
      label: 'Giấy in',
      link: { href: '#', target: '_self' as const }
    },
    {
      image: STICKY_NOTES_AND_TABS,
      label: 'Giấy note - Phân trang',
      link: { href: '#', target: '_self' as const }
    },
    {
      image: CALCULATORS,
      label: 'Máy tính',
      link: { href: '#', target: '_self' as const }
    },
    {
      image: SPIRAL_NOTEBOOKS,
      label: 'Sổ loxo',
      link: { href: '#', target: '_self' as const }
    }
  ];

  return (
    <section className='py-4 md:py-8'>
      <h2 className='mb-4 text-2xl font-semibold'>Danh mục nổi bật</h2>

      <div className='grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8'>
        {categories.map((category, index) => (
          <CategoryItem key={index} {...category} />
        ))}
      </div>
    </section>
  );
}
