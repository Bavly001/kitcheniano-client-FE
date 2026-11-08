// ==============================================================================
// CUSTOMER SHOPPING CART STORE (src/store/cart.store.ts)
// ==============================================================================
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { apiClient } from '../lib/api-client';
import { useAuthStore } from './auth.store';

export interface CartItem {
  id?: number;
  menuItemId: number;
  name: string;
  price: number;
  imageUrl?: string | null;
  quantity: number;
  notes?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isSyncing: boolean;
  addItem: (dish: { id: number; name: string; price: number; imageUrl?: string | null }, quantity?: number) => void;
  removeItem: (menuItemId: number) => void;
  updateQuantity: (menuItemId: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: (open?: boolean) => void;
  getSubtotal: () => number;
  getItemCount: () => number;
  syncWithBackend: () => Promise<void>;
  fetchFromBackend: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isSyncing: false,

      addItem: (dish, quantity = 1) => {
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex((i) => i.menuItemId === dish.id);

        let updatedItems: CartItem[];
        if (existingIndex > -1) {
          updatedItems = currentItems.map((item, idx) =>
            idx === existingIndex ? { ...item, quantity: item.quantity + quantity } : item,
          );
        } else {
          updatedItems = [
            ...currentItems,
            {
              menuItemId: dish.id,
              name: dish.name,
              price: Number(dish.price),
              imageUrl: dish.imageUrl || null,
              quantity,
            },
          ];
        }

        set({ items: updatedItems });

        // Trigger non-blocking backend sync if customer is logged in
        if (useAuthStore.getState().isAuthenticated) {
          get().syncWithBackend().catch(() => {});
        }
      },

      removeItem: (menuItemId) => {
        const updatedItems = get().items.filter((i) => i.menuItemId !== menuItemId);
        set({ items: updatedItems });

        if (useAuthStore.getState().isAuthenticated) {
          get().syncWithBackend().catch(() => {});
        }
      },

      updateQuantity: (menuItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(menuItemId);
          return;
        }

        const updatedItems = get().items.map((item) =>
          item.menuItemId === menuItemId ? { ...item, quantity } : item,
        );
        set({ items: updatedItems });

        if (useAuthStore.getState().isAuthenticated) {
          get().syncWithBackend().catch(() => {});
        }
      },

      clearCart: () => {
        set({ items: [] });
        if (useAuthStore.getState().isAuthenticated) {
          apiClient('/client/cart', { method: 'DELETE' }).catch(() => {});
        }
      },

      toggleCart: (open) =>
        set((state) => ({ isOpen: open !== undefined ? open : !state.isOpen })),

      getSubtotal: () => {
        const total = get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        return Number(total.toFixed(2));
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      syncWithBackend: async () => {
        if (!useAuthStore.getState().isAuthenticated) return;
        set({ isSyncing: true });
        try {
          const payload = {
            items: get().items.map((i) => ({ menuItemId: i.menuItemId, quantity: i.quantity })),
          };
          const data = await apiClient('/client/cart', {
            method: 'PUT',
            body: JSON.stringify(payload),
          });
          if (data && Array.isArray(data.items)) {
            set({ items: data.items });
          }
        } catch (err) {
          console.warn('Cart backend sync skipped:', err);
        } finally {
          set({ isSyncing: false });
        }
      },

      fetchFromBackend: async () => {
        if (!useAuthStore.getState().isAuthenticated) return;
        set({ isSyncing: true });
        try {
          const data = await apiClient('/client/cart');
          if (data && Array.isArray(data.items)) {
            set({ items: data.items });
          }
        } catch (err) {
          console.warn('Failed to fetch persisted cart from backend:', err);
        } finally {
          set({ isSyncing: false });
        }
      },
    }),
    {
      name: 'kitcheniano_client_cart',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? window.localStorage : undefined as any)),
    },
  ),
);
