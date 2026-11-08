'use client';

import React from 'react';
import Link from 'next/link';
import { ChefHat, Flame, Leaf, Award, Heart, ArrowRight } from 'lucide-react';

const TEAM = [
  {
    name: 'Chef Antonio Ricci',
    role: 'Executive Chef & Founder',
    bio: 'Born in Naples with 20+ years of sourdough and wood-fired hearth mastery across Italy and New York.',
    imageUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=500&q=80',
  },
  {
    name: 'Chef Clara Moretti',
    role: 'Head Pastry & Pasta Artisan',
    bio: 'Specialist in heritage durum wheat pasta extrusion and slow-chilled artisan Italian desserts.',
    imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=500&q=80',
  },
  {
    name: 'Mateo Bellini',
    role: 'Sommelier & Farm Partner Lead',
    bio: 'Oversees direct sourcing from local organic farmers, sustainable olive groves, and heritage vineyards.',
    imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=500&q=80',
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-24 py-12 pb-24">
      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold">
          <ChefHat className="w-3.5 h-3.5 text-brand-600" />
          <span>Our Story & Craft</span>
        </div>
        <h1 className="font-serif font-black text-4xl sm:text-5xl text-stone-900 tracking-tight">
          Where Ancient Hearth Traditions Meet Modern Culinary Craft
        </h1>
        <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed font-light">
          Founded on the simple belief that food should be honest, seasonal, and prepared with the warmth of a true family kitchen.
        </p>
      </section>

      {/* Story & Heritage Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              The Journey
            </span>
            <h2 className="font-serif font-black text-3xl text-stone-900 leading-snug">
              From a Humble Stone Oven to a Vibrant Community Table
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
              Kitcheniano began with a single vision: bringing the authentic warmth of Mediterranean hearth cooking into an accessible, contemporary online experience. We built our custom brick oven using volcanic stone to reach the 450°C temperatures necessary for true leopard-spotted Neapolitan crusts.
            </p>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
              Every morning at 5:00 AM, our bakers blend organic unbleached flour, pure mountain spring water, and our 14-year-old sourdough starter. The dough is slowly cold-fermented for 48 hours to develop complex aromas and effortless digestibility.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-white border border-stone-200">
                <div className="font-serif font-bold text-2xl text-brand-600">48 Hours</div>
                <div className="text-xs text-stone-500">Slow Cold Fermentation</div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-stone-200">
                <div className="font-serif font-bold text-2xl text-brand-600">450°C</div>
                <div className="text-xs text-stone-500">Volcanic Stone Oven</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-stone-100">
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80"
                alt="Chef preparing artisan pizza dough"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Culinary Values */}
      <section className="bg-stone-100/70 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="font-serif font-black text-3xl text-stone-900">
              Our Inflexible Standards
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <Leaf className="w-8 h-8 text-emerald-600" />
              <h3 className="font-serif font-bold text-lg text-stone-900">Zero Shortcuts</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                We make our stocks from roasted bones and simmer our sauces for eight hours. No powdered flavorings, food colorants, or frozen doughs.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <Award className="w-8 h-8 text-brand-600" />
              <h3 className="font-serif font-bold text-lg text-stone-900">D.O.P. Certified Imports</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                San Marzano tomatoes from the slopes of Mount Vesuvius, authentic Parmigiano-Reggiano, and cold-pressed extra virgin olive oil.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <Heart className="w-8 h-8 text-rose-500" />
              <h3 className="font-serif font-bold text-lg text-stone-900">Community Respect</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                We donate surplus fresh meals to local food shelters and run on 100% compostable, eco-friendly delivery packaging.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Passionate Artisans
          </span>
          <h2 className="font-serif font-black text-3xl text-stone-900 mt-1">
            Meet Our Culinary Leaders
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TEAM.map((member, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="aspect-square bg-stone-100 overflow-hidden">
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-serif font-bold text-lg text-stone-900 mb-0.5">
                  {member.name}
                </h3>
                <div className="text-xs font-semibold text-brand-600 mb-3">{member.role}</div>
                <p className="text-xs text-stone-600 leading-relaxed font-light">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
