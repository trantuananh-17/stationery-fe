# Project Rules — stationery-fe

Những quy định này luôn áp dụng trong mọi tác vụ. Không tự phát sinh chức năng ngoài phạm vi yêu cầu.

---

## 1. Phạm vi làm việc

- Chỉ thực hiện đúng những gì người dùng yêu cầu. Không tự thêm feature, component, store, service, type, hoặc logic mới ngoài phạm vi được đặt ra.
- Không tự refactor code không liên quan đến task hiện tại.
- Không tự tạo file test, file doc, file config trừ khi được yêu cầu rõ ràng.

---

## 2. Tech stack — không thay thế, không thêm thư viện mới

Project sử dụng stack cố định sau. Không được tự ý thêm thư viện ngoài danh sách này:

| Mục đích | Thư viện |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | Shadcn UI + Radix UI + Tailwind CSS v4 |
| State | Zustand v5 |
| Data fetching | TanStack Query v5 |
| Form | react-hook-form + zod |
| HTTP client | `lib/fetch-wrapper.ts` (FetchWrapper class) |
| Auth | Cookie-based (httpOnly), JWT access + refresh token |
| i18n | next-intl (vi/en, localePrefix: always) |
| Rich text | Tiptap |
| Table | TanStack Table v8 |
| Chart | Recharts |
| Toast | sonner |
| Payment | Stripe |
| Realtime | socket.io-client |
| Icons | lucide-react |

---

## 3. Cấu trúc thư mục — tuân thủ đúng vị trí

```
app/[locale]/
  (marketing)/     — trang công khai (landing, auth)
  (shop)/          — shop user (products, cart, checkout, payment, account)
  (shop)/(protected)/ — route cần đăng nhập
  (admin)/admin/   — trang quản trị

components/
  blocks/          — component nghiệp vụ (feature-specific)
  blocks/admin/    — component dành cho admin
  blocks/auth/     — component auth
  layouts/         — layout component
  ui/              — Shadcn UI primitives (không sửa trực tiếp)

services/          — hàm gọi API (dùng FetchWrapper)
stores/            — Zustand stores
hooks/             — custom React hooks
types/             — TypeScript types/interfaces
lib/               — utilities (fetch-wrapper, auth, socket, utils)
providers/         — React context providers
i18n/              — cấu hình next-intl
messages/          — translation files (vi.json, en.json)
```

---

## 4. Quy ước đặt tên

- Component file: `PascalCase.tsx` (ví dụ: `ProductCard.tsx`)
- Service file: `<domain>.service.ts` (ví dụ: `product.service.ts`)
- Store file: `<domain>-store.ts` hoặc `<domain>.store.ts`
- Hook file: `use-<name>.ts` (ví dụ: `use-fetch.ts`)
- Type file: `<domain>.type.ts`
- Route page: `page.tsx`, layout: `layout.tsx` (Next.js convention)

---

## 5. Gọi API — chỉ dùng FetchWrapper

- Tất cả API call phải thông qua `FetchWrapper` từ `lib/fetch-wrapper.ts`.
- Service file khởi tạo `new FetchWrapper(process.env.NEXT_PUBLIC_SERVER_API)`.
- Client component cần auth dùng hook `useFetch` từ `hooks/use-fetch.ts`.
- Response type luôn bọc bằng `ApiResponse<T>` từ `types/type.ts`.
- Không dùng `axios`, `ky`, hoặc `fetch` trực tiếp trong service/component.

---

## 6. Auth — không tự thay đổi flow

- Access token lưu cookie `token` (httpOnly, maxAge 15 phút).
- Refresh token lưu cookie `refresh_token` (httpOnly, maxAge 7 ngày).
- Middleware auth nằm trong `proxy.ts` — không tạo middleware.ts riêng.
- Client-side auth state qua `useAuthStore` (Zustand).
- Không tự thêm route bảo vệ ngoài những route đã có trong `isProtectedRoute()`.

---

## 7. State management — Zustand

- Mỗi domain có store riêng trong `stores/`.
- Các store hiện có: `auth-store`, `cart-store`, `notification.store`, `chat-bot.store`.
- Không dùng React Context để quản lý global state — dùng Zustand.
- Không dùng Redux.

---

## 8. i18n — bắt buộc với text hiển thị

- Mọi chuỗi text hiển thị ra UI phải dùng `useTranslations()` (client) hoặc `getTranslations()` (server).
- Không hardcode tiếng Anh hay tiếng Việt trực tiếp trong component.
- Thêm key mới vào cả `messages/vi.json` và `messages/en.json`.

---

## 9. TypeScript

- Không dùng `any`. Dùng `unknown` nếu type thực sự không xác định được.
- Luôn định nghĩa kiểu trả về cho service function.
- Type dùng chung đặt trong `types/`. Type chỉ dùng trong 1 file thì đặt tại chỗ.

---

## 10. Không tự sinh

- Không tự tạo thêm trang (page.tsx) ngoài những trang đã tồn tại trừ khi được yêu cầu.
- Không tự thêm field vào Zustand store ngoài yêu cầu.
- Không tự thêm API endpoint trong service ngoài yêu cầu.
- Không tự thêm translation key ngoài những key cần cho task.
