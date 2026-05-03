export type OrderAddress = {
  fullName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  district: string;
  ward: string;
};

export type CheckoutStockItem = {
  variantId: string;
  requestedQuantity: number;
  success: boolean;
  status: StockStatus;
  availableStock: number;
  remainingStock: number;
  message?: string;
};

export type StockStatus = 'reserved' | 'insufficient_stock' | 'not_found' | 'inactive' | 'invalid_quantity';

export type CheckoutResult =
  | {
      success: true;
      orderId: string;
      orderNumber: string;
      subtotal: number;
      total: number;
      status: string;
      paymentStatus: string;
      stockItems: CheckoutStockItem[];
    }
  | {
      success: false;
      code: 'CART_EMPTY' | 'STOCK_RESERVATION_FAILED';
      message: string;
      stockItems: CheckoutStockItem[];
    };
