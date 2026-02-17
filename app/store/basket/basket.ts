'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-toastify';
import { ItemType } from '@/app/(admin)/admin/type/items';

export type BasketItem = {
  item: ItemType;
  quantity: number;
};

type BasketStore = {
  items: BasketItem[];
  addItem: (item: BasketItem) => void;
  removeItem: (id: string) => void;
  clearBasket: () => void;
};

export const useBasketStore = create<BasketStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (prd) => {
        set(state => {
          const existing = state.items.find(i => i.item._id === prd.item._id);

          if (existing) {
            return {
              items: state.items.map(i =>
                i.item._id === prd.item._id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }

          return {
            items: [...state.items, { item: prd.item, quantity: 1 }],
          };
        });

        toast.success(`${prd.item.name} added to basket`);
      },

      removeItem: (id) => {
        set(state => ({
          items: state.items
            .map(i =>
              i.item._id === id
                ? { ...i, quantity: i.quantity - 1 }
                : i
            )
            .filter(i => i.quantity > 0),
        }));
        toast.success(`Item removed`);
      },

      clearBasket: () => set({ items: [] }),
    }),
    {
      name: 'basket', // localStorage key
    }
  )
);
