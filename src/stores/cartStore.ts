import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product, CartItem } from '@/types/product';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, color?: string, size?: string) => void;
  removeItem: (productId: string, color?: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, color?: string, size?: string) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

const itemKey = (id: string, color?: string, size?: string) =>
  `${id}|${color || ''}|${size || ''}`;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, color, size) => {
        const { items } = get();
        const key = itemKey(product.id, color, size);
        const existing = items.find(
          i => itemKey(i.product.id, i.selectedColor, i.selectedSize) === key
        );
        if (existing) {
          set({
            items: items.map(i =>
              itemKey(i.product.id, i.selectedColor, i.selectedSize) === key
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({ items: [...items, { product, quantity: 1, selectedColor: color, selectedSize: size }] });
        }
      },

      removeItem: (productId, color, size) => {
        const key = itemKey(productId, color, size);
        set({ items: get().items.filter(i => itemKey(i.product.id, i.selectedColor, i.selectedSize) !== key) });
      },

      updateQuantity: (productId, quantity, color, size) => {
        if (quantity <= 0) {
          get().removeItem(productId, color, size);
          return;
        }
        const key = itemKey(productId, color, size);
        set({
          items: get().items.map(i =>
            itemKey(i.product.id, i.selectedColor, i.selectedSize) === key
              ? { ...i, quantity }
              : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, i) => {
          const price = i.product.is_on_sale && i.product.sale_price ? i.product.sale_price : i.product.price;
          return sum + price * i.quantity;
        }, 0),
    }),
    {
      name: 'brightpath-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
