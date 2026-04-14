import Image from 'next/image';
import BANNER from '@/assets/images/banner.webp';
import BannerCard from '@/components/ui/banner-card';
import BLOG_COST from '@/assets/images/banner_cost--card.webp';
import BLOG_DELI from '@/assets/images/banner_deli--card.webp';
import { BadgePercent, Headset, ShieldCheck, Truck } from 'lucide-react';
import FeatureItem from '../ui/feature-item';

export default function Banner() {
  const bannerCards = [
    {
      image: (
        <Image
          src={BLOG_COST}
          alt='Blog cart cost'
          fill
          className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-110'
        />
      ),
      label: 'Minaco Blog',
      description: 'Làm sao để có được báo giá văn phòng phẩm tốt nhất?!',
      primary: true,
      buttonLabel: 'Xem ngay',
      link: { href: '#', target: '_self' as const }
    },
    {
      image: (
        <Image
          src={BLOG_DELI}
          alt='Banner deli min'
          fill
          className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-110'
        />
      ),
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
      description: 'Tối ưu chi phí VPP định kỳ tới 20% so với giá thị trường'
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
    <section className='flex flex-col gap-4 py-10'>
      <h2 className='sr-only'>Banner blog</h2>

      <div className='grid grid-cols-3 items-stretch gap-4'>
        <div className='col-span-2 max-w-225'>
          <Image src={BANNER} alt='Banner cart img' className='h-auto rounded-xl object-cover' priority />
        </div>
        <div className='col-span-1 grid h-full grid-rows-2 gap-4'>
          {bannerCards.map((card, index) => (
            <BannerCard {...card} key={index} />
          ))}
        </div>
      </div>

      <div className='grid grid-cols-4 gap-4'>
        {features.map((feature, index) => (
          <FeatureItem key={index} {...feature} />
        ))}
      </div>
    </section>
  );
}
