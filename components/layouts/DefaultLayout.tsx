import React from 'react';
import LOGO from '@/assets/images/logo.webp';
import Image from 'next/image';
import Header from '../blocks/Header';
import { TooltipProvider } from '../ui/tooltip';
import { SidebarInset, SidebarProvider } from '../ui/sidebar';
import { AppSidebar } from '../ui/app-sidebar';
import { Container } from '../ui/container';
import Footer from '../blocks/Footer';

interface Props {
  children: React.ReactNode;
}

export default function Layout(props: Props) {
  const headerProps = {
    logo: (
      <Image
        src={LOGO}
        alt='Logo'
        width={300}
        height={300}
        className='h-auto w-45 rounded-xl object-contain'
        priority
      />
    ),
    primaryButton: {
      icon: null,
      link: { href: '/register', target: '_self' as const },
      label: 'Đăng ký',
      variant: 'default' as const
    },
    secondaryButton: {
      icon: null,
      link: { href: '/login', target: '_self' as const },
      label: 'Đăng nhập',
      variant: 'ghost' as const
    },
    navItems: [
      { link: { href: '/', target: '_self' as const }, label: 'Trang chủ' },
      { link: { href: '/products', target: '_self' as const }, label: 'Sản phẩm' },
      { link: { href: '/about', target: '_self' as const }, label: 'Về chúng tôi' },
      { link: { href: '/contact', target: '_self' as const }, label: 'Liên hệ' }
    ]
  };

  const footerProps = {
    logo: <Image src={LOGO} alt='Logo' className='h-auto w-45 rounded-xl object-contain' priority />,
    copyright: '© 2026. Bản quyền thuộc về Tuấn Anh - Văn phòng phẩm Minaco.',

    description:
      'Helping businesses grow with innovative solutions and dedicated support. Your success is our mission.',
    address: [
      {
        label: 'Trụ sở chính Hà Nội:',
        desc: '15A Hạ Đình – Thanh Xuân – Hà Nội',
        hotline: '0961 53 16 16',
        cskh: '024 6285 0755',
        email: 'info@minaco.vn'
      }
    ],
    navSections: [
      {
        links: [
          { link: { href: '/about', target: '_self' as const }, label: 'Giới thiệu về Minaco' },
          { link: { href: '/services', target: '_self' as const }, label: 'Minaco Blog' },
          { link: { href: '/#', target: '_self' as const }, label: 'Tuyển dụng' },
          { link: { href: '/contact', target: '_self' as const }, label: 'Tư vấn gói doanh nghiệp' },
          { link: { href: '/contact', target: '_self' as const }, label: 'Liên hệ' }
        ],
        title: 'Thông tin'
      },
      {
        links: [
          { link: { href: '/services', target: '_self' as const }, label: 'Chính sách bảo mật' },
          { link: { href: '/services', target: '_self' as const }, label: 'Quy định sử dụng' },
          { link: { href: '/services', target: '_self' as const }, label: 'Chính sách đổi trả' },
          { link: { href: '/services', target: '_self' as const }, label: 'Chính sách giao - nhận' },
          { link: { href: '/services', target: '_self' as const }, label: 'Chính sách thanh toán' }
        ],
        title: 'Chính sách và điều khoản'
      }
    ]
  };

  return (
    <>
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <Container size='xl'>
              <Header {...headerProps} />

              <main className='flex-1'>{props.children}</main>

              <Footer {...footerProps} />
            </Container>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </>
  );
}
