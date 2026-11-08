'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ChefHat,
  Flame,
  Truck,
  Store,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  User,
  ShoppingBag,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  Radio,
  XCircle,
  FileText,
  Sparkles,
} from 'lucide-react';
import { apiClient } from '../../../lib/api-client';
import { useAuthStore } from '../../../store/auth.store';
import { useNotificationStore } from '../../../store/notification.store';
import { formatCurrency, formatDate } from '../../../lib/utils';
import { ClientOrder } from '../page';

const ORDER_STEPS = [
  {
    key: 'pending',
    label: 'Order Placed',
    description: 'Received by kitchen reception',
    icon: Clock,
  },
  {
    key: 'accepted',
    label: 'Chef Accepted',
    description: 'Ticket assigned to culinary station',
    icon: ChefHat,
  },
  {
    key: 'in_kitchen',
    label: 'Cooking in Hearth',
    description: 'Dishes currently baking in wood-fire oven',
    icon: Flame,
  },
  {
    key: 'transit',
    label: 'On the Way',
    description: 'Out for delivery or ready at counter',
    icon: Truck,
  },
  {
    key: 'received',
    label: 'Delivered',
    description: 'Enjoy your handcrafted meal!',
    icon: CheckCircle2,
  },
];

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const orderId = params?.id as string;

  const { isAuthenticated, token } = useAuthStore();
  const { isConnected, notifications } = useNotificationStore();

  // Fetch authoritative order details
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<{ order: ClientOrder }>({
    queryKey: ['client-order', orderId],
    queryFn: () => apiClient(`/client/orders/${orderId}`),
    enabled: !!orderId && isAuthenticated && !!token,
    refetchInterval: 12000, // Poll fallback every 12s in case SSE is interrupted
  });

  const order = data?.order;

  // Real-time listener: refetch when an SSE notification arrives for this order
  useEffect(() => {
    if (!notifications || notifications.length === 0) return;
    const latest = notifications[0];
    if (latest && String(latest.orderId) === String(orderId)) {
      queryClient.invalidateQueries({ queryKey: ['client-order', orderId] });
      refetch();
    }
  }, [notifications, orderId, queryClient, refetch]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <Clock className="w-8 h-8 stroke-1" />
        </div>
        <h2 className="font-serif font-bold text-2xl text-stone-900">
          Sign In Required to View Order #{orderId}
        </h2>
        <p className="text-xs text-stone-500 max-w-sm mx-auto">
          To protect customer privacy, please sign in with the account used to place this order.
        </p>
        <Link
          href="/login"
          className="inline-flex px-6 py-2.5 rounded-xl bg-brand-500 text-white text-xs font-semibold hover:bg-brand-600 transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-8 animate-pulse">
        <div className="h-6 bg-stone-100 rounded w-1/4" />
        <div className="h-44 bg-stone-100 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 h-64 bg-stone-100 rounded-3xl" />
          <div className="h-64 bg-stone-100 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8 stroke-1" />
        </div>
        <h2 className="font-serif font-bold text-2xl text-stone-900">
          Order Not Found
        </h2>
        <p className="text-xs text-stone-500 max-w-sm mx-auto">
          {(error as any)?.message || `We couldn't locate order #${orderId} for your account.`}
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => refetch()}
            className="px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
          <Link
            href="/orders"
            className="px-5 py-2.5 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold hover:bg-stone-200 transition-colors"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  // Calculate progress index based on status
  const getStepIndex = (status: ClientOrder['status']) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'accepted':
        return 1;
      case 'in_kitchen':
        return 2;
      case 'out_for_delivery':
      case 'ready_for_pickup':
        return 3;
      case 'received':
        return 4;
      default:
        return -1;
    }
  };

  const currentStepIdx = getStepIndex(order.status);
  const isDeclined = order.status === 'rejected' || order.status === 'cancelled';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 space-y-10">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Orders</span>
        </Link>

        {/* Live SSE Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>{isConnected ? 'Live Kitchen Stream Active' : 'Connecting to Kitchen...'}</span>
          </div>

          <button
            onClick={() => refetch()}
            title="Refresh order status"
            className="p-2 rounded-xl border border-stone-200 text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Status Headline Hero */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-10 shadow-xs space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                Live Kitchen Fulfillment
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-xs font-bold text-stone-400">
                Order #{order.id}
              </span>
            </div>
            <h1 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 mt-1">
              {isDeclined
                ? 'Order Discontinued'
                : order.status === 'received'
                ? 'Meal Fulfilled & Delivered'
                : order.status === 'in_kitchen'
                ? 'Crafting in Hearth & Oven'
                : order.status === 'accepted'
                ? 'Order Confirmed by Chef'
                : order.status === 'out_for_delivery'
                ? 'Driver Out for Delivery'
                : order.status === 'ready_for_pickup'
                ? 'Ready for Counter Pickup'
                : 'Order Received & Queued'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 font-light mt-1">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>

          <div className="text-right">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Estimated Ready Time
            </div>
            <div className="font-serif font-bold text-xl sm:text-2xl text-stone-900 mt-0.5">
              {order.status === 'received'
                ? 'Delivered'
                : order.scheduledFor
                ? formatDate(order.scheduledFor)
                : '30–40 Minutes'}
            </div>
          </div>
        </div>

        {/* Stepper Pipeline */}
        {isDeclined ? (
          <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center gap-4">
            <XCircle className="w-8 h-8 text-rose-600 shrink-0" />
            <div>
              <div className="font-bold text-sm">
                This order was {order.status === 'rejected' ? 'declined by the kitchen' : 'cancelled'}.
              </div>
              <div className="text-xs text-rose-700 mt-0.5">
                {order.notes || 'If you have questions, please reach out directly to restaurant reception.'}
              </div>
            </div>
          </div>
        ) : (
          <div className="pt-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 relative">
              {ORDER_STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isPassed = currentStepIdx >= idx;
                const isCurrent = currentStepIdx === idx;

                return (
                  <div
                    key={step.key}
                    className={`p-4 rounded-2xl border transition-all ${
                      isCurrent
                        ? 'border-brand-500 bg-brand-50/60 shadow-sm'
                        : isPassed
                        ? 'border-stone-200 bg-stone-50/60'
                        : 'border-stone-100 bg-white opacity-40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isCurrent
                            ? 'bg-brand-500 text-white shadow-xs'
                            : isPassed
                            ? 'bg-stone-900 text-white'
                            : 'bg-stone-100 text-stone-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-stone-900 leading-tight">
                        {step.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 leading-snug">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Grid: Order Breakdown & Logistics Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Itemized Order Dishes */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <h2 className="font-serif font-bold text-xl text-stone-900">
              Itemized Culinary Bill
            </h2>
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
              {order.items.length} {order.items.length === 1 ? 'Dish' : 'Dishes'}
            </span>
          </div>

          <div className="divide-y divide-stone-100">
            {order.items.map((item) => (
              <div key={item.id} className="py-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-500 font-bold text-xs">
                    {item.quantity}x
                  </div>
                  <div>
                    <div className="font-semibold text-stone-900">{item.name}</div>
                    <div className="text-[11px] text-stone-400">
                      {formatCurrency(item.price)} each
                    </div>
                  </div>
                </div>
                <span className="font-bold text-stone-900">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-stone-100 space-y-2.5 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Items Subtotal</span>
              <span className="font-semibold text-stone-900">{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Fulfillment ({order.type})</span>
              <span className="font-semibold text-stone-900">
                {order.type === 'delivery' ? (order.subtotal > 35 ? 'Free' : formatCurrency(3.5)) : 'Free'}
              </span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Payment Status</span>
              <span
                className={`font-bold uppercase tracking-wider px-2 py-0.5 rounded text-[10px] ${
                  order.paymentStatus === 'paid'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {order.paymentStatus}
              </span>
            </div>

            <div className="pt-3 border-t border-stone-100 flex justify-between items-baseline">
              <span className="font-serif font-bold text-stone-900 text-base">Total Price</span>
              <span className="font-serif font-black text-2xl text-brand-600">
                {formatCurrency(order.totalPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Delivery Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            <h2 className="font-serif font-bold text-xl text-stone-900 pb-4 border-b border-stone-100">
              Logistics & Recipient
            </h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-bold text-stone-900">{order.customerName}</div>
                  <div className="text-stone-500">{order.customerPhone}</div>
                </div>
              </div>

              {order.customerAddress && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-brand-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-bold text-stone-900">Delivery Address</div>
                    <div className="text-stone-500 leading-relaxed">{order.customerAddress}</div>
                  </div>
                </div>
              )}

              {order.notes && (
                <div className="flex items-start gap-3 pt-3 border-t border-stone-100">
                  <FileText className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-bold text-stone-900">Special Instructions</div>
                    <div className="text-stone-500 italic mt-0.5">{order.notes}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Action Navigation */}
          <div className="bg-stone-50 rounded-3xl border border-stone-200 p-6 space-y-3">
            <div className="text-xs font-bold text-stone-800">Hungry for something else?</div>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Order fresh wood-fired bread or artisanal desserts while your main dish is being prepared!
            </p>
            <Link
              href="/menu"
              className="inline-flex w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs items-center justify-center gap-2 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore More Dishes</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
