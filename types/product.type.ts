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
  compareAtPrice: z.number().min(0, 'Giá so sánh không được nhỏ hơn 0').nullable().optional(),
  image: z.string().nullable().optional(),
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
export type ProductBody = z.infer<typeof productSchema>;
export type ProductSpecificationBody = z.infer<typeof specificationSchema>;
export type ProductVariantBody = z.infer<typeof variantSchema>;

export interface ProductCategoryParent {
  id: string;
  name: string;
  slug: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  parent?: ProductCategoryParent | null;
}

export interface ProductBrand {
  id: string;
  name: string;
  slug: string;
}

export interface ProductVariantAttribute {
  attributeId: string;
  attributeName: string;
  attributeValueId: string;
  attributeValue: string;
  attributeValueSlug: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  reservedStock: number;
  sortOrder: number;
  isDefault: boolean;
  isAvailable: boolean;
  attributes: ProductVariantAttribute[];
  image?: string | null;
}

export interface ProductVariantOptionValue {
  id: string;
  value: string;
}

export interface ProductVariantOption {
  attributeId: string;
  attributeName: string;
  values: ProductVariantOptionValue[];
}

export interface ProductSpecification {
  id: string;
  attributeId: string;
  attributeName: string;
  value: string;
}

export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'ARCHIVED';

export interface Product {
  id: string;
  name: string;
  slug: string;

  thumbnail: string;
  images: string[];

  category: ProductCategory;
  brand: ProductBrand;

  description: string;
  shortDescription: string;

  status: ProductStatus;
  featured: boolean;

  seoTitle?: string | null;
  seoDescription?: string | null;

  variants: ProductVariant[];
  variantOptions: ProductVariantOption[];
  specifications?: ProductSpecification[];
}
