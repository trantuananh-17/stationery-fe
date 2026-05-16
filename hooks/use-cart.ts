'use client';

import { use, useState } from 'react';

import { getOrCreateSessionId } from '@/lib/cart-session';
import {
  addToCart as addToCartService,
  getCart,
  removeCartItem,
  updateCartItemQuantity
} from '@/services/cart.service';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from 'sonner';

export function useCart() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const cart = useCartStore((state) => state.cart);
  const isCartLoaded = useCartStore((state) => state.isCartLoaded);

  const setCart = useCartStore((state) => state.setCart);
  const setCartLoaded = useCartStore((state) => state.setCartLoaded);
  const openCart = useCartStore((state) => state.openCart);

  const [pendingItemIds, setPendingItemIds] = useState<string[]>([]);

  const getSessionId = () => {
    return accessToken ? null : getOrCreateSessionId();
  };

  const isItemPending = (itemId: string) => {
    return pendingItemIds.includes(itemId);
  };

  const startPending = (itemId: string) => {
    setPendingItemIds((prev) => {
      if (prev.includes(itemId)) return prev;
      return [...prev, itemId];
    });
  };

  const stopPending = (itemId: string) => {
    setPendingItemIds((prev) => prev.filter((id) => id !== itemId));
  };

  const refetchCart = async () => {
    const response = await getCart(accessToken, getSessionId());

    if (response.data?.data) {
      setCart(response.data.data);
    }
  };

  const fetchCart = async (overrideToken?: string | null) => {
    if (isCartLoaded) return;

    const token = overrideToken ?? accessToken;

    try {
      const response = await getCart(token, token ? null : getSessionId());

      if (response.data?.data) {
        setCart(response.data.data);
      }
    } finally {
      setCartLoaded(true);
    }
  };

  const addItem = async (variantId: string, quantity: number) => {
    if (isItemPending(variantId)) return;

    startPending(variantId);

    try {
      const response = await addToCartService(variantId, quantity, accessToken, getSessionId());
      if (!response.ok) {
        throw new Error(response.data?.message || 'Thêm vào giỏ hàng thất bại');
      }

      await refetchCart();

      setCartLoaded(true);

      toast.success('Thêm vào giỏ hàng thành công', {
        position: 'top-right'
      });
      openCart();
    } catch (error) {
      console.error(error);

      toast.error('Thêm vào giỏ hàng thất bại', {
        description: 'Vui lòng thử lại',
        position: 'top-right'
      });
    } finally {
      stopPending(variantId);
    }
  };

  // const increaseItem = async (variantId: string) => {
  //   if (isItemPending(variantId)) return;

  //   const item = cart.items.find((item) => item.variantId === variantId);
  //   if (!item) return;

  //   startPending(variantId);

  //   try {
  //     await updateCartItemQuantity(item.variantId, item.quantity + 1, accessToken, getSessionId());
  //     await refetchCart();
  //   } finally {
  //     stopPending(variantId);
  //   }
  // };

  const increaseItem = async (variantId: string) => {
    if (isItemPending(variantId)) return;

    const item = cart.items.find((item) => item.variantId === variantId);

    if (!item) return;

    startPending(variantId);

    try {
      const response = await updateCartItemQuantity(item.variantId, item.quantity + 1, accessToken, getSessionId());

      if (!response.ok) {
        if (response.status === 412) {
          toast.error('Không đủ tồn kho', {
            description: response.data?.message,
            position: 'top-right'
          });

          return;
        }

        throw new Error(response.data?.message || 'Cập nhật số lượng thất bại');
      }

      await refetchCart();

      toast.success('Cập nhật số lượng thành công', {
        description: `Số lượng "${item.productNameSnapshot}" đã tăng lên ${item.quantity + 1}`,
        position: 'top-right'
      });
    } catch (error) {
      console.error(error);

      toast.error('Cập nhật số lượng thất bại', {
        position: 'top-right'
      });
    } finally {
      stopPending(variantId);
    }
  };

  // const decreaseItem = async (variantId: string) => {
  //   if (isItemPending(variantId)) return;

  //   const item = cart.items.find((item) => item.variantId === variantId);
  //   if (!item) return;

  //   startPending(variantId);

  //   try {
  //     if (item.quantity <= 1) {
  //       await removeCartItem(item.id, accessToken, getSessionId());
  //     } else {
  //       await updateCartItemQuantity(item.variantId, item.quantity - 1, accessToken, getSessionId());
  //     }

  //     await refetchCart();
  //   } finally {
  //     stopPending(variantId);
  //   }
  // };

  // const removeItem = async (cartItemId: string) => {
  //   if (isItemPending(cartItemId)) return;

  //   const item = cart.items.find((item) => item.id === cartItemId);
  //   if (!item) return;

  //   startPending(cartItemId);

  //   try {
  //     await removeCartItem(item.id, accessToken, getSessionId());
  //     await refetchCart();
  //     toast.success('Xóa sản phẩm khỏi giỏ hàng thành công', { position: 'top-right' });
  //   } finally {
  //     stopPending(cartItemId);
  //   }
  // };

  const decreaseItem = async (variantId: string) => {
    if (isItemPending(variantId)) return;

    const item = cart.items.find((item) => item.variantId === variantId);

    if (!item) return;

    startPending(variantId);

    try {
      if (item.quantity <= 1) {
        await removeCartItem(item.id, accessToken, getSessionId());

        toast.success('Xóa sản phẩm khỏi giỏ hàng thành công', {
          description: `"${item.productNameSnapshot}" đã được xóa`,
          position: 'top-right'
        });
      } else {
        await updateCartItemQuantity(item.variantId, item.quantity - 1, accessToken, getSessionId());

        toast.success('Cập nhật số lượng thành công', {
          description: `Số lượng "${item.productNameSnapshot}" đã giảm xuống ${item.quantity - 1}`,
          position: 'top-right'
        });
      }

      await refetchCart();
    } catch (error) {
      console.error(error);

      toast.error('Cập nhật giỏ hàng thất bại', {
        position: 'top-right'
      });
    } finally {
      stopPending(variantId);
    }
  };

  const removeItem = async (cartItemId: string) => {
    if (isItemPending(cartItemId)) return;

    const item = cart.items.find((item) => item.id === cartItemId);

    if (!item) return;

    startPending(cartItemId);

    try {
      await removeCartItem(item.id, accessToken, getSessionId());

      await refetchCart();

      toast.success('Xóa sản phẩm khỏi giỏ hàng thành công', {
        description: `"${item.productNameSnapshot}" đã được xóa khỏi giỏ hàng`,
        position: 'top-right'
      });
    } catch (error) {
      console.error(error);

      toast.error('Xóa sản phẩm thất bại', {
        position: 'top-right'
      });
    } finally {
      stopPending(cartItemId);
    }
  };

  return {
    cart,
    items: cart.items ?? [],
    isCartLoaded,
    pendingItemIds,
    isItemPending,
    fetchCart,
    refetchCart,
    addItem,
    increaseItem,
    decreaseItem,
    removeItem
  };
}
