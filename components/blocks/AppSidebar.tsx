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
      url: '/products?category=giay',
      icon: <Files />,
      isActive: true,
      items: [
        {
          title: 'Giấy in - Bìa - Mica',
          url: '/products?category=giay-in-bia-mica'
        },
        {
          title: 'Giấy note - Phân trang',
          url: '/products?category=giay-note-phan-trang'
        },
        {
          title: 'Giấy can ảnh - Giấy dán giá',
          url: '/products?category=giay-can-anh-giay-dan-gia'
        },
        {
          title: 'Giấy fax - Film fax - Giấy than',
          url: '/products?category=giay-fax-film-fax-giay-than'
        },
        {
          title: 'Phong bì',
          url: '/products?category=phong-bi'
        }
      ]
    },
    {
      title: 'Bút',
      url: '/products?category=but',
      icon: <Pencil />,
      items: [
        {
          title: 'Bút bi - Bút bi nước (Bút gel)',
          url: '/products?category=but-bi-but-bi-nuoc'
        },
        {
          title: 'Bút dạ - Bút nhớ',
          url: '/products?category=but-da-but-nho'
        },
        {
          title: 'Bút xóa - Băng xóa',
          url: '/products?category=but-xoa-bang-xoa'
        },
        {
          title: 'Bút ký',
          url: '/products?category=but-ky'
        },
        {
          title: 'Bút trình chiếu',
          url: '/products?category=but-trinh-chieu'
        }
      ]
    },
    {
      title: 'File hồ sơ',
      url: '/products?category=file-ho-so',
      icon: <Folder />,
      items: [
        {
          title: 'File nhiều ngăn - Nhiều tầng',
          url: '/products?category=file-nhieu-ngan-nhieu-tang'
        },
        {
          title: 'Cặp lá - Clear - Chia file các loại',
          url: '/products?category=cap-la-clear-chia-file-cac-loai'
        },
        {
          title: 'Cặp hộp - Cặp 3 dây - Trình ký',
          url: '/products?category=cap-hop-cap-3-day-trinh-ky'
        },
        {
          title: 'Sơ mi lỗ',
          url: '/products?category=so-mi-lo'
        }
      ]
    },
    {
      title: 'Sổ - Vở',
      url: '/products?category=so-vo',
      icon: <BookOpen />,
      items: [
        {
          title: 'Sổ da',
          url: '/products?category=so-da'
        },
        {
          title: 'Sổ lò xo',
          url: '/products?category=so-lo-xo'
        },
        {
          title: 'Sổ kế toán - Sổ thu chi',
          url: '/products?category=so-ke-toan-so-thu-chi'
        },
        {
          title: 'Vở học sinh',
          url: '/products?category=vo-hoc-sinh'
        }
      ]
    },
    {
      title: 'Dụng cụ văn phòng',
      url: '/products?category=dung-cu-van-phong',
      icon: <Calculator />,
      items: [
        {
          title: 'Dập ghim - Đục lỗ - Ghim - Kẹp',
          url: '/products?category=dap-ghim-duc-lo-ghim-kep'
        },
        {
          title: 'Máy tính',
          url: '/products?category=may-tinh'
        },
        {
          title: 'Dao - Kéo - Hộp bút',
          url: '/products?category=dao-keo-hop-but'
        },
        {
          title: 'Băng dính - Dao cắt băng dính',
          url: '/products?category=bang-dinh-dao-cat-bang-dinh'
        },
        {
          title: 'Dấu - Mực dấu',
          url: '/products?category=dau-muc-dau'
        }
      ]
    },
    {
      title: 'Đồ dùng học sinh',
      url: '#',
      icon: <Building2 />,
      items: [
        {
          title: 'Vở học sinh',
          url: '/products?category=vo-hoc-sinh'
        },
        {
          title: 'Giấy thi - Đề thi',
          url: '#'
        },
        {
          title: 'Phấn bảng',
          url: '#'
        }
      ]
    },
    {
      title: 'Văn phòng phẩm xanh',
      url: '#',
      icon: <RefreshCcw />,
      items: [
        {
          title: 'Sổ bìa cứng',
          url: '#'
        },
        {
          title: 'Sổ bìa mềm',
          url: '#'
        },
        {
          title: 'Sổ ghi chú',
          url: '#'
        },
        {
          title: 'Sổ lập kế hoạch',
          url: '#'
        }
      ]
    },
    {
      title: 'Vật tư tiêu hao',
      url: '#',
      icon: <Package />,
      items: [
        {
          title: 'Chất tẩy rửa',
          url: '#'
        },
        {
          title: 'Giấy vệ sinh - Giấy ăn',
          url: '#'
        },
        {
          title: 'Dụng cụ vệ sinh',
          url: '#'
        },
        {
          title: 'Nước giải khát',
          url: '#'
        }
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
      <SidebarRail />
    </Sidebar>
  );
}
