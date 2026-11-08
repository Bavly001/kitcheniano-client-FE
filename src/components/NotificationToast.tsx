'use client';

import React from 'react';
import Link from 'next/link';
import { ChefHat, X, ArrowRight, Bell } from 'lucide-react';
import { useNotificationStore } from '../store/notification.store';

export default function NotificationToast() {
  const { activeToast, dismissToast } = useNotificationStore();

  if (!activeToast) return null;

  const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Received' },
    accepted: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Accepted' },
    in_kitchen: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Cooking Now' },
    ready_for_pickup: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Ready for Pickup' },
    out_for_delivery: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Out for Delivery' },
    received: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Delivered / Completed' },
    cancelled: { bg: 'bg-rose-100', text: 'text-rose-800', label: 'Cancelled' },
  };

  const statusInfo = statusColors[activeToast.status] || {
    bg: 'bg-stone-100',
    text: 'text-stone-800',
    label: activeToast.status,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white rounded-2xl shadow-2xl border border-stone-200/80 p-4 transition-all duration-300 animate-in slide-in-from-bottom-5">
      <div className="flex items-start justify-between gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0 text-brand-600">
          <ChefHat className="w-5 h-5 animate-pulse" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-semibold text-stone-900 text-sm">
              Order #{activeToast.orderId}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusInfo.bg} ${statusInfo.text}`}>
              {statusInfo.label}
            </span>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed mb-3">
            {activeToast.message}
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-stone-100">
            <Link
              href={`/orders/${activeToast.orderId}`}
              onClick={dismissToast}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
            >
              <span>Track Live Order</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <span className="text-[10px] text-stone-400">Just now</span>
          </div>
        </div>

        <button
          onClick={dismissToast}
          className="text-stone-400 hover:text-stone-600 p-1 rounded-lg hover:bg-stone-100 transition-colors shrink-0"
          title="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
