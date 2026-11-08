'use client';

import React from 'react';
import Link from 'next/link';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Lock } from 'lucide-react';
import { useCartStore } from '../store/cart.store';
import { useAuthStore } from '../store/auth.store';
import { formatCurrency, resolveImageUrl } from '../lib/utils';

export default function CartDrawer() {
  const { items, isOpen, toggleCart, updateQuantity, removeItem, clearCart, getSubtotal, getItemCount } =
    useCartStore();
  const { isAuthenticated } = useAuthStore();

  if (!isOpen) return null;

  const subtotal = getSubtotal();
  const itemCount = getItemCount();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity"
        onClick={() => toggleCart(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-stone-200">
          {/* Header */}
          <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-lg text-stone-900">Your Basket</h2>
                <p className="text-xs text-stone-500">
                  {itemCount} {itemCount === 1 ? 'dish' : 'dishes'} selected
                </p>
              </div>
            </div>
            <button
              onClick={() => toggleCart(false)}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-stone-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
                  <ShoppingBag className="w-8 h-8 stroke-1" />
                </div>
                <h3 className="font-serif font-semibold text-lg text-stone-900 mb-1">
                  Your basket is empty
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mb-6 leading-relaxed">
                  Explore our handcrafted artisan dishes, wood-fired pizzas, and fresh Mediterranean flavors.
                </p>
                <Link
                  href="/menu"
                  onClick={() => toggleCart(false)}
                  className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-medium text-sm transition-colors shadow-sm"
                >
                  Explore Menu
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.menuItemId} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                  <div className="w-16 h-16 rounded-xl bg-stone-100 border border-stone-200/80 overflow-hidden shrink-0 flex items-center justify-center">
                    {resolveImageUrl(item.imageUrl) ? (
                      <img
                        src={resolveImageUrl(item.imageUrl)!}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ShoppingBag className="w-6 h-6 text-stone-300" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-sm text-stone-900 truncate">{item.name}</h4>
                      <button
                        onClick={() => removeItem(item.menuItemId)}
                        className="text-stone-300 hover:text-rose-500 transition-colors p-1"
                        title="Remove dish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-xs font-semibold text-brand-600 mb-2">
                      {formatCurrency(item.price)}
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2 border border-stone-200 rounded-lg p-0.5 bg-stone-50">
                        <button
                          onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-stone-600 hover:bg-white transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-medium px-1 min-w-[20px] text-center text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-stone-600 hover:bg-white transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-semibold text-stone-900">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout CTA */}
          {items.length > 0 && (
            <div className="p-6 border-t border-stone-100 bg-stone-50/50 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-500">Subtotal</span>
                <span className="font-semibold text-stone-900 text-base">{formatCurrency(subtotal)}</span>
              </div>
              <p className="text-[11px] text-stone-400">
                Taxes and delivery fee calculated at checkout.
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={clearCart}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 text-xs font-medium transition-colors"
                >
                  Clear All
                </button>
                <Link
                  href="/checkout"
                  onClick={() => toggleCart(false)}
                  className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              {!isAuthenticated && (
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-500 pt-0.5">
                  <Lock className="w-3 h-3 text-amber-500 shrink-0" />
                  <span>Account sign-in required to submit order</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
