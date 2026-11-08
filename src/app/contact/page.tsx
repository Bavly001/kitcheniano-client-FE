'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
    }
  };

  return (
    <div className="space-y-16 py-12 pb-24">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold">
          <MessageSquare className="w-3.5 h-3.5 text-brand-600" />
          <span>We'd Love to Hear From You</span>
        </div>
        <h1 className="font-serif font-black text-4xl sm:text-5xl text-stone-900 tracking-tight">
          Get in Touch with Our Kitchen
        </h1>
        <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto leading-relaxed font-light">
          Have a question about our menu, dietary requirements, or private catering? Send us a note or stop by our downtown location.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-xl text-stone-900">
                Restaurant & Kitchen
              </h3>

              <div className="space-y-4 text-xs text-stone-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-stone-900">Address</div>
                    <div>142 Downtown Culinary Ave, Suite 100, New York, NY 10001</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-stone-900">Phone Order Support</div>
                    <div>+1 (555) 234-5678</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-stone-900">Email Inquiries</div>
                    <div>orders@kitcheniano.com</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-xl text-stone-900">
                Kitchen Opening Hours
              </h3>
              <div className="space-y-2 text-xs text-stone-600">
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="font-medium text-stone-800">Monday – Thursday</span>
                  <span>11:00 AM – 10:30 PM</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="font-medium text-stone-800">Friday</span>
                  <span>11:00 AM – 11:30 PM</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="font-medium text-stone-800">Saturday</span>
                  <span>10:00 AM – 11:30 PM</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-medium text-stone-800">Sunday</span>
                  <span>10:00 AM – 10:00 PM</span>
                </div>
              </div>
            </div>

            {/* Simulated Map Visual */}
            <div className="rounded-2xl overflow-hidden border border-stone-200/80 aspect-[16/9] bg-stone-100 relative flex items-center justify-center text-center p-6 shadow-xs">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center mx-auto shadow-md">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-stone-900">Downtown Kitcheniano Hearth</div>
                <div className="text-[11px] text-stone-500">Fast 3-mile delivery zone radius</div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-stone-200/80 shadow-sm">
            {submitted ? (
              <div className="py-16 text-center space-y-4 animate-in fade-in-50">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-black text-2xl text-stone-900">
                  Message Sent to Our Kitchen!
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                  Thank you, {formData.name}. Our hospitality team has received your message and will reply within 2 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      subject: 'General Inquiry',
                      message: '',
                    });
                  }}
                  className="px-6 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="font-serif font-black text-2xl text-stone-900 mb-1">
                    Send Us a Message
                  </h3>
                  <p className="text-xs text-stone-500 font-light">
                    Fill out the form below and we will get back to you promptly.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-brand-500 transition-colors bg-stone-50/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-brand-500 transition-colors bg-stone-50/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-brand-500 transition-colors bg-stone-50/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700">Topic / Inquiry</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-brand-500 transition-colors bg-stone-50/50"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Allergy & Dietary Information">Allergy & Dietary Information</option>
                      <option value="Private Event & Catering">Private Event & Catering</option>
                      <option value="Feedback & Praise">Feedback & Praise</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">Your Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us how we can help you..."
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-brand-500 transition-colors bg-stone-50/50 resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message to Kitchen</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
