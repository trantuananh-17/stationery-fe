# Stationery Web

## Giới thiệu dự án

Dự án là ứng dụng web thương mại điện tử bán đồ văn phòng phẩm được xây dựng bằng **Next.js** và **TypeScript**. Hệ thống hỗ trợ đa ngôn ngữ, quản lý sản phẩm, giỏ hàng, đặt hàng, thanh toán và tài khoản người dùng.

Source code được tổ chức rõ ràng theo từng nhóm chức năng như `app`, `components`, `services`, `stores`, `hooks`, `types` và `i18n`, giúp quá trình phát triển, mở rộng và bảo trì thuận tiện hơn.

## Công nghệ sử dụng

* **Next.js**
* **ShadcnUI**
* **TailwindCss**
* **TypeScript**
* **pnpm**
* **i18n**

## Chức năng chính

* Hiển thị danh sách và chi tiết sản phẩm
* Quản lý giỏ hàng
* Đặt hàng và thanh toán
* Quản lý tài khoản người dùng
* Hỗ trợ đa ngôn ngữ
* Tích hợp các service gọi API theo từng nghiệp vụ

## Hướng dẫn cài đặt

Trước khi chạy frontend, cần chạy project backend trước.

Backend repository: [stationery-be](https://github.com/trantuananh-17/stationery-be)

Sau đó cài đặt frontend:

```bash
pnpm install
```

Tạo file môi trường từ file mẫu:

```bash
cp .env.example .env
```

Cập nhật các biến môi trường trong file `.env` theo cấu hình backend.

## Cách chạy project

```bash
pnpm dev
```

Sau khi chạy thành công, mở trình duyệt và truy cập địa chỉ được hiển thị trong terminal.

## Cấu trúc thư mục

```bash
.
├── app/                    # Cấu hình routing, layout và API routes của Next.js
│   ├── api/                # Các API nội bộ như auth, cookie
│   └── [locale]/           # Cấu trúc route theo ngôn ngữ
├── assets/                 # Hình ảnh và tài nguyên tĩnh dùng trong giao diện
├── components/             # Các component tái sử dụng trong hệ thống
│   ├── blocks/             # Component theo từng khối chức năng
│   ├── layouts/            # Layout chính của ứng dụng
│   └── ui/                 # UI component dùng chung
├── constants/              # Các hằng số dùng trong project
├── hooks/                  # Custom React hooks
├── i18n/                   # Cấu hình đa ngôn ngữ
├── lib/                    # Hàm tiện ích, cấu hình auth, cart, socket, fetch
├── messages/               # File ngôn ngữ cho tiếng Việt và tiếng Anh
├── providers/              # Provider quản lý state và context
├── public/                 # Tài nguyên public của Next.js
├── services/               # Các service gọi API theo từng nghiệp vụ
├── stores/                 # State management cho auth, cart, chatbot, notification
├── styles/                 # File cấu hình giao diện và theme
├── types/                  # Khai báo kiểu dữ liệu TypeScript
├── package.json            # Thông tin dependencies và scripts
├── next.config.ts          # Cấu hình Next.js
└── tsconfig.json           # Cấu hình TypeScript
```

::: 
