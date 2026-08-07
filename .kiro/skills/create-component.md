# Skill: /create-component

Tạo một component mới theo convention của project.

## Khi nào dùng

Khi cần tạo component mới (block, layout, hoặc page component).

## Quy trình

1. Xác định loại component:
   - **UI primitive** → `components/ui/` (Shadcn — không tự tạo mới thường xuyên)
   - **Business logic/block** → `components/blocks/`
   - **Admin block** → `components/blocks/admin/`
   - **Auth block** → `components/blocks/auth/`
   - **Layout** → `components/layouts/`
   - **Page component** → đặt trực tiếp trong route folder

2. Kiểm tra component tương tự đã có chưa để tái sử dụng.

3. Nếu component hiển thị text → dùng `useTranslations()` (client) hoặc `getTranslations()` (server) cho i18n.

4. Đặt tên file theo `PascalCase.tsx`.

5. Component sử dụng:
   - Shadcn UI components từ `@/components/ui/*`
   - Tailwind CSS utility classes (v4)
   - lucide-react icons nếu cần icon

## Template mẫu (Client component)

```tsx
'use client';

import { useTranslations } from 'next-intl';
// import các UI primitives cần thiết

export function <ComponentName>() {
  const t = useTranslations('<Namespace>');

  return (
    <div>
      <h2>{t('heading')}</h2>
      {/* UI */}
    </div>
  );
}
```

## Template mẫu (Server component)

```tsx
import { getTranslations } from 'next-intl/server';

export async function <ComponentName>() {
  const t = await getTranslations('<Namespace>');

  return (
    <div>
      <h2>{t('heading')}</h2>
    </div>
  );
}
```

## Quy tắc bắt buộc

- Không hardcode chuỗi text hiển thị — dùng i18n.
- Nếu component cần data từ API → fetch trong page hoặc dùng TanStack Query trong component.
- Không tự thêm store mới chỉ để lưu local UI state — dùng `useState` cho UI local state.
- Component phải tuân thủ Tailwind CSS v4, không viết CSS inline hay CSS module.
