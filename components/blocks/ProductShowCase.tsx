import Image from 'next/image';
import PAPER from '@/assets/images/paper-img.jpg';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import Link from 'next/link';
import { LinkType } from '@/types/type';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import ProductCard from './ProductCard';
import { AspectRatio } from '../ui/aspect-ratio';

interface Props {
  link?: LinkType;
}

export default function ProductShowCase({ link }: Props) {
  return (
    <section className='py-4 md:py-8'>
      <h2 className='sr-only'>Product Show case</h2>

      <div className='grid grid-cols-1 gap-2 lg:grid-cols-12'>
        <div className='col-span-1 h-full min-h-30 lg:col-span-3'>
          {/* <Link href={link.href || '#'} target={link.target || '_self'}> */}
          <Card size='default' className='group relative h-full cursor-pointer overflow-hidden p-0'>
            <Image
              src={PAPER}
              fill
              className='h-auto rounded-xl object-cover transition-transform duration-500 group-hover:scale-110'
              priority
              alt='Paper banner'
            />
            <div className='absolute inset-0 rounded-xl bg-black/20 transition-colors duration-500 group-hover:scale-110 group-hover:bg-black/40' />

            <div className='absolute inset-0 flex flex-col items-center justify-center gap-2 p-6'>
              <p className='text-white/75'>Trắng tự nhiên - mềm mịn</p>

              <p className='text-xl font-semibold text-white'>Giá tốt - chính hãng</p>

              <Button variant={'default'} className='cursor-pointer'>
                Xem Tất Cả
              </Button>
            </div>
          </Card>
          {/* </Link> */}
        </div>

        <div className='col-span-1 flex flex-col gap-4 lg:col-span-9'>
          <Tabs defaultValue='overview' className='h-full w-full'>
            <div className='overflow-x-auto overflow-y-hidden'>
              <TabsList className='inline-flex w-max min-w-max justify-start'>
                <span className='truncate px-4 text-sm font-bold text-black md:text-xl'>Bút Các Loại</span>
                <TabsTrigger value='overview'>Overview</TabsTrigger>
                <TabsTrigger value='analytics'>Analytics</TabsTrigger>
                <TabsTrigger value='settings'>Settings</TabsTrigger>
                <TabsTrigger value='settings'>Settings</TabsTrigger>
                <TabsTrigger value='settings'>Settings</TabsTrigger>
                <TabsTrigger value='reports'>Reports</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value='overview'>
              <div className='grid h-full grid-cols-2 gap-2 md:grid-cols-4'>
                <ProductCard />
                <ProductCard />
                <ProductCard />
                <ProductCard />
              </div>
            </TabsContent>
            <TabsContent value='analytics'>
              <Card>
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                  <CardDescription>
                    Track performance and user engagement metrics. Monitor trends and identify growth opportunities.
                  </CardDescription>
                </CardHeader>
                <CardContent className='text-muted-foreground text-sm'>
                  Page views are up 25% compared to last month.
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value='reports'>
              <Card>
                <CardHeader>
                  <CardTitle>Reports</CardTitle>
                  <CardDescription>
                    Generate and download your detailed reports. Export data in multiple formats for analysis.
                  </CardDescription>
                </CardHeader>
                <CardContent className='text-muted-foreground text-sm'>
                  You have 5 reports ready and available to export.
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value='settings'>
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences and options. Customize your experience to fit your needs.
                  </CardDescription>
                </CardHeader>
                <CardContent className='text-muted-foreground text-sm'>
                  Configure notifications, security, and themes.
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
