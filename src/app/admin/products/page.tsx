'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/common/AppShell';
import { useDemoStore } from '@/stores/useDemoStore';
import { Layers, Search, Filter, AlertTriangle, ShieldCheck, Tag } from 'lucide-react';

export default function AdminProductsPage() {
  const { products, businesses } = useDemoStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.businessName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || p.categoryId === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <AppShell
      appType="admin"
      title="Platform Material Catalog Oversight"
      subtitle="Supervise construction materials, verified brand grades (e.g. Fe 550D, OPC 53), units of measure, and pricing compliance."
    >
      <div className="space-y-6">
        {/* Search & Filter */}
        <div className="bg-charcoal-900 border border-charcoal-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by product, brand, or yard..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-charcoal-800 border border-charcoal-700 text-xs text-white placeholder-charcoal-400 focus:outline-none focus:border-construction-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-charcoal-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-charcoal-800 border border-charcoal-700 text-xs text-white focus:outline-none focus:border-construction-500"
            >
              <option value="ALL">All Categories</option>
              <option value="cat-cement">Cement & Binders</option>
              <option value="cat-steel">TMT Steel & Rebar</option>
              <option value="cat-sand">Sand & Aggregates</option>
              <option value="cat-bricks">Bricks & AAC Blocks</option>
            </select>
          </div>
        </div>

        {/* Catalog Table */}
        <div className="bg-charcoal-900 border border-charcoal-800 rounded-xl overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-charcoal-850 border-b border-charcoal-800 text-charcoal-400 font-mono text-[10px] uppercase">
                <tr>
                  <th className="py-3 px-4">Material Specification</th>
                  <th className="py-3 px-4">Supplier Yard</th>
                  <th className="py-3 px-4">Grade & Brand</th>
                  <th className="py-3 px-4">Wholesale Rate</th>
                  <th className="py-3 px-4">Stock Ledger</th>
                  <th className="py-3 px-4">MOQ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-800">
                {filtered.map((product) => {
                  const isLow = product.availableStock <= product.lowStockThreshold;
                  return (
                    <tr key={product.id} className="hover:bg-charcoal-800/40 transition">
                      <td className="py-3 px-4">
                        <p className="font-bold text-white tracking-tight">{product.name}</p>
                        <p className="text-[10px] text-charcoal-400 font-mono mt-0.5">{product.categoryName}</p>
                      </td>

                      <td className="py-3 px-4 text-charcoal-300">{product.businessName}</td>

                      <td className="py-3 px-4 font-mono text-[11px]">
                        <span className="text-construction-400 font-semibold">{product.brand}</span>
                        <span className="block text-[10px] text-charcoal-400">{product.gradeSpecification}</span>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-white">
                        ₹{product.pricePerUnit.toLocaleString('en-IN')}{' '}
                        <span className="text-charcoal-400 font-normal text-[10px]">/ {product.unit}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`font-mono font-bold ${isLow ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {product.availableStock} {product.unit}
                        </span>
                        {product.reservedStock > 0 && (
                          <span className="block text-[10px] text-amber-400 font-mono">
                            ({product.reservedStock} reserved)
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 font-mono text-charcoal-300">
                        {product.minOrderQty} {product.unit}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

