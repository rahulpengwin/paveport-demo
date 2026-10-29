'use client';

import React from 'react';
import { AppShell } from '@/components/common/AppShell';
import { KpiCard } from '@/components/common/KpiCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useDemoStore } from '@/stores/useDemoStore';
import Link from 'next/link';
import {
  Package,
  Layers,
  FileText,
  Truck,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function BusinessOverviewPage() {
  const { activeBusinessId, businesses, products, orders, quotations } = useDemoStore();

  const business = businesses.find((b) => b.id === activeBusinessId) || businesses[0];
  const storeProducts = products.filter((p) => p.businessId === business.id);
  const storeOrders = orders.filter((o) => o.businessId === business.id);
  const storeQuotes = quotations.filter((q) => q.businessId === business.id);

  const pendingOrders = storeOrders.filter((o) => o.status === 'PLACED').length;
  const readyForDispatchOrders = storeOrders.filter((o) => o.status === 'READY_FOR_DISPATCH').length;
  const pendingQuotes = storeQuotes.filter((q) => q.status === 'SUBMITTED').length;
  const storeRevenue = storeOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const lowStockCount = storeProducts.filter((p) => p.availableStock <= p.lowStockThreshold).length;

  return (
    <AppShell
      appType="business"
      title={`${business.name} — Yard Operations`}
      subtitle={`Verified Store (${business.verificationStatus}) • Operating Hours: ${business.operatingHours}`}
      action={
        <Link
          href="/business/products"
          className="px-3.5 py-1.5 rounded-lg bg-construction-500 hover:bg-construction-400 text-charcoal-950 font-bold text-xs transition flex items-center space-x-1.5 shadow-sm"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Add New Material SKU</span>
        </Link>
      }
    >
      <div className="space-y-4">
        {/* KPI Grid in Phone (2x2) */}
        <div className="grid grid-cols-2 gap-2.5">
          <KpiCard
            title="Active Orders"
            value={storeOrders.length}
            subtitle={`${pendingOrders} awaiting`}
            icon={Package}
            accentColor="amber"
          />

          <KpiCard
            title="Yard Revenue"
            value={`₹${(storeRevenue / 1000).toFixed(0)}k`}
            subtitle="Gross volume"
            icon={TrendingUp}
            accentColor="emerald"
          />

          <KpiCard
            title="Quotes Pending"
            value={pendingQuotes}
            subtitle="Estimates to send"
            icon={FileText}
            accentColor="blue"
          />

          <KpiCard
            title="Stock Catalog"
            value={`${storeProducts.length} SKUs`}
            subtitle={`${lowStockCount} low stock`}
            icon={Layers}
            accentColor="charcoal"
          />
        </div>

        {/* Quick Action Alerts */}
        <div className="space-y-2.5">
          {pendingQuotes > 0 && (
            <div className="p-3.5 rounded-xl bg-charcoal-900 border border-blue-500/40 flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {pendingQuotes} Quote Request{pendingQuotes > 1 ? 's' : ''}
                  </h4>
                  <p className="text-[10px] text-charcoal-400">Contractors awaiting bulk rate</p>
                </div>
              </div>
              <Link
                href="/business/quotations"
                className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold transition flex items-center space-x-1"
              >
                <span>Respond</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}

          {pendingOrders > 0 && (
            <div className="p-3.5 rounded-xl bg-charcoal-900 border border-construction-500/40 flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-construction-500/10 border border-construction-500/20 text-construction-400">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {pendingOrders} Order{pendingOrders > 1 ? 's' : ''} Awaiting
                  </h4>
                  <p className="text-[10px] text-charcoal-400">Accept to pack warehouse stock</p>
                </div>
              </div>
              <Link
                href="/business/orders"
                className="px-2.5 py-1.5 rounded-lg bg-construction-500 hover:bg-construction-400 text-charcoal-950 text-[11px] font-bold transition flex items-center space-x-1"
              >
                <span>Review</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>

        {/* Store Catalog & Inventory Summary - Mobile Cards */}
        <div className="space-y-2">
          <div className="flex items-center justify-between pt-1">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Yard Catalog SKUs</h3>
            <Link href="/business/inventory" className="text-[10px] text-construction-400 font-semibold hover:underline flex items-center">
              <span>Manage Stock</span>
              <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
            </Link>
          </div>

          <div className="space-y-2">
            {storeProducts.map((p) => {
              const isLow = p.availableStock <= p.lowStockThreshold;
              return (
                <div
                  key={p.id}
                  className="p-3 rounded-xl bg-charcoal-900 border border-charcoal-800 space-y-2 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-construction-400 font-bold uppercase">{p.brand}</span>
                      <h4 className="text-xs font-bold text-white leading-tight">{p.name}</h4>
                      <p className="text-[10px] text-charcoal-400 font-mono mt-0.5">{p.gradeSpecification}</p>
                    </div>
                    {isLow ? (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-rose-950/60 text-rose-400 border border-rose-800">
                        LOW
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                        IN STOCK
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-charcoal-800/60 text-xs">
                    <span className="font-mono font-bold text-white">
                      ₹{p.pricePerUnit.toLocaleString('en-IN')}{' '}
                      <span className="text-charcoal-400 font-normal text-[10px]">/{p.unit.split(' ')[0]}</span>
                    </span>

                    <span className="font-mono text-[11px] text-charcoal-300">
                      Avail: <strong className="text-emerald-400">{p.availableStock}</strong>{' '}
                      <span className="text-charcoal-500 font-normal">({p.reservedStock} rsvd)</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

