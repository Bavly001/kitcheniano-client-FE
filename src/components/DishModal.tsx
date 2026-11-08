'use client';

import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Check, Sparkles } from 'lucide-react';
import { MenuItemData } from './DishCard';
import { useCartStore } from '../store/cart.store';
import { formatCurrency } from '../lib/utils';

interface DishModalProps {
  dish: MenuItemData | null;
  onClose: () => void;
}

export default function DishModal({ dish, onClose }: DishModalProps) {
  const { addItem, toggleCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!dish) return null;

  const handleAddToCart = () => {
    addItem(dish, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
      toggleCart(true);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-100 animate-in zoom-in-95 duration-200">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-stone-900/40 hover:bg-stone-900/70 text-white flex items-center justify-center backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Dish Image */}
          <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden">
            {dish.imageUrl ? (
              <img
                src={dish.imageUrl}
                alt={dish.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-300">
                <ShoppingBag className="w-12 h-12 stroke-1" />
              </div>
            )}
            <div className="absolute bottom-4 left-4">
              <span className="px-3.5 py-1.5 rounded-full bg-brand-500 text-white text-xs font-bold shadow-md">
                Artisan Selection
              </span>
            </div>
          </div>

          {/* Details Content */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-serif font-black text-2xl text-stone-900">
                  {dish.name}
                </h3>
                <span className="text-xs font-medium text-stone-400">Fresh to Order</span>
              </div>
              <span className="font-serif font-bold text-2xl text-brand-600">
                {formatCurrency(dish.price)}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
              {dish.description ||
                'Prepared with seasonal heirloom ingredients, stone hearth wood firing, and fresh herbs picked daily.'}
            </p>

            {dish.notes && (
              <div className="p-3.5 rounded-2xl bg-brand-50/60 border border-brand-100 text-xs text-brand-900 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Chef's Note:</span> {dish.notes}
                </div>
              </div>
            )}

            {/* Quantity and Order Action */}
            <div className="pt-4 border-t border-stone-100 flex items-center gap-4">
              {/* Stepper */}
              <div className="flex items-center gap-3 border border-stone-200 rounded-xl p-1 bg-stone-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-600 hover:bg-white transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-bold px-2 min-w-[24px] text-center text-stone-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-600 hover:bg-white transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Submit CTA */}
              <button
                onClick={handleAddToCart}
                disabled={added}
                className="flex-1 py-3 px-6 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-brand-500/20 transition-all"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Added to Basket</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add {quantity > 1 ? `(${quantity}) ` : ''}• {formatCurrency(dish.price * quantity)}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
