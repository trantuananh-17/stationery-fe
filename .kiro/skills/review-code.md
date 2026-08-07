# Skill: /review-code

Review code theo convention của project.

## Khi nào dùng

Khi cần review một file, component, service, hoặc store vừa viết.

## Checklist review

### Chung
- [ ] Không có `any` type — dùng type cụ thể hoặc `unknown`
- [ ] Không dùng thư viện ngoài danh sách cho phép trong rules.md
- [ ] Đặt file đúng vị trí trong cấu trúc thư mục
- [ ] Tên file theo convention (PascalCase.tsx, use-name.ts, domain.service.ts)

### Component
- [ ] Text hiển thị dùng `useTranslations` / `getTranslations` (không hardcode string)
- [ ] Dùng Shadcn UI và Tailwind CSS v4 (không CSS inline, không CSS module)
- [ ] Local UI state dùng `useState`, không tạo Zustand store thừa
- [ ] Không fetch data trực tiếp bằng `fetch` — dùng TanStack Query hoặc server component

### Service
- [ ] Chỉ dùng `FetchWrapper` (không `axios`, không `fetch` thô)
- [ ] Có type đầy đủ cho params và response
- [ ] Response bọc trong `ApiResponse<T>`
- [ ] File đặt tại `services/<domain>.service.ts`

### Store
- [ ] Chỉ dùng Zustand
- [ ] Không chứa logic fetch data hay side effect trong store
- [ ] Mỗi domain có store riêng, không gộp chung

### Auth & Route
- [ ] Route cần đăng nhập đặt trong `(protected)/`
- [ ] Không tự thêm route vào `isProtectedRoute()` trừ khi yêu cầu
- [ ] Không đọc/ghi token thẳng trong component — qua `useAuthStore` hoặc cookie API

## Cách report

Với mỗi vấn đề tìm thấy, báo theo format:
- **File**: đường dẫn
- **Vấn đề**: mô tả ngắn
- **Đề xuất**: cách sửa đúng convention
