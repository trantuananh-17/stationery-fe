import { z } from 'zod';

export const COUPON_TYPES = ['PERCENT', 'FIXED'] as const;

export type CouponType = (typeof COUPON_TYPES)[number];

export type Coupon = {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minOrderAmount: number;
  maxDiscount: number;
  startsAt?: string;
  expiresAt?: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
};

export type GetCouponsResponse = {
  items: Coupon[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ValidatedCoupon = {
  code: string;
  type: CouponType;
  discount: number;
};

export const CouponSchema = z.object({
  code: z.string().min(1).max(50),
  type: z.enum(COUPON_TYPES),
  value: z.number().min(1),
  minOrderAmount: z.number().min(0).optional(),
  maxDiscount: z.number().min(0).optional(),
  startsAt: z.string().optional(),
  expiresAt: z.string().optional(),
  usageLimit: z.number().int().min(0).optional(),
  isActive: z.boolean().optional()
});

export type CouponFormValues = z.infer<typeof CouponSchema>;
