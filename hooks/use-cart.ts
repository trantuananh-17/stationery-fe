'use client';

import { use, useState } from 'react';

import { AppContext } from '@/components/layouts/Provider';
import { getOrCreateSessionId } from '@/lib/cart-session';
import {
  addToCart as addToCartService,
  getCart,
  removeCartItem,
  updateCartItemQuantity
} from '@/services/cart.service';
import { useCartStore } from '@/stores/cart-store';

export function useCart() {
  const { accessToken } = use(AppContext);

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

  const fetchCart = async () => {
    if (isCartLoaded) return;

    try {
      await refetchCart();
    } finally {
      setCartLoaded(true);
    }
  };

  const addItem = async (variantId: string, quantity: number) => {
    if (isItemPending(variantId)) return;

    startPending(variantId);

    try {
      await addToCartService(variantId, quantity, accessToken, getSessionId());
      await refetchCart();

      setCartLoaded(true);
      openCart();
    } finally {
      stopPending(variantId);
    }
  };

  const increaseItem = async (variantId: string) => {
    if (isItemPending(variantId)) return;

    const item = cart.items.find((item) => item.variantId === variantId);
    if (!item) return;

    startPending(variantId);

    try {
      await updateCartItemQuantity(item.variantId, item.quantity + 1, accessToken, getSessionId());
      await refetchCart();
    } finally {
      stopPending(variantId);
    }
  };

  const decreaseItem = async (variantId: string) => {
    if (isItemPending(variantId)) return;

    const item = cart.items.find((item) => item.variantId === variantId);
    if (!item) return;

    startPending(variantId);

    try {
      if (item.quantity <= 1) {
        await removeCartItem(item.id, accessToken, getSessionId());
      } else {
        await updateCartItemQuantity(item.variantId, item.quantity - 1, accessToken, getSessionId());
      }

      await refetchCart();
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
