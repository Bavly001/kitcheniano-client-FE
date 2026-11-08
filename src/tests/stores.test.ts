import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../store/auth.store';
import { useCartStore } from '../store/cart.store';

describe('Client State Management Stores', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
    useCartStore.getState().clearCart();
  });

  describe('useAuthStore', () => {
    it('initializes with unauthenticated guest state', () => {
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.token).toBeNull();
      expect(state.client).toBeNull();
      expect(state.organizationId).toBe('org_8492a158b');
    });

    it('sets authentication credentials and persists profile', () => {
      useAuthStore.getState().setAuth('mock-jwt-token', {
        id: 101,
        email: 'sofia@example.com',
        firstName: 'Sofia',
        lastName: 'Loren',
        organizationId: 'org_8492a158b',
      });

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.token).toBe('mock-jwt-token');
      expect(state.client?.firstName).toBe('Sofia');
    });

    it('clears state on logout', () => {
      useAuthStore.getState().setAuth('mock-jwt-token', {
        id: 101,
        email: 'sofia@example.com',
        firstName: 'Sofia',
        lastName: 'Loren',
        organizationId: 'org_8492a158b',
      });

      useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.token).toBeNull();
      expect(state.client).toBeNull();
    });
  });

  describe('useCartStore (Guest Mode)', () => {
    const mockDish1 = {
      id: 1,
      name: 'Greek Salad',
      description: 'Crisp romaine and feta',
      price: 12.5,
      imageUrl: '/salad.jpg',
    };

    const mockDish2 = {
      id: 2,
      name: 'Margherita Pizza',
      description: 'Fresh mozzarella and basil',
      price: 18.0,
      imageUrl: '/pizza.jpg',
    };

    it('adds items and calculates subtotal correctly', () => {
      useCartStore.getState().addItem(mockDish1, 2); // 2 * 12.50 = 25.00
      useCartStore.getState().addItem(mockDish2, 1); // 1 * 18.00 = 18.00

      const state = useCartStore.getState();
      expect(state.items.length).toBe(2);
      expect(state.getItemCount()).toBe(3);
      expect(state.getSubtotal()).toBe(43.0);
    });

    it('increments quantity when adding same dish', () => {
      useCartStore.getState().addItem(mockDish1, 1);
      useCartStore.getState().addItem(mockDish1, 3);

      const state = useCartStore.getState();
      expect(state.items.length).toBe(1);
      expect(state.items[0].quantity).toBe(4);
      expect(state.getSubtotal()).toBe(50.0);
    });

    it('updates quantity and removes item when quantity reaches zero', () => {
      useCartStore.getState().addItem(mockDish1, 2);
      useCartStore.getState().updateQuantity(1, 5);

      expect(useCartStore.getState().items[0].quantity).toBe(5);

      useCartStore.getState().updateQuantity(1, 0);
      expect(useCartStore.getState().items.length).toBe(0);
      expect(useCartStore.getState().getSubtotal()).toBe(0);
    });
  });
});
