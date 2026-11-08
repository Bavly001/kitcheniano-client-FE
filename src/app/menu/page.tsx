'use client';

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, ShoppingBag, AlertCircle, RefreshCw } from 'lucide-react';
import { apiClient } from '../../lib/api-client';
import DishCard, { MenuItemData } from '../../components/DishCard';
import DishModal from '../../components/DishModal';

const CATEGORIES = [
  'All Dishes',
  'Wood-Fired Pizza',
  'Artisan Mains',
  'Fresh Starters',
  'Handmade Pasta',
  'Desserts & Beverages',
];

export default function MenuPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Dishes');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [selectedDish, setSelectedDish] = useState<MenuItemData | null>(null);

  // Fetch published menu items from client microservice
  const { data, isLoading, isError, error, refetch } = useQuery<{
    items: MenuItemData[];
    total: number;
  }>({
    queryKey: ['client-menu', searchTerm],
    queryFn: () => apiClient('/client/menu', { params: { search: searchTerm } }),
  });

  const dishes = data?.items || [];

  // Filter & sort dishes
  const filteredDishes = useMemo(() => {
    let result = [...dishes];

    // Category filter simulation based on name/description keywords
    if (selectedCategory !== 'All Dishes') {
      const catLower = selectedCategory.toLowerCase();
      if (catLower.includes('pizza')) {
        result = result.filter((d) => d.name.toLowerCase().includes('pizza') || d.description.toLowerCase().includes('pizza') || d.description.toLowerCase().includes('crust'));
      } else if (catLower.includes('starter')) {
        result = result.filter((d) => d.name.toLowerCase().includes('salad') || d.name.toLowerCase().includes('soup') || d.name.toLowerCase().includes('bread') || d.price < 15);
      } else if (catLower.includes('pasta')) {
        result = result.filter((d) => d.name.toLowerCase().includes('pasta') || d.name.toLowerCase().includes('spaghetti') || d.name.toLowerCase().includes('penne') || d.name.toLowerCase().includes('lasagna'));
      } else if (catLower.includes('dessert')) {
        result = result.filter((d) => d.name.toLowerCase().includes('tiramisu') || d.name.toLowerCase().includes('cake') || d.name.toLowerCase().includes('gelato') || d.name.toLowerCase().includes('tea') || d.name.toLowerCase().includes('coffee') || d.name.toLowerCase().includes('wine'));
      }
    }

    // Sort
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [dishes, selectedCategory, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 space-y-10">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
          Handcrafted To Order
        </span>
        <h1 className="font-serif font-black text-4xl sm:text-5xl text-stone-900 tracking-tight">
          Our Seasonal Food Menu
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
          Select from our daily wood-fired specials, crisp organic salads, and heritage Italian hearth dishes.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search dishes, ingredients, pizzas..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-brand-500 shadow-2xs transition-colors"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <SlidersHorizontal className="w-4 h-4 text-stone-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs font-medium text-stone-700 focus:outline-none focus:border-brand-500 shadow-2xs cursor-pointer"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-500 text-white font-semibold shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-600 hover:border-brand-300 hover:bg-brand-50/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Dishes Catalog Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs animate-pulse p-4 space-y-4"
            >
              <div className="aspect-[16/11] bg-stone-100 rounded-xl" />
              <div className="space-y-2">
                <div className="h-4 bg-stone-100 rounded w-3/4" />
                <div className="h-3 bg-stone-100 rounded w-full" />
              </div>
              <div className="h-9 bg-stone-100 rounded-xl" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-rose-200 max-w-md mx-auto space-y-4">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h3 className="font-serif font-bold text-lg text-stone-900">
            Could Not Load Menu
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            {(error as any)?.message || 'Please check your connection and try again.'}
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-xl bg-brand-500 text-white text-xs font-semibold flex items-center gap-2 mx-auto hover:bg-brand-600 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      ) : filteredDishes.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-stone-200/80 p-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8 stroke-1" />
          </div>
          <h3 className="font-serif font-semibold text-xl text-stone-900">
            No matching dishes found
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
            We couldn't find any dish matching your current filter. Try resetting your search terms.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All Dishes');
            }}
            className="px-5 py-2.5 rounded-xl bg-brand-500 text-white text-xs font-semibold hover:bg-brand-600 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDishes.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              onOpenModal={(d) => setSelectedDish(d)}
            />
          ))}
        </div>
      )}

      {/* Detail Dialog Modal */}
      <DishModal dish={selectedDish} onClose={() => setSelectedDish(null)} />
    </div>
  );
}
