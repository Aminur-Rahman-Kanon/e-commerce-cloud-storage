'use client';

import { ItemType } from '@/app/(admin)/admin/type/items';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type BasketItem = {
    item: ItemType,
    quantity: number
}

type BasketContextType = {
  items: BasketItem[];
  addItem: (item: BasketItem) => void;
  removeItem: (id: string) => void;
  clearBasket: () => void;
  count: number;
};

const BasketContext = createContext<BasketContextType | null>(null);

const STORAGE_KEY = 'basket';

export function BasketProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<BasketItem[]>([]);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setItems(JSON.parse(stored));
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product: BasketItem) => {
    setItems(prev => {
      const existing = prev.find(items => items.item.id === product.item.id);

      if (existing) {
        return prev.map(items =>
          items.item.id === product.item.id
            ? { ...items, quantity: items.quantity + 1 }
            : items
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeItem = (id: string) => {
    setItems(prev =>
      prev
        .map(items =>
          items.item.id === id
            ? { ...items, quantity: items.quantity - 1 }
            : items
        )
        .filter(item => item.quantity > 0)
    );
  };

  const clearBasket = () => {
    setItems([]);
  };

  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <BasketContext.Provider
      value={{ items, addItem, removeItem, clearBasket, count }}
    >
      {children}
    </BasketContext.Provider>
  );
}

export function useBasket() {
  const context = useContext(BasketContext);
  if (!context) {
    throw new Error('useBasket must be used inside BasketProvider');
  }
  return context;
}
