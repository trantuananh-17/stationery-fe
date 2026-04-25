'use client';

import * as React from 'react';

import { NavMain } from '@/components/blocks/NavMain';
import { NavUser } from '@/components/blocks/NavUser';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger
} from '@/components/ui/sidebar';
import {
  BookOpen,
  Building2,
  Calculator,
  Files,
  Folder,
  FrameIcon,
  MapIcon,
  Package,
  Pencil,
  PieChartIcon,
  RefreshCcw
} from 'lucide-react';

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg'
  },

  navMain: [
    {
      title: 'Giấy - Sản phẩm từ giấy',
      url: '#',
      icon: <Files />,
      isActive: true,
      items: [
        {
          title: 'Giấy in - Bìa - Mica',
          url: '#'
        },
        {
          title: 'Giấy note - Phân trang',
          url: '#'
        },
        {
          title: 'Giấy can anh - Giấy dán giá',
          url: '#'
        },
        {
          title: 'Giấy fax - Giấy than',
          url: '#'
        },
        {
          title: 'Phong bì',
          url: '#'
        }
      ]
    },
    {
      title: 'Bút',
      url: '#',
      icon: <Pencil />,
      items: [
        { title: 'Bút bi - Bút gel', url: '#' },
        { title: 'Bút dạ - Bút nhớ', url: '#' },
        { title: 'Bút xóa - Băng xóa', url: '#' },
        { title: 'Bút ký', url: '#' },
        { title: 'Bút trình chiếu', url: '#' }
      ]
    },
    {
      title: 'File hồ sơ',
      url: '#',
      icon: <Folder />,
      items: [
        { title: 'File nhiều ngăn - Nhiều tầng', url: '#' },
        { title: 'Cặp lá - Clear - Chia file', url: '#' },
        { title: 'Cặp hộp - Cặp 3 dây', url: '#' },
        { title: 'Sơ mi lỗ', url: '#' }
      ]
    },
    {
      title: 'Sổ - Vở',
      url: '#',
      icon: <BookOpen />,
      items: [
        { title: 'Sổ da', url: '#' },
        { title: 'Sổ lò xo', url: '#' },
        { title: 'Sổ kế toán - Sổ thu chi', url: '#' },
        { title: 'Vở học sinh', url: '#' }
      ]
    },
    {
      title: 'Dụng cụ văn phòng',
      url: '#',
      icon: <Calculator />,
      items: [
        { title: 'Dập ghim - Đục lỗ - Ghim - Kẹp', url: '#' },
        { title: 'Máy tính', url: '#' },
        { title: 'Dao - Kéo - Hộp bút', url: '#' },
        { title: 'Băng dính', url: '#' },
        { title: 'Dấu - Mực dấu', url: '#' }
      ]
    },
    {
      title: 'Đồ dùng học sinh',
      url: '#',
      icon: <Building2 />,
      items: [
        { title: 'Vở học sinh', url: '#' },
        { title: 'Giấy thi - Đề thi', url: '#' },
        { title: 'Phấn bảng', url: '#' }
      ]
    },
    {
      title: 'Văn phòng phẩm xanh',
      url: '#',
      icon: <RefreshCcw />,
      items: [
        { title: 'Sổ bìa cứng', url: '#' },
        { title: 'Sổ bìa mềm', url: '#' },
        { title: 'Sổ ghi chú', url: '#' },
        { title: 'Sổ lập kế hoạch', url: '#' }
      ]
    },
    {
      title: 'Vật tư tiêu hao',
      url: '#',
      icon: <Package />,
      items: [
        { title: 'Chất tẩy rửa', url: '#' },
        { title: 'Giấy vệ sinh - Giấy ăn', url: '#' },
        { title: 'Dụng cụ vệ sinh', url: '#' },
        { title: 'Nước giải khát', url: '#' }
      ]
    }
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: <FrameIcon />
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: <PieChartIcon />
    },
    {
      name: 'Travel',
      url: '#',
      icon: <MapIcon />
    }
  ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar overlay collapsible='icon' {...props}>
      <SidebarHeader>
        <SidebarTrigger withLabel />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
