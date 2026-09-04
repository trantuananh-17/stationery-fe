import { z } from 'zod';

export type Address = {
  id: string;
  fullName: string;
  phone: string;
  address1: string;
  address2?: string;
  ward: string;
  district: string;
  city: string;
  isDefault: boolean;
};

export const AddressSchema = z.object({
  fullName: z.string().min(1).max(100),
  phone: z
    .string()
    .min(1)
    .max(20)
    .regex(/^[0-9+\s.-]+$/),
  address1: z.string().min(1).max(255),
  address2: z.string().max(255).optional(),
  ward: z.string().min(1).max(100),
  district: z.string().min(1).max(100),
  city: z.string().min(1).max(100),
  isDefault: z.boolean().optional()
});

export type AddressFormValues = z.infer<typeof AddressSchema>;
