# .kiro Configuration — stationery-fe

## Cấu trúc

```
.kiro/
  ├── steering/          # Rules luôn áp dụng
  │   └── rules.md       # ⚠️ Quy định chống AI tự phát sinh
  │
  ├── skills/            # Quy trình thực hiện các tác vụ cụ thể
  │   ├── create-service.md       # /create-service
  │   ├── create-store.md         # /create-store
  │   ├── create-component.md     # /create-component
  │   ├── create-page.md          # /create-page
  │   ├── review-code.md          # /review-code
  │   └── add-translation.md      # /add-translation
  │
  └── README.md          # Tài liệu này
```

---

## Rules (steering/rules.md)

**Mục đích**: Đây là lớp kiểm soát phạm vi chính, **luôn bật mặc định**.

Nội dung gồm:
1. Phạm vi làm việc (không tự thêm feature)
2. Tech stack cố định (không thay đổi thư viện)
3. Cấu trúc thư mục (tuân thủ đúng vị trí)
4. Quy ước đặt tên file
5. Quy tắc gọi API (chỉ dùng FetchWrapper)
6. Auth flow (không tự thay đổi)
7. State management (Zustand, không Redux)
8. i18n (bắt buộc với text hiển thị)
9. TypeScript (không dùng `any`)
10. Không tự sinh component, page, store ngoài yêu cầu

→ **Chức năng**: Ngăn AI tự phát sinh code ngoài yêu cầu.

---

## Skills

**Mục đích**: Cung cấp quy trình chuẩn khi thực hiện một tác vụ cụ thể.

| Skill | Khi nào dùng | File output |
|---|---|---|
| `/create-service` | Tạo service gọi API | `services/<domain>.service.ts` |
| `/create-store` | Tạo Zustand store | `stores/<domain>-store.ts` |
| `/create-component` | Tạo component | `components/blocks/<Name>.tsx` |
| `/create-page` | Tạo page mới | `app/[locale]/(...)/<route>/page.tsx` |
| `/review-code` | Review code theo convention | — |
| `/add-translation` | Thêm i18n key | `messages/vi.json`, `messages/en.json` |

→ **Chức năng**: Đảm bảo output đúng chuẩn project.

---

## Cách dùng trong Kiro IDE

1. **Rules tự động áp dụng** (inclusion: auto) → Kiro sẽ đọc mỗi lần thực thi.
2. **Skills kích hoạt bằng #** → Bạn có thể gọi `#create-service` trong chat.

Ví dụ:
```
Tôi cần tạo service mới cho inventory #create-service
```

---

## Lưu ý

- Steering rules **không phải để giới hạn dự án** — mà để giới hạn cách AI hoạt động (không tự phát sinh).
- Skills **không phải là command/script** — mà là hướng dẫn quy trình (how-to).
- Nếu cần bổ sung rule/skill mới, thêm file vào đúng folder.
