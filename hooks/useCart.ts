'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CartItem, Product } from '@/types/product';
import { cartService } from '@/lib/cartService';

interface UseCartOptions {
  userId?: string;
}

interface CartTotals {
  totalItems: number;
  subtotal: number;
}

export function useCart({ userId }: UseCartOptions) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(Boolean(userId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = cartService.subscribe(
      userId,
      nextItems => {
        setItems(nextItems);
        setLoading(false);
        setError(null);
      },
      err => {
        setError(err.message);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [userId]);

  const totals = useMemo<CartTotals>(() => {
    return items.reduce(
      (acc, item) => {
        const price = item.salePrice ?? item.price;
        acc.totalItems += item.quantity;
        acc.subtotal += item.quantity * price;
        return acc;
      },
      { totalItems: 0, subtotal: 0 },
    );
  }, [items]);

  const addItem = useCallback(
    async (product: Product, quantity = 1) => {
      if (!userId) {
        throw new Error('You must be signed in to add items to your cart.');
      }
      await cartService.addItem(userId, product, quantity);
    },
    [userId],
  );

  const updateItemQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (!userId) {
        throw new Error('You must be signed in to manage your cart.');
      }
      await cartService.updateItemQuantity(userId, productId, quantity);
    },
    [userId],
  );

  const removeItem = useCallback(
    async (productId: string) => {
      if (!userId) {
        throw new Error('You must be signed in to manage your cart.');
      }
      await cartService.removeItem(userId, productId);
    },
    [userId],
  );

  const checkout = useCallback(async () => {
    if (!userId) {
      throw new Error('You must be signed in to checkout.');
    }
    return cartService.checkout(userId, items);
  }, [items, userId]);

  return {
    items,
    loading,
    error,
    totals: {
      totalItems: totals.totalItems,
      subtotal: Number(totals.subtotal.toFixed(2)),
    },
    addItem,
    updateItemQuantity,
    removeItem,
    checkout,
  };
}

