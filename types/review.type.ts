import { z } from 'zod';

export type Review = {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type ReviewSummary = {
  average: number;
  count: number;
};

export type GetReviewsResponse = {
  items: Review[];
  summary: ReviewSummary;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export const ReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1).max(2000)
});

export type ReviewFormValues = z.infer<typeof ReviewSchema>;
