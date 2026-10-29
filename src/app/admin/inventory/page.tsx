'use client';

import React from 'react';
import { AppShell } from '@/components/common/AppShell';
import { useDemoStore } from '@/stores/useDemoStore';
import { Package, AlertTriangle, Layers, ArrowUpRight, History } from 'lucide-react';

export default function AdminInventoryPage() {
  const { products, inventoryMovements } = useDemoStore();

  const lowStock = products.filter((p) => p.availableStock <= p.lowStockThreshold);
  const totalReserved = products.reduce((acc, p) => acc + p.reservedStock, 0);

  return (
    <AppShell
      appType="admin"
      title="Platform Inventory & Stock Discrepancy Oversight"
      subtitle="Monitor stock availability across multi-tenant yards, active reservations, and automated low-stock warnings."
    >
      <div className="space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-800">
            <span className="text-[10px] font-mono uppercase text-charcoal-400">Total Tracked SKUs</span>
            <p className="text-2xl font-bold text-white mt-1 font-mono">{products.length} Products</p>
            <p className="text-xs text-charcoal-400 mt-0.5">Across all registered yards</p>
          </div>

          <div className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-800">
            <span className="text-[10px] font-mono uppercase text-charcoal-400">Low Stock Discrepancies</span>
            <p className="text-2xl font-bold text-rose-400 mt-1 font-mono">{lowStock.length} SKUs Alert</p>
            <p className="text-xs text-charcoal-400 mt-0.5">Stock below configured safety threshold</p>
          </div>

          <div className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-800">
            <span className="text-[10px] font-mono uppercase text-charcoal-400">Active Order Reservations</span>
            <p className="text-2xl font-bold text-amber-400 mt-1 font-mono">{totalReserved} Units Held</p>
            <p className="text-xs text-charcoal-400 mt-0.5">Committed to live unfulfilled orders</p>
          </div>
        </div>

        {/* Stock Ledger */}
        <div className="bg-charcoal-900 border border-charcoal-800 rounded-xl overflow-hidden shadow-card">
          <div className="p-4 border-b border-charcoal-800 flex items-center justify-between bg-charcoal-850">
            <div>
              <h3 className="text-sm font-bold text-white">Consolidated Yard Stock Ledger</h3>
              <p className="text-xs text-charcoal-400">Physical stock vs. committed reserved quantities</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-charcoal-900 border-b border-charcoal-800 text-charcoal-400 font-mono text-[10px] uppercase">
                <tr>
                  <th className="py-3 px-4">Item & Specification</th>
                  <th className="py-3 px-4">Supplier Yard</th>
                  <th className="py-3 px-4">Available</th>
                  <th className="py-3 px-4">Reserved</th>
                  <th className="py-3 px-4">Threshold</th>
                  <th className="py-3 px-4">Health Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-800">
                {products.map((p) => {
                  const isLow = p.availableStock <= p.lowStockThreshold;
                  return (
                    <tr key={p.id} className="hover:bg-charcoal-800/40 transition">
                      <td className="py-3 px-4">
                        <p className="font-bold text-white">{p.name}</p>
                        <p className="text-[10px] text-charcoal-400 font-mono">{p.gradeSpecification}</p>
                      </td>
                      <td className="py-3 px-4 text-charcoal-300">{p.businessName}</td>
                      <td className="py-3 px-4 font-mono font-bold text-white">
                        {p.availableStock} {p.unit}
                      </td>
                      <td className="py-3 px-4 font-mono text-amber-400">
                        {p.reservedStock} {p.unit}
                      </td>
                      <td className="py-3 px-4 font-mono text-charcoal-400">
                        {p.lowStockThreshold} {p.unit}
                      </td>
                      <td className="py-3 px-4">
                        {isLow ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-950/60 text-rose-400 border border-rose-800">
                            LOW STOCK
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                            OPTIMAL
                          </span>
                        )}
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

