'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChefHat, MapPin, Phone, Mail, Clock, Heart, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Brand & Philosophy */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white">
                <ChefHat className="w-6 h-6" />
              </div>
              <span className="font-serif font-black text-2xl text-white tracking-tight">
                Kitcheniano
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Handcrafted Mediterranean delicacies, wood-fired stone hearth recipes, and organic farm-to-table ingredients prepared with artisan passion.
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-400 font-medium pt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Kitchen Open & Accepting Orders</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-serif font-bold text-white text-base mb-4 tracking-wide">
              Explore
            </h3>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link href="/menu" className="hover:text-white transition-colors">
                  Signature Menu & Specials
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Our Culinary Heritage & Story
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Location, Hours & Reservations
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-white transition-colors">
                  Live Order Tracker
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  Your Basket & Checkout
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Hours & Address */}
          <div>
            <h3 className="font-serif font-bold text-white text-base mb-4 tracking-wide">
              Kitchen Hours
            </h3>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-400 shrink-0" />
                <span>Mon – Fri: 11:00 AM – 10:30 PM</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-400 shrink-0" />
                <span>Sat – Sun: 10:00 AM – 11:30 PM</span>
              </li>
              <li className="flex items-start gap-2 pt-2">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>142 Downtown Culinary Ave, Suite 100</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <span>+1 (555) 234-5678</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="font-serif font-bold text-white text-base mb-4 tracking-wide">
              Chef’s Table Newsletter
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed mb-4">
              Receive secret weekend seasonal recipes and exclusive customer discount offers.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 p-3 rounded-xl border border-emerald-800">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>You are subscribed to the Chef's Table!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-brand-500 transition-colors"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold transition-colors"
                >
                  Join Newsletter
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Kitcheniano Artisan Kitchen. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <span>Cooked with</span>
              <Heart className="w-3.5 h-3.5 text-brand-500 fill-brand-500" />
              <span>for food lovers</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
