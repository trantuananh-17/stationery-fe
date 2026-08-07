'use client';

import {
  AudioWaveform,
  Bell,
  Boxes,
  ChartColumn,
  Command,
  Frame,
  GalleryVerticalEnd,
  LayoutDashboard,
  Map,
  Package2,
  PieChart,
  ShieldUser,
  ShoppingBag,
  Star,
  Users2
} from 'lucide-react';
import * as React from 'react';

import { NavAdmin } from '@/components/blocks/admin/NavAdmin';
import NavHeader from '@/components/blocks/NavHeader';
import { NavUser } from '@/components/blocks/NavUser';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';
import { useNotificationStore } from '@/stores/notification.store';
import { useAuthStore } from '@/stores/auth-store';

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg'
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise'
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup'
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free'
    }
  ],
  navAdmin: [
    {
      label: 'Tổng quan',
      items: [
        {
          title: 'Bảng điều khiển',
          url: '/admin/dashboard',
          icon: <LayoutDashboard />,
          isActive: true
        },
        {
          title: 'Phân tích',
          url: '/admin/analytics',
          icon: <ChartColumn />,
          disabled: true,
          badge: 'Soon'
        }
      ]
    },
    {
      label: 'Thương mại',
      items: [
        {
          title: 'Đơn hàng',
          url: '/admin/orders',
          icon: <ShoppingBag />
        },
        {
          title: 'Sản phẩm',
          url: '/admin/products',
          icon: <Package2 />
        },
        {
          title: 'Khách hàng',
          url: '/admin/customers',
          icon: <Users2 />
        },
        {
          title: 'Kho hàng',
          url: '/admin/inventories',
          icon: <Boxes />,
          disabled: true,
          badge: 'Soon'
        }
      ]
    },
    {
      label: 'Hệ thống',
      items: [
        {
          title: 'Thông báo',
          url: '/admin/notifications',
          icon: <Bell />
        },
        {
          title: 'Đánh giá',
          url: '/admin/reviews',
          icon: <Star />,
          disabled: true,
          badge: 'Soon'
        }
      ]
    }
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: <PieChart />
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map
    }
  ]
};

interface AdminSidebarProps extends React.ComponentProps<typeof Sidebar> {}

export function AdminSidebar({ ...props }: AdminSidebarProps) {
  const user = useAuthStore((state) => state.user);
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  const navAdmin = React.useMemo(
    () =>
      data.navAdmin.map((section) => ({
        ...section,
        items: section.items.map((item) => {
          if (item.url !== '/admin/notifications') {
            return item;
          }

          return {
            ...item,
            badge: unreadCount > 0 ? unreadCount : undefined
          };
        })
      })),
    [unreadCount]
  );

  return (
    <Sidebar className='' collapsible='icon' {...props}>
      <SidebarHeader className='h-16 border-b'>
        <NavHeader />
      </SidebarHeader>

      <SidebarContent className=''>
        <NavAdmin sections={navAdmin} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={{
            name: user ? `${user.firstName} ${user.lastName}`.trim() : 'Admin',
            email: user?.email ?? '',
            avatar: '/avatars/default.jpg'
          }}
        />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
