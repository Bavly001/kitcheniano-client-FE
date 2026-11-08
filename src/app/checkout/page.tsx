'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChefHat,
  MapPin,
  Phone,
  User,
  ShoppingBag,
  CreditCard,
  Banknote,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Truck,
  Store,
  Clock,
  Lock,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { apiClient } from '../../lib/api-client';
import { useAuthStore } from '../../store/auth.store';
import { useCartStore } from '../../store/cart.store';
import { formatCurrency } from '../../lib/utils';
import { validateCheckoutAuth } from '../../lib/checkout';

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, client, token, setAuth } = useAuthStore();
  const { items, getSubtotal, clearCart } = useCartStore();

  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card_on_delivery'>('cash');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Prefill authenticated client info
  useEffect(() => {
    if (client) {
      setName(`${client.firstName} ${client.lastName}`.trim());
      setPhone(client.phone || '');
      setAddress(client.address || '');
    }
  }, [client]);

  const subtotal = getSubtotal();
  const deliveryFee = orderType === 'delivery' ? (subtotal > 35 || subtotal === 0 ? 0 : 3.5) : 0;
  const estimatedTax = Number((subtotal * 0.08).toFixed(2));
  const orderTotal = Number((subtotal + deliveryFee + estimatedTax).toFixed(2));

  // If basket is empty, redirect to menu
  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 mx-auto">
          <ShoppingBag className="w-8 h-8 stroke-1" />
        </div>
        <h2 className="font-serif font-bold text-2xl text-stone-900">Your basket is empty</h2>
        <p className="text-xs text-stone-500">Please add dishes to your basket before checking out.</p>
        <Link
          href="/menu"
          className="inline-flex px-6 py-2.5 rounded-xl bg-brand-500 text-white text-xs font-semibold"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Enforce strict customer authentication gate
      const authValidation = validateCheckoutAuth(isAuthenticated, token, client?.id);
      if (!authValidation.allowed) {
        setErrorMsg(authValidation.error || 'Please sign in or create an account to complete your order.');
        setLoading(false);
        return;
      }

      // 2. Submit order payload bound to verified customer ID
      const orderPayload = {
        customerName: name,
        customerPhone: phone,
        customerAddress: orderType === 'delivery' ? address : undefined,
        type: orderType,
        notes: notes ? `${notes} [Payment: ${paymentMethod}]` : `[Payment: ${paymentMethod}]`,
        items: items.map((i) => ({ menuItemId: i.menuItemId, quantity: i.quantity })),
      };

      const res = await apiClient('/client/orders', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      if (res && res.order && res.order.id) {
        // Clear local cart
        clearCart();
        // Redirect directly to live order tracking page
        router.push(`/orders/${res.order.id}`);
      } else {
        throw new Error('Order creation was acknowledged but missing order ID');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to place order. Please check your information.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
          Fast & Secure Checkout
        </span>
        <h1 className="font-serif font-black text-3xl sm:text-4xl text-stone-900">
          Complete Your Order
        </h1>
      </div>

      {errorMsg && (
        <div className="mb-8 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Delivery & Contact Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* Fulfillment Type Toggle */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Fulfillment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOrderType('delivery')}
                  className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    orderType === 'delivery'
                      ? 'border-brand-500 bg-brand-50/50 text-brand-900 shadow-2xs font-semibold'
                      : 'border-stone-200 hover:border-stone-300 text-stone-700'
                  }`}
                >
                  <Truck className="w-5 h-5 text-brand-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold">Contactless Delivery</div>
                    <div className="text-[11px] text-stone-400">Delivered in ~30–40 mins</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType('pickup')}
                  className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    orderType === 'pickup'
                      ? 'border-brand-500 bg-brand-50/50 text-brand-900 shadow-2xs font-semibold'
                      : 'border-stone-200 hover:border-stone-300 text-stone-700'
                  }`}
                >
                  <Store className="w-5 h-5 text-brand-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold">Storefront Pickup</div>
                    <div className="text-[11px] text-stone-400">Ready in ~15–20 mins</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
              <h2 className="font-serif font-bold text-xl text-stone-900">
                Contact & Delivery Details
              </h2>

              {/* Customer Account Status & Verification Gate */}
              {!isAuthenticated ? (
                <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-5 space-y-3 shadow-2xs">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-sm text-stone-900">
                        Sign In or Register Required to Place Order
                      </h3>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        To guarantee your order is tracked and linked to your verified customer ID, please sign in or register before completing your order.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 pt-1 sm:pl-13">
                    <Link
                      href="/login?redirect=/checkout"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-xs transition-colors"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Sign In</span>
                    </Link>
                    <Link
                      href="/register?redirect=/checkout"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 font-bold text-xs shadow-2xs transition-colors"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-stone-500" />
                      <span>Create Account</span>
                    </Link>
                  </div>
                </div>
              ) : client ? (
                <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-4 flex items-center justify-between text-xs shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-emerald-950">
                        Ordering as {client.firstName} {client.lastName}
                      </div>
                      <div className="text-emerald-700 text-[11px] font-medium">
                        {client.email} &bull; Verified Customer ID #{client.id}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => useAuthStore.getState().logout()}
                    className="text-[11px] font-semibold text-stone-500 hover:text-stone-700 underline ml-2"
                  >
                    Switch account
                  </button>
                </div>
              ) : null}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">Recipient Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-brand-500 bg-stone-50/50"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">Phone Number *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 234-5678"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-brand-500 bg-stone-50/50"
                    />
                  </div>
                </div>
              </div>

              {orderType === 'delivery' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">Delivery Street Address *</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="142 Downtown Culinary Ave, Apt 4B"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-brand-500 bg-stone-50/50"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">Kitchen Instructions (Optional)</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Leave on doorstep, sauce on side, extra napkins..."
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-brand-500 bg-stone-50/50 resize-none"
                />
              </div>
            </div>

            {/* Payment Options */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
              <h2 className="font-serif font-bold text-xl text-stone-900">Payment Option</h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    paymentMethod === 'cash'
                      ? 'border-brand-500 bg-brand-50/50 text-brand-900 font-semibold shadow-2xs'
                      : 'border-stone-200 text-stone-700'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold">Cash on Arrival</div>
                    <div className="text-[11px] text-stone-400">Pay directly when received</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card_on_delivery')}
                  className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    paymentMethod === 'card_on_delivery'
                      ? 'border-brand-500 bg-brand-50/50 text-brand-900 font-semibold shadow-2xs'
                      : 'border-stone-200 text-stone-700'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-brand-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold">Card on Arrival</div>
                    <div className="text-[11px] text-stone-400">Mobile terminal at door</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Order Review Sidebar */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs space-y-6 sticky top-28">
            <h2 className="font-serif font-bold text-xl text-stone-900 pb-4 border-b border-stone-100">
              Receipt Preview
            </h2>

            <div className="max-h-60 overflow-y-auto divide-y divide-stone-100 pr-1">
              {items.map((item) => (
                <div key={item.menuItemId} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-400">{item.quantity}x</span>
                    <span className="font-medium text-stone-800">{item.name}</span>
                  </div>
                  <span className="font-semibold text-stone-900">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t border-stone-100 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Delivery</span>
                <span className="font-semibold text-stone-900">
                  {deliveryFee === 0 ? 'Free' : formatCurrency(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Estimated Tax (8%)</span>
                <span className="font-semibold text-stone-900">{formatCurrency(estimatedTax)}</span>
              </div>
              <div className="pt-3 border-t border-stone-100 flex justify-between items-baseline">
                <span className="font-serif font-bold text-stone-900 text-base">Total Due</span>
                <span className="font-serif font-black text-2xl text-brand-600">
                  {formatCurrency(orderTotal)}
                </span>
              </div>
            </div>

            {!isAuthenticated ? (
              <div className="space-y-3">
                <Link
                  href="/login?redirect=/checkout"
                  className="w-full py-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-md shadow-brand-500/25 flex items-center justify-center gap-2 transition-all text-center"
                >
                  <Lock className="w-4 h-4" />
                  <span>Sign In to Place Order • {formatCurrency(orderTotal)}</span>
                </Link>
                <div className="text-center text-xs text-stone-500">
                  New customer?{' '}
                  <Link
                    href="/register?redirect=/checkout"
                    className="font-bold text-brand-600 hover:text-brand-700 underline"
                  >
                    Create an account
                  </Link>
                </div>
              </div>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-brand-500/25 flex items-center justify-center gap-2 transition-all"
              >
                <span>{loading ? 'Submitting to Kitchen...' : `Place Order • ${formatCurrency(orderTotal)}`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Direct kitchen fulfillment & live order updates</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
