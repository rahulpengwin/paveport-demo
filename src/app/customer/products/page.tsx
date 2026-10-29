'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/common/AppShell';
import { useDemoStore } from '@/stores/useDemoStore';
import { Product } from '@/types';
import { Package, Search, Filter, ShoppingCart, FileText, CheckCircle2 } from 'lucide-react';

export default function CustomerProductsPage() {
  const { products, addToCart, submitQuotationRequest, setDemoStep } = useDemoStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.businessName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || p.categoryId === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAdd = (p: Product) => {
    addToCart(p, p.minOrderQty);
    setToastMsg(`Added ${p.minOrderQty} ${p.unit} of ${p.name} to cart!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <AppShell
      appType="customer"
      title="Complete Construction Materials Catalog"
      subtitle="Compare materials across certified supplier yards, inspect IS certifications, and check live stock."
    >
      <div className="space-y-6">
        {toastMsg && (
          <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Search & Filter */}
        <div className="bg-charcoal-900 border border-charcoal-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search materials, grades, brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-charcoal-800 border border-charcoal-700 text-xs text-white placeholder-charcoal-400 focus:outline-none focus:border-construction-500"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-charcoal-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-charcoal-800 border border-charcoal-700 text-xs text-white focus:outline-none focus:border-construction-500"
            >
              <option value="ALL">All Categories ({products.length})</option>
              <option value="cat-cement">Cement & Binders</option>
              <option value="cat-steel">TMT Steel & Rebar</option>
              <option value="cat-sand">Sand & Fine Aggregates</option>
              <option value="cat-aggregates">Coarse Aggregates</option>
              <option value="cat-bricks">Bricks & AAC Blocks</option>
            </select>
          </div>
        </div>

        {/* Product Cards - Mobile Feed */}
        <div className="space-y-3">
          {filtered.map((prod) => (
            <div
              key={prod.id}
              className="p-4 rounded-2xl bg-charcoal-900 border border-charcoal-800 hover:border-charcoal-700 transition shadow-card space-y-3"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-[9px] font-mono font-bold text-construction-400 uppercase">
                    {prod.brand}
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-charcoal-800 text-charcoal-300">
                    {prod.availableStock} in stock
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white tracking-tight mt-0.5">{prod.name}</h4>
                <p className="text-[11px] text-charcoal-400 font-mono mt-0.5">{prod.gradeSpecification}</p>
                <p className="text-[10px] text-charcoal-500 mt-1 font-medium">Yard: {prod.businessName}</p>
              </div>

              <div className="pt-2 border-t border-charcoal-800 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-base font-bold font-mono text-white">
                    ₹{prod.pricePerUnit.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-charcoal-400 font-mono">per {prod.unit}</span>
                </div>

                <button
                  onClick={() => handleAdd(prod)}
                  className="w-full py-2.5 px-3 rounded-xl bg-construction-500 hover:bg-construction-400 active:scale-[0.98] text-charcoal-950 font-bold text-xs transition shadow-sm flex items-center justify-center space-x-1.5"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add {prod.minOrderQty} {prod.unit} to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

