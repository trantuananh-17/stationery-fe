# Luồng dữ liệu · Auth · Realtime

Đọc khi phải sửa việc lấy dữ liệu, đăng nhập/token, giỏ hàng, hoặc thông báo realtime.

---

## Ba con đường lấy dữ liệu — chọn đúng

| Ngữ cảnh | Cách làm |
|---|---|
| Server Component (SEO, first paint) | gọi thẳng hàm trong `services/*.service.ts` |
| Client Component, dữ liệu public | `useQuery` + hàm service |
| Client Component, cần Bearer token | `useFetch(...)` → `fetchWrapper` → gọi trong `queryFn` |

Instance `FetchWrapper` ở module scope của service **không mang token**. Route cần đăng nhập mà gọi bằng instance đó sẽ nhận 401. Bắt buộc dùng `useFetch`:

```tsx
const { fetchWrapper } = useFetch(process.env.NEXT_PUBLIC_SERVER_API as string);

const { data } = useQuery({
  queryKey: ['orders'],
  queryFn: async () => {
    const response = await fetchWrapper!.get<ApiResponse<Order[]>>('/orders/my-orders');
    return response.data?.data;
  },
  enabled: !!fetchWrapper
});
```

`useFetch` trả `fetchWrapper: null` khi chưa có `accessToken` — luôn dùng `enabled: !!fetchWrapper`, đừng gọi bừa.

---

## Hình dạng response — hai lớp `data`

```ts
const response = await getProducts();   // Response & { data?: ApiResponse<T> }
response.status                          // HTTP status
response.data                            // envelope: { message, statusCode, data, processID, duration }
response.data?.data                      // payload thật
```

`FetchWrapper.#send` gán `response.data = await response.json()`. Nếu body không phải JSON, `response.data` là `undefined` — **luôn dùng optional chaining**.

`FetchWrapper` **không throw** khi server chết: nó trả một `Response` giả với `status: 503` và `data: undefined`. Vì vậy `try/catch` quanh service không bắt được lỗi mạng — phải kiểm tra `response.ok` hoặc `response.status`.

---

## Vòng đời token

```
sign-in
  └─ POST /auths/login → { accessToken, refreshToken }
       └─ POST /api/cookie  → set httpOnly cookie
            token         maxAge 60*15      (15 phút)
            refresh_token maxAge 86400*7    (7 ngày)
```

**Server side** — `proxy.ts` chạy trên mọi request khớp matcher:
1. `intlProxy` xử lý locale trước; nếu nó redirect thì trả luôn
2. Route auth (`/auth/sign-in`, `/auth/sign-up`) mà đã có token → về `/`
3. Route không bảo vệ → cho qua
4. Không có `token` nhưng có `refresh_token` → `makeRefreshToken()` → set cookie mới
5. Có `token` → `getUserByToken()` gọi `GET /users/get-profile`; hỏng thì thử refresh, vẫn hỏng thì xoá cookie + về sign-in
6. `/admin` mà `user.role !== 'ADMIN'` → `/forbidden`

**Client side** — `FetchWrapper.#send`:
- Nhận `401` **và** có `#refreshToken` **và** đang ở client → `makeRefreshToken()` → `POST /api/cookie?key=token` → gắn `Authorization` mới → **gọi đệ quy lại đúng 1 lần**
- Refresh thất bại → `window.location.href = '/auth/log-out'`

⚠️ `makeRefreshToken` trong `lib/auth.ts` có bug singleton nghiêm trọng (không reset promise, chia sẻ giữa các request phía server). Xem `../.claude/rules/known-issues.md` mục B. **Đừng copy mẫu này sang chỗ khác.**

---

## Giỏ hàng — guest và user

- Guest: định danh bằng session id trong `lib/cart-session.ts`; BE dùng `OptionalJwtAuthGuard` nên guest vẫn thao tác được
- Sau khi đăng nhập: `POST /cart/merge` gộp giỏ guest vào giỏ user
- State client: `stores/cart-store.ts`, logic dùng chung: `hooks/use-cart.ts`

Sửa giỏ hàng phải thử **cả hai** trạng thái guest và đã đăng nhập.

---

## Realtime thông báo

`providers/AdminProvider.tsx` + `lib/socket.ts`:

```
notificationSocket.connect()
  → emit('notification.join', { receiverId })
  → on('notification.created', handler) → cập nhật notification.store
  → cleanup: off(...) trong return của useEffect
```

Server tương ứng: `../stationery-be/apps/notification-service/.../notification.gateway.ts`, namespace `/notifications`, port **3406**.

⚠️ `lib/socket.ts` đang hardcode `http://localhost:3411` (sai cổng, sai host cho production, service cũng không expose trong docker). Xem `known-issues.md` mục D.

---

## Providers — thứ tự bọc

```
app/layout.tsx
  └─ NextIntlClientProvider
       └─ QueryProvider          (TanStack Query client)
            └─ ShopProvider      (khu shop)
            └─ AdminProvider     (khu admin — mở socket thông báo)
```

`layouts/AuthBootstrap.tsx` / `AuthInitializer.tsx` nạp auth state từ cookie vào `useAuthStore` phía client. Cả hai cùng tồn tại — kiểm tra cái nào thực sự được import trước khi sửa.

---

## Bẫy hay gặp

| Triệu chứng | Nguyên nhân |
|---|---|
| `params.id` là `undefined` | Next 16: `params`/`searchParams` là Promise, phải `await` |
| Link làm mất `/vi` `/en` | dùng `next/link` thay vì `@/i18n/routing` |
| 401 dù đã đăng nhập | dùng instance `FetchWrapper` module-level thay vì `useFetch` |
| `undefined/uploads/single` | biến env base URL bị comment trong `.env` (mục E) |
| Không bắt được lỗi mạng | `FetchWrapper` trả 503 giả, không throw — phải check `response.ok` |
| Class Tailwind bị đảo thứ tự | `prettier-plugin-tailwindcss` tự sắp — đúng, đừng sửa tay |
| `next/image` chặn ảnh | host chưa khai trong `next.config.ts` → `images.remotePatterns` |
| Text hiện ra key thay vì nội dung | thiếu key ở `vi.json` hoặc `en.json` |
