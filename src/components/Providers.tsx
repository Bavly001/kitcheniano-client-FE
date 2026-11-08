'use client';

import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth.store';
import { useNotificationStore } from '../store/notification.store';
import { useCartStore } from '../store/cart.store';
import NotificationToast from './NotificationToast';
import CartDrawer from './CartDrawer';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 2, // 2 minutes
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  const { token, isAuthenticated } = useAuthStore();
  const { connectSSE } = useNotificationStore();
  const { fetchFromBackend } = useCartStore();

  // Connect to SSE notification stream and sync cart when authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      const disconnect = connectSSE(token);
      fetchFromBackend().catch(() => {});
      return () => {
        disconnect();
      };
    }
  }, [isAuthenticated, token, connectSSE, fetchFromBackend]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <NotificationToast />
      <CartDrawer />
    </QueryClientProvider>
  );
}
