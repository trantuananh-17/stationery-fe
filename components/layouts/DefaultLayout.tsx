import React from 'react';
import LOGO from '@/assets/images/logo.webp';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import Header from '../blocks/Header';
import { TooltipProvider } from '../ui/tooltip';
import { SidebarInset, SidebarProvider } from '../ui/sidebar';
import { AppSidebar } from '../blocks/AppSidebar';
import { Container } from '../ui/container';
import Footer from '../blocks/Footer';
import Provider from './Provider';
import ShopProvider from '@/providers/ShopProvider';
import FloatingChatbotAssistant from '../blocks/chats/FloatingChatbotAssistant';
import AuthBootstrap from './AuthBootstrap';

interface Props {
  children: React.ReactNode;
}

export default async function Layout(props: Props) {
  const tNav = await getTranslations('Nav');
  const tAuth = await getTranslations('Auth');
  const tFooter = await getTranslations('Footer');

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
      link: { href: '/auth/sign-up', target: '_self' as const },
      label: tAuth('signUp'),
      variant: 'default' as const
    },
    secondaryButton: {
      icon: null,
      link: { href: '/auth/sign-in', target: '_self' as const },
      label: tAuth('signIn'),
      variant: 'ghost' as const
    },
    navItems: [
      { link: { href: '/', target: '_self' as const }, label: tNav('home') },
      { link: { href: '/products', target: '_self' as const }, label: tNav('products') },
      { link: { href: '/about', target: '_self' as const }, label: tNav('about') },
      { link: { href: '/contact', target: '_self' as const }, label: tNav('contact') }
    ]
  };

  const footerProps = {
    logo: <Image src={LOGO} alt='Logo' className='h-auto w-45 rounded-xl object-contain' priority />,
    copyright: tFooter('copyright'),
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
        title: tFooter('sections.info.title'),
        links: [
          { link: { href: '/about', target: '_self' as const }, label: tFooter('sections.info.about') },
          { link: { href: '/services', target: '_self' as const }, label: tFooter('sections.info.blog') },
          { link: { href: '/#', target: '_self' as const }, label: tFooter('sections.info.careers') },
          { link: { href: '/contact', target: '_self' as const }, label: tFooter('sections.info.enterprise') },
          { link: { href: '/contact', target: '_self' as const }, label: tFooter('sections.info.contact') }
        ]
      },
      {
        title: tFooter('sections.policy.title'),
        links: [
          { link: { href: '/services', target: '_self' as const }, label: tFooter('sections.policy.privacy') },
          { link: { href: '/services', target: '_self' as const }, label: tFooter('sections.policy.terms') },
          { link: { href: '/services', target: '_self' as const }, label: tFooter('sections.policy.returns') },
          { link: { href: '/services', target: '_self' as const }, label: tFooter('sections.policy.shipping') },
          { link: { href: '/services', target: '_self' as const }, label: tFooter('sections.policy.payment') }
        ]
      }
    ]
  };

  return (
    <Provider>
      <AuthBootstrap />
      <ShopProvider>
        <TooltipProvider>
          <SidebarProvider>
            <AppSidebar />

            <FloatingChatbotAssistant />

            <SidebarInset>
              <Container size='xl' className='md:px-10 lg:px-20'>
                <Header {...headerProps} />

                <main className='flex-1'>{props.children}</main>

                <Footer {...footerProps} />
              </Container>
            </SidebarInset>
          </SidebarProvider>
        </TooltipProvider>
      </ShopProvider>
    </Provider>
  );
}
