'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChefHat, ShoppingBag, User, LogOut, Menu as MenuIcon, X, Clock, Bell } from 'lucide-react';
import { useAuthStore } from '../store/auth.store';
import { useCartStore } from '../store/cart.store';
import { useNotificationStore } from '../store/notification.store';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, client, logout } = useAuthStore();
  const { getItemCount, toggleCart } = useCartStore();
  const { unreadCount } = useNotificationStore();

  const cartCount = getItemCount();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Menu' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact Us' },
    { href: '/orders', label: 'My Orders' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-10 h-10 rounded-xl bg-brand-500 group-hover:bg-brand-600 transition-colors flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <ChefHat className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <span className="font-serif font-black text-2xl tracking-tight text-stone-900 group-hover:text-brand-600 transition-colors">
              Kitcheniano
            </span>
            <span className="block text-[10px] tracking-wider uppercase font-semibold text-stone-400">
              Artisan Kitchen & Store
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'text-brand-600 bg-brand-50/80 font-semibold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Icons & Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cart Trigger */}
          <button
            onClick={() => toggleCart(true)}
            className="relative p-2.5 rounded-xl border border-stone-200 hover:border-brand-300 hover:bg-brand-50/50 text-stone-700 hover:text-brand-600 transition-all"
            aria-label="Open Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-brand-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-xs animate-in zoom-in-75">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Account State */}
          {isAuthenticated && client ? (
            <div className="flex items-center gap-2">
              <Link
                href="/orders"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-stone-100 text-stone-800 text-xs font-medium transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs">
                  {client.firstName[0]}
                </div>
                <span className="truncate max-w-[100px]">{client.firstName}</span>
                {unreadCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
                )}
              </Link>

              <button
                onClick={logout}
                className="p-2.5 rounded-xl border border-stone-200 hover:border-rose-300 hover:bg-rose-50 text-stone-500 hover:text-rose-600 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-3.5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-100 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${
                pathname === link.href
                  ? 'bg-brand-50 text-brand-600 font-semibold'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {!isAuthenticated && (
            <div className="pt-3 border-t border-stone-100 grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl border border-stone-200 text-stone-800 text-xs font-semibold"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-brand-500 text-white text-xs font-semibold"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
