# Skill: /create-page

Tạo một page mới trong App Router của Next.js.

## Khi nào dùng

Khi cần thêm route/page mới vào một trong các section hiện có của project.

## Quy trình

1. Xác định section phù hợp:

| Section | Vị trí | Mô tả |
|---|---|---|
| Marketing / công khai | `app/[locale]/(marketing)/` | Landing, về dịch vụ |
| Auth | `app/[locale]/(marketing)/auth/` | Sign-in, sign-up |
| Shop công khai | `app/[locale]/(shop)/` | Products, product detail |
| Shop cần đăng nhập | `app/[locale]/(shop)/(protected)/` | Cart, checkout, payment, account |
| Admin | `app/[locale]/(admin)/admin/` | Dashboard, quản lý sản phẩm, đơn hàng |

2. Tạo folder route và file `page.tsx`.
3. Nếu route cần bảo vệ (auth), đặt trong `(protected)/`.
4. Nếu route admin, đặt trong `(admin)/admin/`.
5. Thêm metadata nếu cần (dùng `generateMetadata` với `getTranslations`).

## Template mẫu (Server page)

```tsx
import { getTranslations } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: '<Namespace>' });
  return { title: t('title') };
}

export default async function <PageName>Page() {
  return (
    <main>
      {/* page content */}
    </main>
  );
}
```

## Quy tắc bắt buộc

- Chỉ tạo page trong route group phù hợp.
- Không tự thêm route vào `isProtectedRoute()` trong `proxy.ts` trừ khi được yêu cầu.
- Nếu page cần data từ API → fetch trực tiếp trong `page.tsx` (server component) hoặc dùng TanStack Query nếu cần client-side fetch.
- Không tạo loading.tsx, error.tsx trừ khi được yêu cầu rõ.
