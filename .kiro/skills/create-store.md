# Skill: /create-store

Tạo một Zustand store mới để quản lý state.

## Khi nào dùng

Khi cần quản lý state global cho một domain mới (ví dụ: `wishlist-store`, `filter-store`).

## Quy trình

1. Xác định domain cần state.
2. Kiểm tra xem store đã tồn tại chưa trong `stores/`.
3. Tạo file `stores/<domain>-store.ts` hoặc `stores/<domain>.store.ts`.
4. Định nghĩa state, actions (setter, getter, computed).
5. Không tự thêm logic phức tạp hay side effect trong store — store chỉ chứa state thuần.

## Template mẫu

```typescript
import { create } from 'zustand';

type <Domain>State = {
  // state fields
  items: [];

  // actions
  setItems: (items: []) => void;
  addItem: (item: any) => void;
  removeItem: (id: string) => void;
  reset: () => void;
};

export const use<Domain>Store = create<<Domain>State>((set) => ({
  items: [],

  setItems: (items) => set({ items }),
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  reset: () => set({ items: [] })
}));
```

## Quy tắc bắt buộc

- Dùng Zustand (không dùng Redux hay React Context cho global state).
- Không lưu logic fetch data trong store — store chỉ chứa state và setter đơn giản.
- Nếu cần side effect (fetch, socket, cookie), để trong component hoặc provider.
- Đặt file tại `stores/<domain>-store.ts` hoặc `stores/<domain>.store.ts`.
