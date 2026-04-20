import BANNER from '@/assets/images/banner.webp';
import BLOG_COST from '@/assets/images/banner_cost--card.webp';
import BLOG_DELI from '@/assets/images/banner_deli--card.webp';
import BannerCard from '@/components/blocks/BannerCard';
import FeatureItem from '@/components/ui/feature-item';
import { BadgePercent, Headset, ShieldCheck, Truck } from 'lucide-react';
import Image from 'next/image';

export default function Banner() {
  const bannerCards = [
    {
      image: BLOG_COST,
      label: 'Minaco Blog',
      description: 'Làm sao để có được báo giá văn phòng phẩm tốt nhất?!',
      primary: true,
      buttonLabel: 'Xem ngay',
      link: { href: '#', target: '_self' as const }
    },
    {
      image: BLOG_DELI,
      label: 'Văn phòng phẩm Deli',
      description: 'Top Trending văn phòng phẩm',
      primary: false,
      buttonLabel: 'Xem sản phẩm',
      link: { href: '#', target: '_self' as const }
    }
  ];

  const features = [
    {
      icon: BadgePercent,
      title: 'Tiết kiệm tới 20%',
      description: 'Tối ưu chi phí VPP định kỳ so với giá thị trường'
    },
    {
      icon: Headset,
      title: 'Dịch vụ chuyên nghiệp',
      description: '15 năm kinh nghiệm - Linh hoạt đổi trả & thanh toán'
    },
    {
      icon: Truck,
      title: 'Miễn phí vận chuyển',
      description: 'Đơn hàng từ 499K* nội thành Hà Nội & HCM'
    },
    {
      icon: ShieldCheck,
      title: 'Cam kết chất lượng',
      description: 'Theo đúng nhu cầu và yêu cầu của khách hàng'
    }
  ];
  return (
    <section className='flex flex-col gap-4 py-4 md:py-8'>
      <h2 className='sr-only'>Banner blog</h2>

      <div className='grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3'>
        <div className='col-span-2 max-w-225'>
          <Image src={BANNER} alt='Banner cart img' className='h-auto rounded-xl object-cover' priority />
        </div>
        <div className='hidden grid-cols-2 gap-4 md:grid-cols-1 md:grid-rows-2 lg:grid'>
          {bannerCards.map((card, index) => (
            <BannerCard {...card} key={index} />
          ))}
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {features.map((feature, index) => (
          <FeatureItem key={index} {...feature} />
        ))}
      </div>
    </section>
  );
}
