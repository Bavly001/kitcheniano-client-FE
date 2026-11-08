'use client';

import React, { useState } from 'react';
import { ShoppingBag, Check, Plus, Eye, Sparkles } from 'lucide-react';
import { useCartStore } from '../store/cart.store';
import { formatCurrency } from '../lib/utils';

export interface MenuItemData {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string | null;
  notes?: string | null;
  category?: string;
}

interface DishCardProps {
  dish: MenuItemData;
  onOpenModal: (dish: MenuItemData) => void;
}

export default function DishCard({ dish, onOpenModal }: DishCardProps) {
  const { addItem, toggleCart } = useCartStore();
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(dish, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div
      onClick={() => onOpenModal(dish)}
      className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[16/11] bg-stone-100 overflow-hidden">
        {dish.imageUrl ? (
          <img
            src={dish.imageUrl}
            alt={dish.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-stone-300 bg-stone-50">
            <ShoppingBag className="w-10 h-10 stroke-1 mb-1" />
            <span className="text-[11px] font-medium text-stone-400">Kitcheniano Recipe</span>
          </div>
        )}

        {/* Price Tag Pill */}
        <span className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-stone-900/85 backdrop-blur-md text-white text-xs font-bold shadow-sm">
          {formatCurrency(dish.price)}
        </span>

        {/* Quick View Overlay on Hover */}
        <div className="absolute inset-0 bg-stone-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="px-3.5 py-1.5 rounded-full bg-white/95 text-stone-900 text-xs font-semibold shadow-md flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif font-bold text-lg text-stone-900 mb-1.5 group-hover:text-brand-600 transition-colors line-clamp-1">
            {dish.name}
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed font-light line-clamp-2 mb-4">
            {dish.description || 'Prepared fresh to order using our heritage artisan hearth recipe.'}
          </p>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAdd}
          className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
            justAdded
              ? 'bg-emerald-500 text-white shadow-xs'
              : 'bg-brand-50 hover:bg-brand-500 text-brand-700 hover:text-white shadow-2xs'
          }`}
        >
          {justAdded ? (
            <>
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Added to Basket!</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Add to Basket</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
