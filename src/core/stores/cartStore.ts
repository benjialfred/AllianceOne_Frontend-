import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category?: string;
  isSubscription: boolean;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  toggleCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item) => set((state) => {
        // Prevent duplicates
        if (state.items.find((i) => i.id === item.id)) {
          return { ...state, isOpen: true }; // Just open cart if already added
        }
        return { items: [...state.items, item], isOpen: true };
      }),
      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id)
      })),
      clearCart: () => set({ items: [] }),
      setIsOpen: (isOpen) => set({ isOpen }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      getTotal: () => {
        return get().items.reduce((total, item) => total + item.price, 0);
      }
    }),
    {
      name: 'ao-cart-storage',
    }
  )
);
