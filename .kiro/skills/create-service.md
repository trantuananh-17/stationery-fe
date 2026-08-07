# Skill: /create-service

Tạo một service file mới trong `services/` để gọi API backend.

## Khi nào dùng

Khi cần thêm một nhóm API call mới cho một domain chưa có service, hoặc thêm hàm mới vào service đã tồn tại.

## Quy trình

1. Xác định domain (ví dụ: `inventory`, `review`).
2. Kiểm tra xem `services/<domain>.service.ts` đã tồn tại chưa.
3. Nếu chưa: tạo file mới theo template dưới.
4. Nếu rồi: chỉ thêm hàm mới vào file hiện có, không xóa/sửa hàm cũ.
5. Định nghĩa đầy đủ kiểu params và kiểu trả về.
6. Bọc response type bằng `ApiResponse<T>` từ `@/types/type`.

## Template mẫu

```typescript
import { FetchWrapper } from '@/lib/fetch-wrapper';
import { ApiResponse } from '@/types/type';
// import các type domain cụ thể

const fetchWrapper = new FetchWrapper(process.env.NEXT_PUBLIC_SERVER_API as string);

export type Get<Domain>Params = {
  page?: number;
  limit?: number;
  // thêm params nếu cần
};

export async function get<Domain>s(params?: Get<Domain>Params) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.limit) searchParams.set('limit', String(params.limit));

  const qs = searchParams.toString();
  return fetchWrapper.get<ApiResponse<...>>(`/<endpoint>${qs ? `?${qs}` : ''}`);
}
```

## Quy tắc bắt buộc

- Chỉ dùng `FetchWrapper` — không dùng `fetch` hay `axios` trực tiếp.
- Không tự thêm hàm ngoài yêu cầu.
- Nếu service cần auth (admin route), nhắc người dùng dùng `useFetch` hook ở client component.
- File đặt tại `services/<domain>.service.ts`.
