'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/common/AppShell';
import { useDemoStore } from '@/stores/useDemoStore';
import Link from 'next/link';
import {
  Search,
  MapPin,
  Building2,
  Package,
  ShieldCheck,
  Star,
  Clock,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export default function CustomerHomePage() {
  const { businesses, products, categories, locations, addToCart, setDemoStep } = useDemoStore();
  const [selectedPincode, setSelectedPincode] = useState('560038');
  const [searchQuery, setSearchQuery] = useState('');

  const approvedBusinesses = businesses.filter((b) => b.verificationStatus === 'APPROVED');
  const featuredProducts = products.filter((p) => p.isFeatured || p.pricePerUnit > 300).slice(0, 4);

  return (
    <AppShell
      appType="customer"
      title="Construction Material Procurement Marketplace"
      subtitle="Discover verified suppliers, compare certified grades, and order direct to site."
    >
      <div className="space-y-8">
        {/* Step 3 Demo Guidance Banner */}
        <div className="p-4 rounded-xl bg-construction-950/40 border border-construction-500/30 text-xs text-construction-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-4 h-4 text-construction-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white font-bold block mb-0.5">Demo Milestone Step 3:</strong>
              <span>
                Acting as contractor <strong>Ramesh Kumar</strong>, discover approved supplier <strong>Sri Lakshmi Cement</strong>, add 100 bags of UltraTech Cement to cart, and request a formal quotation!
              </span>
            </div>
          </div>
          <Link
            href="/customer/stores/biz-lakshmi"
            className="px-3.5 py-1.5 rounded-lg bg-construction-500 hover:bg-construction-400 text-charcoal-950 font-bold text-xs shrink-0 transition flex items-center space-x-1"
          >
            <span>Open Sri Lakshmi Store</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Hero Search & Location Bar */}
        <div className="rounded-2xl bg-gradient-to-r from-charcoal-900 via-charcoal-850 to-charcoal-900 border border-charcoal-800 p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2 text-xs">
              <MapPin className="w-4 h-4 text-construction-400" />
              <span className="text-charcoal-400">Delivering to:</span>
              <select
                value={selectedPincode}
                onChange={(e) => setSelectedPincode(e.target.value)}
                className="bg-charcoal-800 border border-charcoal-700 rounded-lg px-2.5 py-1 text-white font-mono font-bold focus:outline-none focus:border-construction-500"
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.pincode}>
                    {loc.city} ({loc.pincode}) — {loc.district}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-xs text-charcoal-400 font-mono hidden sm:inline">
              Verified Yards &bull; Haulage within 3 to 6 hrs
            </span>
          </div>

          <div className="relative">
            <Search className="w-5 h-5 text-charcoal-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search cement bags, Fe 550D rebar steel, M-sand, 20mm aggregates, bricks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-charcoal-950 border border-charcoal-700 text-sm text-white placeholder-charcoal-400 focus:outline-none focus:border-construction-500 shadow-inner"
            />
          </div>
        </div>

        {/* Construction Material Categories - Mobile 4-Column Grid */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Material Categories
            </h3>
            <Link href="/customer/products" className="text-[11px] text-construction-400 hover:underline">
              See All &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {categories.slice(0, 8).map((cat) => (
              <Link
                key={cat.id}
                href={`/customer/products?category=${cat.id}`}
                className="p-2.5 rounded-xl bg-charcoal-900 border border-charcoal-800 hover:border-construction-500/60 active:scale-95 transition text-center space-y-1 group"
              >
                <div className="w-8 h-8 rounded-lg bg-charcoal-850 flex items-center justify-center text-construction-400 mx-auto group-hover:scale-110 transition-transform">
                  <Package className="w-4 h-4" />
                </div>
                <p className="text-[11px] font-semibold text-white truncate">{cat.name.split(' ')[0]}</p>
                <p className="text-[9px] text-charcoal-500 font-mono">{cat.uomOptions[0]}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recommended Verified Suppliers - Mobile Card List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Verified Nearby Yards
              </h3>
              <p className="text-[11px] text-charcoal-400">Direct from GSTIN verified stockyards</p>
            </div>
            <Link href="/customer/stores" className="text-[11px] text-construction-400 hover:underline flex items-center">
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {approvedBusinesses.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-2xl bg-charcoal-900 border border-charcoal-800 hover:border-charcoal-700 transition shadow-card space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight">
                      {b.name}
                    </h4>
                    <p className="text-[11px] text-charcoal-400 flex items-center mt-0.5">
                      <MapPin className="w-3 h-3 mr-1 text-charcoal-500" />
                      {b.address.locality}, {b.address.city}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800 shrink-0">
                    VERIFIED
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-charcoal-300 pt-2 border-t border-charcoal-800">
                  <span className="text-amber-400 font-bold flex items-center">
                    <Star className="w-3.5 h-3.5 mr-1 fill-amber-400" />
                    {b.rating}
                  </span>
                  <span className="text-charcoal-500">&bull;</span>
                  <span>{b.estimatedDeliveryHours} delivery</span>
                  <span className="text-charcoal-500">&bull;</span>
                  <span className="text-charcoal-400">Min: ₹{b.minOrderValue.toLocaleString('en-IN')}</span>
                </div>

                <Link
                  href={`/customer/stores/${b.id}`}
                  className="w-full py-2 px-3 rounded-xl bg-charcoal-800 hover:bg-construction-500 hover:text-charcoal-950 active:scale-[0.98] text-white font-semibold text-xs transition flex items-center justify-center space-x-1 border border-charcoal-700"
                >
                  <span>Explore Yard Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Construction Materials - Mobile List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              High-Velocity Materials
            </h3>
            <Link href="/customer/products" className="text-[11px] text-construction-400 hover:underline">
              See All &rarr;
            </Link>
          </div>

          <div className="space-y-2.5">
            {featuredProducts.map((prod) => (
              <div
                key={prod.id}
                className="p-3.5 rounded-xl bg-charcoal-900 border border-charcoal-800 hover:border-charcoal-700 transition shadow-card flex items-center justify-between gap-3"
              >
                <div className="space-y-0.5 min-w-0 flex-1">
                  <span className="text-[9px] font-mono font-bold text-construction-400 uppercase">
                    {prod.brand}
                  </span>
                  <h4 className="text-xs font-bold text-white truncate">{prod.name}</h4>
                  <p className="text-[10px] text-charcoal-400 font-mono truncate">{prod.gradeSpecification}</p>
                  <p className="text-[11px] font-mono font-bold text-white pt-0.5">
                    ₹{prod.pricePerUnit.toLocaleString('en-IN')} <span className="text-[10px] text-charcoal-400 font-normal">/ {prod.unit}</span>
                  </p>
                </div>

                <button
                  onClick={() => {
                    addToCart(prod, prod.minOrderQty);
                  }}
                  className="py-1.5 px-3 rounded-lg bg-charcoal-800 hover:bg-construction-500 hover:text-charcoal-950 active:scale-95 text-white font-bold text-xs transition flex items-center space-x-1 border border-charcoal-700 shrink-0"
                >
                  <span>+ Add {prod.minOrderQty}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

