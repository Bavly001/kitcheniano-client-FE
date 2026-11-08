'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Clock, Sparkles } from 'lucide-react';
import { useCartStore } from '../../store/cart.store';
import { formatCurrency } from '../../lib/utils';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, clearCart, getSubtotal, getItemCount } = useCartStore();
  const [notes, setNotes] = useState('');

  const subtotal = getSubtotal();
  const itemCount = getItemCount();
  const deliveryFee = subtotal > 35 || subtotal === 0 ? 0 : 3.5;
  const estimatedTax = Number((subtotal * 0.08).toFixed(2));
  const orderTotal = Number((subtotal + deliveryFee + estimatedTax).toFixed(2));

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-3xl bg-stone-100 flex items-center justify-center text-stone-400 mx-auto mb-6 shadow-inner">
          <ShoppingBag className="w-10 h-10 stroke-1" />
        </div>
        <h1 className="font-serif font-black text-3xl text-stone-900 mb-2">
          Your Shopping Basket is Empty
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto leading-relaxed mb-8">
          Looks like you haven't added any artisan dishes to your order yet. Explore our seasonal wood-fired menu!
        </p>
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm shadow-md shadow-brand-500/20 transition-all"
        >
          <span>Explore Our Menu</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
          Order Review
        </span>
        <h1 className="font-serif font-black text-3xl sm:text-4xl text-stone-900">
          Your Culinary Basket
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Items List */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              {itemCount} {itemCount === 1 ? 'Dish' : 'Dishes'} in Basket
            </span>
            <button
              onClick={clearCart}
              className="text-xs font-medium text-stone-400 hover:text-rose-600 transition-colors"
            >
              Clear Basket
            </button>
          </div>

          <div className="divide-y divide-stone-100">
            {items.map((item) => (
              <div key={item.menuItemId} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-20 h-20 rounded-2xl bg-stone-100 border border-stone-200/80 overflow-hidden shrink-0 flex items-center justify-center">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <ShoppingBag className="w-7 h-7 text-stone-300" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-stone-900 mb-1">
                      {item.name}
                    </h3>
                    <div className="text-xs font-semibold text-brand-600">
                      {formatCurrency(item.price)} each
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0">
                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2 border border-stone-200 rounded-xl p-1 bg-stone-50">
                    <button
                      onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-600 hover:bg-white transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold px-2 min-w-[20px] text-center text-stone-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-600 hover:bg-white transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right min-w-[70px]">
                    <div className="text-sm font-bold text-stone-900">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.menuItemId)}
                    className="p-1.5 text-stone-300 hover:text-rose-500 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Kitchen Order Notes */}
          <div className="pt-6 border-t border-stone-100 space-y-2">
            <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-500" />
              <span>Special Preparation Notes (Optional)</span>
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Extra basil on pizza, dressings on the side, ring doorbell twice..."
              className="w-full p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 text-xs text-stone-900 focus:outline-none focus:border-brand-500 transition-colors resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs space-y-6 sticky top-28">
          <h2 className="font-serif font-bold text-xl text-stone-900 pb-4 border-b border-stone-100">
            Order Summary
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Items Subtotal</span>
              <span className="font-semibold text-stone-900">{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex justify-between text-stone-600">
              <span>Delivery Fee</span>
              <span className="font-semibold text-stone-900">
                {deliveryFee === 0 ? (
                  <span className="text-emerald-600 font-bold uppercase tracking-wide">Free</span>
                ) : (
                  formatCurrency(deliveryFee)
                )}
              </span>
            </div>

            <div className="flex justify-between text-stone-600">
              <span>Estimated Tax (8%)</span>
              <span className="font-semibold text-stone-900">{formatCurrency(estimatedTax)}</span>
            </div>

            {subtotal < 35 && (
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100 text-[11px] text-amber-800">
                Add {formatCurrency(35 - subtotal)} more for <strong>Free Delivery!</strong>
              </div>
            )}

            <div className="pt-4 border-t border-stone-100 flex justify-between items-baseline">
              <span className="font-serif font-bold text-stone-900 text-base">Total</span>
              <span className="font-serif font-black text-2xl text-brand-600">
                {formatCurrency(orderTotal)}
              </span>
            </div>
          </div>

          <button
            onClick={() => router.push('/checkout')}
            className="w-full py-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-md shadow-brand-500/25 flex items-center justify-center gap-2 transition-all"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-4 border-t border-stone-100 space-y-2 text-[11px] text-stone-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Safe & Secure Contactless Checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-500 shrink-0" />
              <span>Live Order Preparation & SSE Tracking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
