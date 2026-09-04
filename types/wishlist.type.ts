export type WishlistItem = {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  thumbnail: string;
  price: number;
};

export type WishlistItemInput = {
  productId: string;
  productName: string;
  productSlug: string;
  thumbnail: string;
  price: number;
};
