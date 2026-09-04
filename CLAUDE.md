# stationery-fe

Next.js 16 (App Router) · React 19 · TypeScript 5 · Tailwind v4 · shadcn/ui · pnpm

Web client gồm 3 khu: marketing, shop, admin. Chỉ nói chuyện với **BFF** ở `NEXT_PUBLIC_SERVER_API`.

> Backend: `../stationery-be`. Chỉ mở nó khi đổi hợp đồng API — xem `../.claude/rules/api-contract.md`.
> Repo này còn có `.kiro/` (rules + skills cho Kiro IDE). Nội dung tương đương; nếu lệch nhau thì `CLAUDE.md` này là bản mới hơn.

---

## Lệnh

```powershell
pnpm dev        # http://localhost:3000
pnpm build
pnpm lint       # eslint
pnpm lint:fix
```

`.env` mặc định trỏ **production** (`https://api.anhtt-stationery.store/api/v1`). Muốn chạy với BE local: đổi `NEXT_PUBLIC_SERVER_API=http://localhost:3400/api/v1`.

---

## Cấu trúc thư mục — đặt file đúng chỗ

```
app/
  [locale]/
    (marketing)/          # landing + auth (sign-in, sign-up, log-out)
    (shop)/               # products, cart
    (shop)/(protected)/   # account, checkouts, payment — cần đăng nhập
    (admin)/admin/        # dashboard, products, orders, customers, inventories, notifications
  api/
    auth/session/         # route handler
    cookie/               # set/xoá cookie httpOnly
  layout.tsx  not-found.tsx  globals.css

components/
  ui/                 # shadcn primitives — KHÔNG sửa trực tiếp
  blocks/             # component nghiệp vụ
  blocks/admin/       # component riêng admin
  blocks/auth/  blocks/chats/
  layouts/            # AdminLayout, DefaultLayout, Provider, AuthBootstrap...

services/    # gọi API, dùng FetchWrapper — <domain>.service.ts
stores/      # Zustand — auth-store, cart-store, notification.store, chat-bot.store
hooks/       # use-cart, use-fetch, use-debounce, use-mobile
types/       # <domain>.type.ts + type.ts (ApiResponse)
lib/         # fetch-wrapper, auth, socket, cart-session, utils, chatbot-suggestions
providers/   # QueryProvider, ShopProvider, AdminProvider
i18n/        # routing.ts, request.ts
messages/    # vi.json, en.json
constants/   # brand, category, specification, attribute_variant, common.constant
proxy.ts     # ⚠️ Next 16 gọi là proxy.ts, KHÔNG phải middleware.ts
```

---

## Stack cố định — không thêm thư viện mới

| Mục đích | Thư viện |
|---|---|
| State | Zustand v5 (**không** Redux, **không** Context cho global state) |
| Data fetching | TanStack Query v5 |
| Form | react-hook-form + zod v4 |
| HTTP | `lib/fetch-wrapper.ts` — **không** axios, **không** `fetch` trần trong service/component |
| UI | shadcn/ui + Radix + Tailwind v4 |
| i18n | next-intl (vi/en, `localePrefix: 'always'`) |
| Table | TanStack Table v8 · Chart: Recharts · Editor: Tiptap |
| Toast | sonner · Icons: lucide-react |
| Payment | Stripe (`@stripe/react-stripe-js`) · Realtime: socket.io-client |

---

## Gọi API

Mọi request đi qua `FetchWrapper`. Kiểu response luôn bọc `ApiResponse<T>`.

```ts
// services/<domain>.service.ts
import { FetchWrapper } from '@/lib/fetch-wrapper';
import { ApiResponse } from '@/types/type';

const fetchWrapper = new FetchWrapper(process.env.NEXT_PUBLIC_SERVER_API as string);

export async function getProductBySlug(slug: string) {
  return fetchWrapper.get<ApiResponse<Product>>(`/products/slug/${slug}`, {});
}
```

Đọc dữ liệu: `response.data?.data` (một lớp `data` là của `Response`, lớp trong là envelope của BE).

Component client cần token dùng `useFetch`:
```ts
const { fetchWrapper, status } = useFetch(process.env.NEXT_PUBLIC_SERVER_API as string);
if (!fetchWrapper) return null;   // chưa có accessToken
```

`FetchWrapper` tự xử lý 401: gọi `makeRefreshToken()` → ghi cookie qua `/api/cookie` → retry 1 lần; thất bại thì đẩy về `/auth/log-out`. Trả `503` giả lập khi server không phản hồi (không throw).

Upload file: `fetchWrapper.upload()` (dùng `FormData`, không set `Content-Type`).

---

## Auth

- Cookie `token` httpOnly, 15 phút; `refresh_token` httpOnly, 7 ngày — ghi qua route handler `app/api/cookie`
- `proxy.ts` xử lý i18n + bảo vệ route. Route bảo vệ khai trong `isProtectedRoute()`: `/admin`, `/account`, `/cart`, `/checkouts`, `/payment`
- Admin: `proxy.ts` kiểm tra `user.role !== 'ADMIN'` → redirect `/forbidden`
- State client: `useAuthStore` (Zustand)
- **Không tạo `middleware.ts`** — Next 16 dùng `proxy.ts`, tạo thêm sẽ xung đột
- Không tự thêm route vào `isProtectedRoute()` ngoài yêu cầu

---

## i18n — bắt buộc với mọi text hiển thị

```tsx
const t = useTranslations('Product');          // client
const t = await getTranslations('Product');    // server
```

Không hardcode tiếng Việt/tiếng Anh trong component. Key mới phải thêm vào **cả** `messages/vi.json` **và** `messages/en.json`, giữ nguyên cấu trúc lồng nhau ở hai file.

Điều hướng dùng `Link` / `useRouter` / `redirect` từ `@/i18n/routing`, **không** từ `next/link` hay `next/navigation` — nếu không sẽ mất locale prefix.

---

## Quy ước

| Loại | Mẫu tên |
|---|---|
| Component | `PascalCase.tsx` trong `components/blocks/` |
| Service | `<domain>.service.ts` |
| Store | `<domain>-store.ts` hoặc `<domain>.store.ts` |
| Hook | `use-<name>.ts` |
| Type | `<domain>.type.ts` |
| Page/Layout | `page.tsx` / `layout.tsx` |

- Import dùng alias `@/` (khai ở `tsconfig.json`)
- Server Component là mặc định; chỉ thêm `'use client'` khi cần state/effect/event
- Không dùng `any` — dùng `unknown` nếu thật sự không xác định
- Service function luôn khai kiểu trả về qua generic của `FetchWrapper`
- Không sửa trực tiếp file trong `components/ui/` (shadcn sinh ra)

Prettier: `printWidth: 120`, `singleQuote`, `jsxSingleQuote`, `trailingComma: "none"`, `semi: true`, plugin `prettier-plugin-tailwindcss` (tự sắp xếp class Tailwind — đừng sắp tay).

---

## Không tự phát sinh

Chỉ làm đúng phạm vi được yêu cầu:
- Không tự tạo page, component, store, service, type, endpoint mới
- Không tự thêm field vào store
- Không tự thêm translation key ngoài key cần cho task
- Không refactor code không liên quan
- Không tự tạo file test/doc/config

---

## Cảnh báo

- **Không đổi tên** `paymet.service.ts`, `CheckoutSumary.tsx` (sai chính tả nhưng import đang trỏ đúng tên đó).
- **Component trùng chức năng** — kiểm tra cái nào đang được import trước khi sửa: `CartEmpty.tsx` / `EmptyCart.tsx`, `PaymentForm.tsx` / `PaymentFormMock.tsx`, `AuthBootstrap.tsx` / `AuthInitializer.tsx`.
- **`upload.service.ts` và `chat.service.ts` hiện hỏng** — biến env base URL đang bị comment trong `.env`. Xem `../.claude/rules/known-issues.md` mục E.
- Ảnh remote phải khai host trong `next.config.ts` → `images.remotePatterns`, nếu không `next/image` sẽ chặn.
- Trước khi debug, đọc `../.claude/rules/known-issues.md`.
