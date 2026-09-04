'use server';

import { updateTag } from 'next/cache';

import { PRODUCT_CACHE_TAG } from '@/services/product.service';

/** Gọi sau khi admin tạo/sửa/xoá/khôi phục sản phẩm để trang shop thấy thay đổi ngay. */
export async function revalidateProducts() {
  updateTag(PRODUCT_CACHE_TAG);
}
