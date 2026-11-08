'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  ChefHat,
  ArrowRight,
  Flame,
  Leaf,
  Clock,
  Star,
  CheckCircle2,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { useCartStore } from '../store/cart.store';
import { apiClient } from '../lib/api-client';
import { resolveImageUrl, formatCurrency } from '../lib/utils';
import { MenuItemData } from '../components/DishCard';

const FALLBACK_FEATURED_DISHES = [
  {
    id: 3,
    name: 'Margherita Pizza',
    category: 'Wood-Fired Pizza',
    price: 12.0,
    description: 'Classic Neapolitan pizza with plum tomato sauce, fresh mozzarella, and olive oil.',
    imageUrl: '/uploads/b2/menu-items%2F1794152051826-6d2d72f961a6712a.jpg',
    tag: 'Bestseller',
  },
  {
    id: 10,
    name: 'Quattro Formaggi Pizza',
    category: 'Wood-Fired Pizza',
    price: 15.5,
    description: 'Artisan blend of fior di latte mozzarella, gorgonzola dolce, aged parmigiano-reggiano, and ricotta.',
    imageUrl: '/uploads/b2/menu-items%2F1794153089841-26a26c2d5504d7f4.jpg',
    tag: 'Chef Special',
  },
  {
    id: 12,
    name: 'Truffle Mushroom Risotto',
    category: 'Artisan Selection',
    price: 18.0,
    description: 'Creamy Carnaroli arborio rice slowly simmered in white wine broth with forest mushrooms and black truffle butter.',
    imageUrl: '/uploads/b2/menu-items%2F1794153091746-3dce8e19485a1d09.jpg',
    tag: 'Seasonal Fresh',
  },
];

const REVIEWS = [
  {
    name: 'Elena Rostova',
    role: 'Food Blogger',
    comment:
      'The Margherita crust has an incredible airy texture and authentic wood-fired char. The real-time order tracking feature was so convenient!',
    rating: 5,
  },
  {
    name: 'Marcus Vance',
    role: 'Loyal Customer',
    comment:
      'Ordering online was effortless. The meal arrived piping hot within 25 minutes. Fresh ingredients you can truly taste in every bite.',
    rating: 5,
  },
  {
    name: 'Sophia Chen',
    role: 'Verified Customer',
    comment:
      'The Greek salad feta is unbelievable. Clean website, persistent cart, and immediate notification when the chef started cooking.',
    rating: 5,
  },
];

export default function HomePage() {
  const { addItem, toggleCart } = useCartStore();

  // Load real dishes dynamically from client menu API
  const { data } = useQuery<{ items: MenuItemData[] }>({
    queryKey: ['client-menu-featured'],
    queryFn: () => apiClient('/client/menu'),
  });

  const featuredDishes = useMemo(() => {
    if (data?.items && data.items.length > 0) {
      const seen = new Set<string>();
      const unique = data.items.filter((item) => {
        const lower = item.name.toLowerCase();
        if (seen.has(lower)) return false;
        seen.add(lower);
        return true;
      });

      return unique.slice(0, 3).map((item, idx) => {
        const lower = item.name.toLowerCase();
        const category = lower.includes('pizza')
          ? 'Wood-Fired Pizza'
          : lower.includes('salad')
          ? 'Fresh Starters'
          : lower.includes('burger')
          ? 'Artisan Mains'
          : 'Artisan Selection';

        const tag = idx === 0 ? 'Bestseller' : idx === 1 ? 'Chef Special' : 'Artisan Choice';

        return {
          id: item.id,
          name: item.name,
          category,
          price: Number(item.price),
          description: item.description,
          imageUrl: item.imageUrl || FALLBACK_FEATURED_DISHES[idx % FALLBACK_FEATURED_DISHES.length].imageUrl,
          tag,
        };
      });
    }

    return FALLBACK_FEATURED_DISHES;
  }, [data]);

  const handleQuickAdd = (dish: {
    id: number;
    name: string;
    price: number;
    description: string;
    imageUrl?: string | null;
  }) => {
    addItem(dish, 1);
    toggleCart(true);
  };

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/50 via-[#fefbf6] to-[#fefbf6] pt-12 sm:pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100 text-brand-800 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>Wood-Fired & Farm-to-Table Daily</span>
              </div>

              <h1 className="font-serif font-black text-4xl sm:text-5xl lg:text-6xl text-stone-900 tracking-tight leading-[1.12]">
                Crafted with Passion,{' '}
                <span className="text-brand-500 italic">Served with Warmth.</span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                Discover artisan wood-fired pizzas, handcrafted Mediterranean pastas, and seasonal organic harvests prepared by master chefs and delivered fresh to your door.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  href="/menu"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25 transition-all"
                >
                  <span>Explore Menu & Order</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/orders"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-stone-300 hover:border-brand-500 hover:bg-white text-stone-800 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <Clock className="w-4 h-4 text-brand-600" />
                  <span>Track Live Order</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-8 border-t border-stone-200/60 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <div className="font-serif font-bold text-2xl text-stone-900">4.9 / 5</div>
                  <div className="text-xs text-stone-500 flex items-center justify-center lg:justify-start gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>500+ Reviews</span>
                  </div>
                </div>
                <div>
                  <div className="font-serif font-bold text-2xl text-stone-900">25–35m</div>
                  <div className="text-xs text-stone-500">Average Delivery</div>
                </div>
                <div>
                  <div className="font-serif font-bold text-2xl text-stone-900">100%</div>
                  <div className="text-xs text-stone-500">Organic Sourced</div>
                </div>
              </div>
            </div>

            {/* Right Ambient Dish Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-100">
                  <img
                    src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
                    alt="Kitcheniano Artisan Kitchen Interior"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating Highlight Card */}
                <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-white rounded-2xl p-4 shadow-xl border border-stone-100 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600">
                    <Flame className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">Wood-Fired Hearth</div>
                    <div className="text-[11px] text-stone-500">Stone oven heated to 450°C</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Chef Specials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 text-center sm:text-left">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">
              Handcrafted Daily
            </div>
            <h2 className="font-serif font-black text-3xl sm:text-4xl text-stone-900">
              Chef’s Signature Dishes
            </h2>
          </div>
          <Link
            href="/menu"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
          >
            <span>View Complete Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredDishes.map((dish) => (
            <div
              key={dish.id}
              className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden">
                {resolveImageUrl(dish.imageUrl) ? (
                  <img
                    src={resolveImageUrl(dish.imageUrl)!}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-300">
                    <ShoppingBag className="w-10 h-10 stroke-1" />
                  </div>
                )}
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-stone-800 text-[11px] font-bold shadow-xs">
                  {dish.tag}
                </span>
                <span className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-stone-900/85 backdrop-blur-sm text-white text-sm font-bold">
                  {formatCurrency(dish.price)}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-brand-600 uppercase tracking-wider mb-1">
                    {dish.category}
                  </div>
                  <h3 className="font-serif font-bold text-xl text-stone-900 mb-2">
                    {dish.name}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed font-light mb-6">
                    {dish.description}
                  </p>
                </div>

                <button
                  onClick={() => handleQuickAdd(dish)}
                  className="w-full py-2.5 px-4 rounded-xl bg-brand-50 hover:bg-brand-500 text-brand-700 hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Basket</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Kitcheniano Value Pillars */}
      <section className="bg-stone-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
              Our Core Standards
            </span>
            <h2 className="font-serif font-black text-3xl sm:text-4xl text-white mt-1 mb-4">
              Why Food Lovers Choose Kitcheniano
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 font-light leading-relaxed">
              We believe great food starts with authentic ingredients, master craftsmanship, and transparent service from kitchen hearth to your table.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-stone-800/60 border border-stone-700/60 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-xl text-white">Farm-to-Table Fresh</h3>
              <p className="text-xs text-stone-400 leading-relaxed font-light">
                We partner with certified organic local growers. Zero artificial additives, chemical preservatives, or frozen bases.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-stone-800/60 border border-stone-700/60 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-xl text-white">Wood-Fired Stone Oven</h3>
              <p className="text-xs text-stone-400 leading-relaxed font-light">
                Baked in our custom Italian hearth with olive wood and oak to impart an unmistakable authentic smoky aroma.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-stone-800/60 border border-stone-700/60 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-xl text-white">Live Kitchen Tracking</h3>
              <p className="text-xs text-stone-400 leading-relaxed font-light">
                Follow your dish in real time via live SSE updates as it moves from order receipt to kitchen preparation and delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Guest Praise
          </span>
          <h2 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 mt-1">
            Loved by Culinary Enthusiasts
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((rev, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-xs text-stone-600 leading-relaxed italic mb-6">
                  "{rev.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
                <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center">
                  {rev.name[0]}
                </div>
                <div>
                  <div className="font-bold text-xs text-stone-900">{rev.name}</div>
                  <div className="text-[10px] text-stone-400">{rev.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-brand-500 text-white p-8 sm:p-14 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left z-10 max-w-xl">
            <h2 className="font-serif font-black text-3xl sm:text-4xl text-white">
              Ready for an extraordinary meal?
            </h2>
            <p className="text-xs sm:text-sm text-brand-100 font-light leading-relaxed">
              Order today and experience the warmth of true artisan Mediterranean culinary craft.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto z-10">
            <Link
              href="/menu"
              className="px-8 py-3.5 rounded-xl bg-white text-brand-600 hover:bg-stone-50 font-bold text-sm text-center shadow-lg transition-all"
            >
              Order Online Now
            </Link>
          </div>

          {/* Decorative Background Circles */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-brand-600/40 pointer-events-none" />
          <div className="absolute -left-20 -top-20 w-60 h-60 rounded-full bg-brand-400/30 pointer-events-none" />
        </div>
      </section>
    </div>
  );
}
