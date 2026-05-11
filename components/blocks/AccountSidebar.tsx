'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, Package, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    href: '/account',
    label: 'Hồ sơ của tôi',
    icon: User
  },
  {
    href: '/account/orders',
    label: 'Đơn mua',
    icon: Package
  },
  {
    href: '/account/address',
    label: 'Địa chỉ',
    icon: MapPin
  }
  // {
  //   href: '/account/settings',
  //   label: 'Cài đặt',
  //   icon: Settings
  // }
];

export function AccountSidebar() {
  const pathname = usePathname();

  return (
    <aside className='bg-background min-h-[75svh]'>
      <div className='flex h-full flex-col p-4'>
        <div className='mb-6 px-2'>
          <h2 className='text-lg font-semibold'>Tài khoản của tôi</h2>

          <p className='text-muted-foreground text-sm'>Manage your profile and orders</p>
        </div>

        <nav className='flex flex-col gap-1'>
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className='h-4 w-4' />

                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
