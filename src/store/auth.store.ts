// ==============================================================================
// CUSTOMER AUTHENTICATION STORE (src/store/auth.store.ts)
// ==============================================================================
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface ClientProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  address?: string | null;
  organizationId: string;
}

interface AuthState {
  token: string | null;
  client: ClientProfile | null;
  organizationId: string;
  isAuthenticated: boolean;
  setAuth: (token: string, client: ClientProfile) => void;
  updateProfile: (updates: Partial<ClientProfile>) => void;
  setOrganizationId: (orgId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      client: null,
      organizationId: process.env.NEXT_PUBLIC_DEFAULT_ORG_ID || '',
      isAuthenticated: false,

      setAuth: (token, client) =>
        set({
          token,
          client,
          organizationId: client.organizationId || process.env.NEXT_PUBLIC_DEFAULT_ORG_ID || '',
          isAuthenticated: true,
        }),

      updateProfile: (updates) =>
        set((state) => ({
          client: state.client ? { ...state.client, ...updates } : null,
        })),

      setOrganizationId: (orgId) => set({ organizationId: orgId }),

      logout: () =>
        set({
          token: null,
          client: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'kitcheniano_client_auth',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? window.localStorage : undefined as any)),
    },
  ),
);
