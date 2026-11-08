// ==============================================================================
// REAL-TIME ORDER NOTIFICATIONS STORE (src/store/notification.store.ts)
// ==============================================================================
import { create } from 'zustand';

export interface OrderNotification {
  id: string;
  orderId: number;
  status: string;
  paymentStatus?: string | null;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationState {
  notifications: OrderNotification[];
  unreadCount: number;
  isConnected: boolean;
  activeToast: OrderNotification | null;
  addNotification: (notif: Omit<OrderNotification, 'id' | 'read'>) => void;
  markAllAsRead: () => void;
  dismissToast: () => void;
  connectSSE: (token: string, orgId?: string) => () => void;
  playChime: () => void;
}

/**
 * Synthesizes a soft culinary bell chime using standard Web Audio API.
 */
function playCulinaryChime() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Pleasant two-tone chime (587.33 Hz - D5, followed by 880 Hz - A5)
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.85);
  } catch {
    // Audio might be blocked by browser policy before user interaction
  }
}

let eventSourceInstance: EventSource | null = null;

export const useNotificationStore = create<NotificationState>()((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isConnected: false,
  activeToast: null,

  playChime: () => {
    playCulinaryChime();
  },

  addNotification: (notif) => {
    const newNotif: OrderNotification = {
      ...notif,
      id: `${notif.orderId}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      read: false,
    };

    set((state) => ({
      notifications: [newNotif, ...state.notifications],
      unreadCount: state.unreadCount + 1,
      activeToast: newNotif,
    }));

    get().playChime();
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  dismissToast: () => {
    set({ activeToast: null });
  },

  connectSSE: (token: string, orgId?: string) => {
    if (typeof window === 'undefined') return () => {};

    // Close any prior connection
    if (eventSourceInstance) {
      eventSourceInstance.close();
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const streamUrl = `${apiUrl}/client/notifications/stream?token=${encodeURIComponent(token)}`;

    try {
      const es = new EventSource(streamUrl);
      eventSourceInstance = es;

      es.onopen = () => {
        set({ isConnected: true });
      };

      es.addEventListener('order_status_updated', (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          get().addNotification({
            orderId: data.orderId,
            status: data.status,
            paymentStatus: data.paymentStatus,
            message: data.message || `Order #${data.orderId} updated to ${data.status}`,
            timestamp: data.timestamp || new Date().toISOString(),
          });
        } catch (e) {
          console.warn('Error parsing SSE event data:', e);
        }
      });

      es.onerror = () => {
        set({ isConnected: false });
      };

      return () => {
        es.close();
        eventSourceInstance = null;
        set({ isConnected: false });
      };
    } catch (err) {
      console.warn('Could not establish SSE connection:', err);
      return () => {};
    }
  },
}));
