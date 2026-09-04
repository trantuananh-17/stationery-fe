export type InventoryItem = {
  variantId: string;
  variantName: string;
  sku: string;
  productId: string;
  productName: string;
  thumbnail: string;
  stock: number;
  reservedStock: number;
  isAvailable: boolean;
};

export type GetInventoriesResponse = {
  items: InventoryItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
