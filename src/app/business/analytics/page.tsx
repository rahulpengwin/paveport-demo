'use client';

import React from 'react';
import { AppShell } from '@/components/common/AppShell';
import { useDemoStore } from '@/stores/useDemoStore';
import { BarChart3, TrendingUp, Package, Layers } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function BusinessAnalyticsPage() {
  const { activeBusinessId, businesses, orders, products } = useDemoStore();
  const business = businesses.find((b) => b.id === activeBusinessId) || businesses[0];
  const storeOrders = orders.filter((o) => o.businessId === business.id);
  const revenue = storeOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const data = [
    { name: 'OPC 53 Cement', units: 480 },
    { name: 'PPC Cement', units: 240 },
    { name: 'M-Sand 20T', units: 80 },
    { name: '20mm Aggregate', units: 60 },
  ];

  return (
    <AppShell
      appType="business"
      title={`${business.name} — Store Analytics`}
      subtitle="Analyze material velocity, bulk turnover, and contractor reorder frequency."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-800">
            <span className="text-[10px] font-mono uppercase text-charcoal-400">Total Store Turnover</span>
            <p className="text-xl font-bold text-white mt-1 font-mono">₹{revenue.toLocaleString('en-IN')}</p>
          </div>
          <div className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-800">
            <span className="text-[10px] font-mono uppercase text-charcoal-400">Total Fulfilled Orders</span>
            <p className="text-xl font-bold text-construction-400 mt-1 font-mono">{storeOrders.length}</p>
          </div>
          <div className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-800">
            <span className="text-[10px] font-mono uppercase text-charcoal-400">Store Rating</span>
            <p className="text-xl font-bold text-amber-400 mt-1 font-mono">{business.rating} ★ ({business.reviewCount} reviews)</p>
          </div>
        </div>

        <div className="bg-charcoal-900 border border-charcoal-800 rounded-xl p-5 shadow-card">
          <h3 className="text-sm font-bold text-white mb-1">Top Material Outflow (Units Sold)</h3>
          <p className="text-xs text-charcoal-400 mb-4">Volume dispatched this calendar month</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222931" />
                <XAxis dataKey="name" stroke="#606F80" fontSize={11} />
                <YAxis stroke="#606F80" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#171C22', borderColor: '#323C47', borderRadius: '8px' }}
                  labelStyle={{ color: '#F8FAFC' }}
                />
                <Bar dataKey="units" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

