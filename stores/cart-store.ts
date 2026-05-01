import { GrpcTimestamp } from '@/lib/utils';
import { create } from 'zustand';

export type CartAttribute = {
  name: string;
  value: string;
};

export type CartItem = {
  id: string;
  cartId: string;
  productId: string;
  variantId: string;
  quantity: number;

  productNameSnapshot: string;
  productSlugSnapshot: string;
  variantNameSnapshot: string;

  skuSnapshot?: string;
  productThumbnailSnapshot: string;
  imageVariantSnapshot: string;

  unitPriceSnapshot: number;
  compareAtPriceSnapshot?: number;

  attributesSnapshot: CartAttribute[];

  subtotal: number;
  createdAt: GrpcTimestamp;
  updatedAt: GrpcTimestamp;
};

export type Cart = {
  id: string | null;
  userId?: string;
  sessionId?: string;
  currency?: string;
  status?: string;
  expiresAt?: GrpcTimestamp;

  items: CartItem[];

  totalItems: number;
  totalUniqueItems: number;
  subtotal: number;

  createdAt?: GrpcTimestamp;
  updatedAt?: GrpcTimestamp;
};

export type CartTotal = {
  totalItems: number;
  totalUniqueItems: number;
  subtotal: number;
};

type CartState = {
  cart: Cart;
  isCartOpen: boolean;
  isCartLoaded: boolean;

  setCart: (cart: Cart) => void;
  setCartTotal: (total: CartTotal) => void;
  setCartCount: (count: number) => void;
  setCartLoaded: (loaded: boolean) => void;

  updateItemQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;

  clearCart: () => void;
  resetCart: () => void;

  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  getItems: () => CartItem[];
  getTotalItems: () => number;
  getTotalUniqueItems: () => number;
  getSubtotal: () => number;
};

const emptyCart: Cart = {
  id: null,
  items: [],
  totalItems: 0,
  totalUniqueItems: 0,
  subtotal: 0
};

const calculateCartTotal = (items: CartItem[]) => ({
  totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
  totalUniqueItems: items.length,
  subtotal: items.reduce((sum, item) => sum + item.subtotal, 0)
});

export const useCartStore = create<CartState>((set, get) => ({
  cart: emptyCart,
  isCartOpen: false,
  isCartLoaded: false,

  setCart: (cart) =>
    set({
      cart: {
        ...emptyCart,
        ...cart,
        items: cart.items ?? []
      },
      isCartLoaded: true
    }),

  setCartTotal: (total) =>
    set((state) => ({
      cart: {
        ...state.cart,
        ...total
      }
    })),

  setCartCount: (count) =>
    set((state) => ({
      cart: {
        ...state.cart,
        totalItems: count
      }
    })),

  setCartLoaded: (loaded) => set({ isCartLoaded: loaded }),

  updateItemQuantity: (itemId, quantity) =>
    set((state) => {
      const items = state.cart.items.map((item) => {
        if (item.id !== itemId) return item;

        return {
          ...item,
          quantity,
          subtotal: item.unitPriceSnapshot * quantity
        };
      });

      return {
        cart: {
          ...state.cart,
          items,
          ...calculateCartTotal(items)
        }
      };
    }),

  removeItem: (itemId) =>
    set((state) => {
      const items = state.cart.items.filter((item) => item.id !== itemId);

      return {
        cart: {
          ...state.cart,
          items,
          ...calculateCartTotal(items)
        }
      };
    }),

  clearCart: () =>
    set((state) => ({
      cart: {
        ...state.cart,
        items: [],
        totalItems: 0,
        totalUniqueItems: 0,
        subtotal: 0
      }
    })),

  resetCart: () =>
    set({
      cart: emptyCart,
      isCartOpen: false,
      isCartLoaded: false
    }),

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  getItems: () => get().cart.items,
  getTotalItems: () => get().cart.totalItems,
  getTotalUniqueItems: () => get().cart.totalUniqueItems,
  getSubtotal: () => get().cart.subtotal
}));
