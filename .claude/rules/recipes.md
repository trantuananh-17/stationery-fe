# Công thức thao tác thường gặp

Mỗi mục là quy trình đầy đủ, theo đúng mẫu code đang có trong repo.

---

## Thêm một service gọi API

File: `services/<domain>.service.ts`

```ts
import { FetchWrapper } from '@/lib/fetch-wrapper';
import { ApiResponse } from '@/types/type';
import { Review } from '@/types/review.type';

const fetchWrapper = new FetchWrapper(process.env.NEXT_PUBLIC_SERVER_API as string);

export type GetReviewsParams = { page?: number; limit?: number };

export type GetReviewsResponse = {
  items: Review[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getReviews(productId: string, params?: GetReviewsParams) {
  const searchParams = new URLSearchParams();

  if (params?.page) {
    searchParams.set('page', String(params.page));
  }

  if (params?.limit) {
    searchParams.set('limit', String(params.limit));
  }

  const queryString = searchParams.toString();

  return fetchWrapper.get<ApiResponse<GetReviewsResponse>>(
    `/products/${productId}/reviews${queryString ? `?${queryString}` : ''}`,
    {}
  );
}
```

Quy tắc:
- Một instance `FetchWrapper` ở đầu file, dùng chung cho cả module
- Query param dựng bằng `URLSearchParams`, mỗi param một khối `if` (theo mẫu `product.service.ts`)
- Không đọc `response.data` trong service — trả nguyên `Response` cho phía gọi
- Endpoint phải tồn tại thật trên BFF: đối chiếu `../.claude/rules/api-contract.md`

**Route cần token** thì không dùng instance module-level mà dùng `useFetch` trong component client.

---

## Thêm Zustand store

File: `stores/<domain>-store.ts`

```ts
import { create } from 'zustand';

type ReviewState = {
  reviews: Review[];
  isLoading: boolean;
  setReviews: (reviews: Review[]) => void;
  reset: () => void;
};

export const useReviewStore = create<ReviewState>((set) => ({
  reviews: [],
  isLoading: false,
  setReviews: (reviews) => set({ reviews }),
  reset: () => set({ reviews: [], isLoading: false })
}));
```

- Mỗi domain một store. Store hiện có: `auth-store`, `cart-store`, `notification.store`, `chat-bot.store`
- Selector từng field để tránh render thừa: `useAuthStore((s) => s.accessToken)`, **không** `useAuthStore()`
- Không thêm field vào store có sẵn nếu không được yêu cầu
- Cần persist thì theo đúng mẫu store đang có, đừng tự chọn cơ chế khác

---

## Thêm component

File: `components/blocks/<Name>.tsx` (hoặc `blocks/admin/`, `blocks/auth/`, `blocks/chats/`)

```tsx
'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

type ReviewCardProps = {
  review: Review;
  className?: string;
};

export function ReviewCard({ review, className }: ReviewCardProps) {
  const t = useTranslations('Product');

  return (
    <div className={cn('rounded-lg border p-4', className)}>
      <p className='text-sm text-muted-foreground'>{t('review.title')}</p>
      {review.content}
    </div>
  );
}
```

- Mặc định là Server Component; chỉ thêm `'use client'` khi cần state/effect/event handler
- Props khai bằng `type`, tên `<Name>Props`
- Gộp class bằng `cn()` từ `@/lib/utils`, nhận `className` để bên ngoài override
- Primitive lấy từ `@/components/ui/*`, **không sửa** file trong `ui/`
- Mọi text hiển thị đi qua `t()`

---

## Thêm page

File: `app/[locale]/<group>/<route>/page.tsx`

Chọn group đúng:
| Loại trang | Vị trí |
|---|---|
| Công khai, marketing/auth | `(marketing)/` |
| Shop, không cần đăng nhập | `(shop)/` |
| Shop, cần đăng nhập | `(shop)/(protected)/` |
| Quản trị | `(admin)/admin/` |

```tsx
import { getTranslations } from 'next-intl/server';
import { getReviews } from '@/services/review.service';

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ page?: string }>;
};

export default async function ReviewsPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { page } = await searchParams;
  const t = await getTranslations('Product');

  const response = await getReviews(id, { page: Number(page) || 1 });
  const data = response.data?.data;

  return <section>{/* ... */}</section>;
}
```

⚠️ **Next 16: `params` và `searchParams` là Promise** — phải `await`. Đây là lỗi hay gặp nhất khi copy code cũ.

Route mới cần đăng nhập ⇒ đặt trong `(protected)/` **và** phải khớp với `isProtectedRoute()` trong `proxy.ts` (hàm này so khớp theo prefix path, không tự biết route group).

---

## Thêm translation key

Sửa **cả hai** file, giữ đúng cùng cấu trúc lồng nhau:

```jsonc
// messages/vi.json
{ "Product": { "review": { "title": "Đánh giá" } } }

// messages/en.json
{ "Product": { "review": { "title": "Reviews" } } }
```

- Namespace = nhóm chức năng (`Product`, `Cart`, `Admin`, `Auth`...)
- Thiếu key ở một file ⇒ next-intl báo lỗi ở locale đó lúc runtime
- Chỉ thêm key phục vụ task hiện tại

---

## Fetch với TanStack Query (component client)

```tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { getReviews } from '@/services/review.service';

export function ReviewList({ productId }: { productId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      const response = await getReviews(productId);
      return response.data?.data;
    }
  });
}
```

- `queryKey` bắt đầu bằng tên domain, kèm mọi biến ảnh hưởng kết quả
- Sau mutation nhớ `invalidateQueries` đúng key
- `QueryProvider` đã bọc sẵn ở `providers/QueryProvider.tsx` — không tạo `QueryClient` mới

---

## Form với react-hook-form + zod

```tsx
const schema = z.object({
  content: z.string().min(1, t('validation.required')),
  rating: z.number().min(1).max(5)
});

const form = useForm<z.infer<typeof schema>>({
  resolver: zodResolver(schema),
  defaultValues: { content: '', rating: 5 }
});
```

Message lỗi lấy từ `t()`, không hardcode. Render bằng `Form*` primitives trong `components/ui/form.tsx`. Mẫu đầy đủ: `components/blocks/admin/ProductForm.tsx`.

---

## Checklist trước khi coi là xong

- [ ] Endpoint gọi tới có tồn tại trên BFF (`../.claude/rules/api-contract.md`)
- [ ] Response khai đúng `ApiResponse<T>`, đọc đúng `response.data?.data`
- [ ] Text hiển thị đều qua `t()`, key có ở **cả** `vi.json` và `en.json`
- [ ] `params`/`searchParams` đã `await`
- [ ] Điều hướng dùng `Link`/`useRouter` từ `@/i18n/routing`
- [ ] Không `any`, không sửa `components/ui/`
- [ ] Route cần đăng nhập đã có trong `isProtectedRoute()` của `proxy.ts`
