# Skill: /add-translation

Thêm translation key mới vào cả `messages/vi.json` và `messages/en.json`.

## Khi nào dùng

Khi component mới hoặc feature mới cần text hiển thị.

## Quy trình

1. Xác định namespace phù hợp (ví dụ: `Products`, `Cart`, `Admin`, v.v.).
2. Thêm key vào cả `messages/vi.json` và `messages/en.json` đồng thời.
3. Cấu trúc nested nếu cần (ví dụ: `Products.detail.title`).

## Template mẫu

```json
// messages/vi.json
{
  "<Namespace>": {
    "title": "Tiêu đề tiếng Việt",
    "description": "Mô tả tiếng Việt"
  }
}
```

```json
// messages/en.json
{
  "<Namespace>": {
    "title": "English Title",
    "description": "English Description"
  }
}
```

## Quy tắc bắt buộc

- Phải thêm vào cả 2 file ngôn ngữ `vi.json` và `en.json` cùng lúc.
- Không bỏ sót key nào giữa 2 file.
- Không thêm key không sử dụng — chỉ thêm key cần cho task.
