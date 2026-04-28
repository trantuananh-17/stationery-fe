import * as z from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên sản phẩm'),
  description: z.string().min(1, 'Vui lòng nhập mô tả sản phẩm'),
  shortDescription: z.string().min(1, 'Vui lòng nhập mô tả ngắn'),
  categoryId: z.string().min(1, 'Vui lòng chọn danh mục'),
  brandId: z.string().min(1, 'Vui lòng chọn thương hiệu'),
  images: z.array(z.string()).min(1, 'Vui lòng thêm ít nhất 1 hình ảnh'),
  thumbnail: z.string().min(1, 'Vui lòng chọn ảnh đại diện'),
  status: z.enum(['active', 'inactive', 'draft'], {
    error: 'Vui lòng chọn trạng thái'
  }),
  featured: z.boolean().optional(),
  searchKeywords: z.array(z.string()).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional()
});

export const specificationSchema = z.object({
  attributeId: z.string().min(1, 'Vui lòng chọn thuộc tính'),
  value: z.string().min(1, 'Vui lòng nhập giá trị')
});

export const variantSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên biến thể'),
  price: z.number().min(0, 'Giá không được nhỏ hơn 0'),
  stock: z.number().min(0, 'Tồn kho không được nhỏ hơn 0'),
  compareAtPrice: z.number().min(0, 'Giá so sánh không được nhỏ hơn 0').optional(),
  image: z.string().optional(),
  sortOrder: z.number().optional(),
  isDefault: z.boolean().optional(),
  attributeValueIds: z.array(z.string()).min(1, 'Vui lòng chọn giá trị thuộc tính'),
  attributeValueSlug: z.array(z.string()).min(1, 'Vui lòng chọn slug thuộc tính')
});

export const ProductSchema = z.object({
  product: productSchema,
  specifications: z.array(specificationSchema),
  variants: z.array(variantSchema).min(1, 'Vui lòng thêm ít nhất 1 biến thể')
});

export type ProductFormValues = z.infer<typeof ProductSchema>;
