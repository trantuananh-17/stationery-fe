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
  Receipt,
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
          icon: <ChartColumn />
        }
      ]
    },
    {
      label: 'Thương mại',
      items: [
        {
          title: 'Đơn hàng',
          url: '/admin/orders',
          icon: <ShoppingBag />,
          badge: 12
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
          url: '/admin/inventory',
          icon: <Boxes />
        },
        {
          title: 'Hóa đơn',
          url: '/admin/invoices',
          icon: <Receipt />
        }
      ]
    },
    {
      label: 'Hệ thống',
      items: [
        {
          title: 'Người dùng',
          url: '/admin/users',
          icon: <ShieldUser />
        },
        {
          title: 'Thông báo',
          url: '/admin/notifications',
          icon: <Bell />
        },
        {
          title: 'Đánh giá',
          url: '/admin/reviews',
          icon: <Star />
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

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader className='h-16 border-b'>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent className=''>
        <NavAdmin sections={data.navAdmin} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
