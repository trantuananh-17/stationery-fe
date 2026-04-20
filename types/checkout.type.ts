import * as z from 'zod';

export const addressSchema = z.object({
  firstName: z.string().min(1, 'Vui lòng nhập họ'),
  lastName: z.string().min(1, 'Vui lòng nhập họ tên'),
  email: z.string().min(1, 'Vui lòng nhập email').email('Email không hợp lệ'),
  phone: z.string().min(1, 'Vui lòng nhập số điện thoại'),
  address1: z.string().min(1, 'Vui lòng nhập địa chỉ'),
  address2: z.string().optional(),
  city: z.string().min(1, 'Vui lòng nhập tỉnh / thành phố'),
  district: z.string().min(1, 'Vui lòng nhập quận / huyện'),
  ward: z.string().min(1, 'Vui lòng nhập phường / xã')
});

export const checkoutFormSchema = z.object({
  shippingAddress: addressSchema,
  paymentMethod: z.enum(['stripe', 'cod'], {
    message: 'Vui lòng chọn phương thức thanh toán'
  }),
  notes: z.string().optional()
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export type CheckoutPayload = {
  shippingAddress: z.infer<typeof addressSchema>;
  billingAddress: z.infer<typeof addressSchema>;
  paymentMethod: 'stripe' | 'cod';
  notes?: string;
};
