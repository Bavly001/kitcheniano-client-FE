'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  Clock,
  ShoppingBag,
  ArrowRight,
  Truck,
  Store,
  CheckCircle2,
  AlertCircle,
  Search,
  Sparkles,
  Flame,
  ChefHat,
  PackageCheck,
  XCircle,
} from 'lucide-react';
import { apiClient } from '../../lib/api-client';
import { useAuthStore } from '../../store/auth.store';
import { formatCurrency, formatDate } from '../../lib/utils';

export interface OrderItemSummary {
  id: number;
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
}

export interface ClientOrder {
  id: number;
  organizationId: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string | null;
  type: 'delivery' | 'pickup';
  status: 'pending' | 'accepted' | 'in_kitchen' | 'out_for_delivery' | 'ready_for_pickup' | 'received' | 'rejected' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid';
  subtotal: number;
  totalPrice: number;
  scheduledFor: string;
  notes?: string | null;
  createdAt: string;
  items: OrderItemSummary[];
}

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, client, token } = useAuthStore();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [lookupId, setLookupId] = useState('');

  const { data, isLoading, isError, refetch } = useQuery<{ orders: ClientOrder[] }>({
    queryKey: ['client-orders'],
    queryFn: () => apiClient('/client/orders'),
    enabled: isAuthenticated && !!token,
  });

  const orders = data?.orders || [];

  const activeOrders = orders.filter((o) =>
    ['pending', 'accepted', 'in_kitchen', 'out_for_delivery', 'ready_for_pickup'].includes(o.status)
  );

  const completedOrders = orders.filter((o) =>
    ['received', 'rejected', 'cancelled'].includes(o.status)
  );

  const displayedOrders =
    filter === 'active'
      ? activeOrders
      : filter === 'completed'
      ? completedOrders
      : orders;

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = lookupId.trim().replace(/^#/, '');
    if (cleanId) {
      router.push(`/orders/${cleanId}`);
    }
  };

  const getStatusBadge = (status: ClientOrder['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            Order Received
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            <ChefHat className="w-3.5 h-3.5 text-blue-600" />
            Kitchen Accepted
          </span>
        );
      case 'in_kitchen':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-800 border border-orange-200">
            <Flame className="w-3.5 h-3.5 text-orange-600 animate-pulse" />
            Cooking in Hearth
          </span>
        );
      case 'out_for_delivery':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200">
            <Truck className="w-3.5 h-3.5 text-purple-600" />
            Out for Delivery
          </span>
        );
      case 'ready_for_pickup':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200">
            <Store className="w-3.5 h-3.5 text-indigo-600" />
            Ready for Pickup
          </span>
        );
      case 'received':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Completed
          </span>
        );
      case 'rejected':
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            {status === 'rejected' ? 'Declined' : 'Cancelled'}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 space-y-10">
      {/* Header & Quick Lookup */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Real-Time Fulfillment
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 tracking-tight">
            Order Status & History
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-light mt-1">
            {isAuthenticated
              ? `Logged in as ${client?.firstName} ${client?.lastName} (${client?.email})`
              : 'Track active meals and view itemized delivery receipts'}
          </p>
        </div>

        {/* Guest / Direct Tracking Lookup */}
        <form onSubmit={handleLookup} className="w-full md:w-auto">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={lookupId}
                onChange={(e) => setLookupId(e.target.value)}
                placeholder="Track by Order #..."
                className="pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-brand-500 bg-white shadow-2xs"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors"
            >
              Track
            </button>
          </div>
        </form>
      </div>

      {!isAuthenticated ? (
        <div className="bg-white rounded-3xl border border-stone-200/80 p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8 stroke-1" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif font-bold text-2xl text-stone-900">
              Sign In to View All Past Orders
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
              If you have a customer account, sign in to track live status, re-order past favorites, and manage your addresses.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/login"
              className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs transition-colors"
            >
              Sign In to Account
            </Link>
            <Link
              href="/menu"
              className="px-6 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition-colors"
            >
              Browse Menu
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Active Orders Highlight Banner if any */}
          {activeOrders.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse" />
                <h2 className="font-serif font-bold text-xl text-stone-900">
                  Active Live Orders ({activeOrders.length})
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl border-2 border-brand-500/30 p-6 shadow-sm space-y-4 hover:border-brand-500/60 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                          Order #{order.id}
                        </div>
                        <div className="text-xs text-stone-500">
                          Placed on {formatDate(order.createdAt)}
                        </div>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>

                    <div className="p-3 bg-stone-50 rounded-2xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-stone-700">
                        {order.type === 'delivery' ? (
                          <Truck className="w-4 h-4 text-brand-600" />
                        ) : (
                          <Store className="w-4 h-4 text-brand-600" />
                        )}
                        <span className="capitalize font-semibold">{order.type}</span>
                        <span className="text-stone-300">•</span>
                        <span>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
                      </div>
                      <span className="font-serif font-bold text-stone-900 text-sm">
                        {formatCurrency(order.totalPrice)}
                      </span>
                    </div>

                    <Link
                      href={`/orders/${order.id}`}
                      className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                    >
                      <span>Track Order in Real-Time</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Filter Bar */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  filter === 'all'
                    ? 'bg-stone-900 text-white shadow-2xs'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                All Orders ({orders.length})
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  filter === 'active'
                    ? 'bg-stone-900 text-white shadow-2xs'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                In Progress ({activeOrders.length})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  filter === 'completed'
                    ? 'bg-stone-900 text-white shadow-2xs'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                Past & Completed ({completedOrders.length})
              </button>
            </div>
          </div>

          {/* Orders Listing Grid */}
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl border border-stone-200 p-6 animate-pulse space-y-4"
                >
                  <div className="h-4 bg-stone-100 rounded w-1/4" />
                  <div className="h-8 bg-stone-100 rounded-xl" />
                </div>
              ))}
            </div>
          ) : displayedOrders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-stone-200/80 p-12 text-center space-y-4">
              <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto stroke-1" />
              <h3 className="font-serif font-bold text-xl text-stone-900">
                No orders match your filter
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Discover our wood-fired hearth specialties and fresh artisan dishes!
              </p>
              <Link
                href="/menu"
                className="inline-flex px-6 py-2.5 rounded-xl bg-brand-500 text-white text-xs font-semibold hover:bg-brand-600 transition-colors"
              >
                Browse Menu
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {displayedOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-serif font-bold text-lg text-stone-900">
                        Order #{order.id}
                      </span>
                      {getStatusBadge(order.status)}
                      <span className="text-xs text-stone-400">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600">
                      <div className="flex items-center gap-1.5">
                        {order.type === 'delivery' ? (
                          <Truck className="w-4 h-4 text-stone-400" />
                        ) : (
                          <Store className="w-4 h-4 text-stone-400" />
                        )}
                        <span className="capitalize">{order.type}</span>
                      </div>
                      <span>•</span>
                      <span>{order.items.length} {order.items.length === 1 ? 'dish' : 'dishes'}</span>
                      <span>•</span>
                      <span className="font-bold text-stone-900">
                        {formatCurrency(order.totalPrice)}
                      </span>
                    </div>

                    <div className="text-xs text-stone-500 line-clamp-1">
                      {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                    <Link
                      href={`/orders/${order.id}`}
                      className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs flex items-center gap-2 transition-colors w-full md:w-auto justify-center"
                    >
                      <span>View Live Status</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
