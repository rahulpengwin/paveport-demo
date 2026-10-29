'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/common/AppShell';
import { useDemoStore } from '@/stores/useDemoStore';
import {
  BarChart3,
  Download,
  Calendar,
  Filter,
  TrendingUp,
  PieChart,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';

export default function AdminReportsPage() {
  const { orders, quotations, businesses } = useDemoStore();
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const totalGmv = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalTax = orders.reduce((sum, o) => sum + o.taxAmount, 0);

  const salesTrend = [
    { month: 'Oct 01', revenue: 145000, deliveries: 12 },
    { month: 'Oct 07', revenue: 210000, deliveries: 18 },
    { month: 'Oct 14', revenue: 185000, deliveries: 15 },
    { month: 'Oct 21', revenue: 320000, deliveries: 26 },
    { month: 'Oct 28', revenue: Math.max(250000, totalGmv), deliveries: 22 },
  ];

  const categoryPerformance = [
    { name: 'Cement & Binders', value: 42, revenue: 162000 },
    { name: 'TMT Rebar Steel', value: 34, revenue: 304112 },
    { name: 'M-Sand & P-Sand', value: 14, revenue: 58000 },
    { name: 'Granite Aggregates', value: 10, revenue: 42000 },
  ];

  const handleExportCsv = () => {
    // Generate deterministic demo CSV content
    const headers = 'OrderNumber,Customer,Supplier,TotalAmount,TaxGST,Status,Date\n';
    const rows = orders
      .map(
        (o) =>
          `"${o.orderNumber}","${o.customerName}","${o.businessName}",${o.totalAmount},${o.taxAmount},"${o.status}","${o.createdAt}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `PavePort_Sales_Audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <AppShell
      appType="admin"
      title="Financial & Operational Analytics Reports"
      subtitle="Examine gross merchandise volume, GST compliance settlements, quotation conversion metrics, and regional fulfillment."
      action={
        <button
          onClick={handleExportCsv}
          className="px-3.5 py-1.5 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 border border-charcoal-700 text-white font-semibold text-xs transition flex items-center space-x-1.5"
        >
          <Download className="w-3.5 h-3.5 text-construction-400" />
          <span>{downloadSuccess ? 'Downloaded!' : 'Export CSV Audit'}</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* KPI Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-800">
            <span className="text-[10px] font-mono uppercase text-charcoal-400">Total Platform GMV</span>
            <p className="text-xl font-bold text-white mt-1 font-mono">₹{totalGmv.toLocaleString('en-IN')}</p>
          </div>
          <div className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-800">
            <span className="text-[10px] font-mono uppercase text-charcoal-400">18% GST Collected</span>
            <p className="text-xl font-bold text-emerald-400 mt-1 font-mono">₹{totalTax.toLocaleString('en-IN')}</p>
          </div>
          <div className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-800">
            <span className="text-[10px] font-mono uppercase text-charcoal-400">Quote-to-Order Conversion</span>
            <p className="text-xl font-bold text-construction-400 mt-1 font-mono">72.4%</p>
          </div>
          <div className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-800">
            <span className="text-[10px] font-mono uppercase text-charcoal-400">Average Fulfillment Time</span>
            <p className="text-xl font-bold text-blue-400 mt-1 font-mono">4.2 Hours</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-charcoal-900 border border-charcoal-800 rounded-xl p-5 shadow-card">
            <h3 className="text-sm font-bold text-white mb-1">Gross Merchandise Volume (INR)</h3>
            <p className="text-xs text-charcoal-400 mb-4">Weekly procurement trend across active construction corridors</p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesTrend}>
                  <defs>
                    <linearGradient id="colorGmv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222931" />
                  <XAxis dataKey="month" stroke="#606F80" fontSize={11} />
                  <YAxis stroke="#606F80" fontSize={11} tickFormatter={(val) => `₹${val / 1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#171C22', borderColor: '#323C47', borderRadius: '8px' }}
                    labelStyle={{ color: '#F8FAFC' }}
                    formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'GMV']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#F59E0B" strokeWidth={2} fillOpacity={1} fill="url(#colorGmv)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 bg-charcoal-900 border border-charcoal-800 rounded-xl p-5 shadow-card">
            <h3 className="text-sm font-bold text-white mb-1">Share by Material Category</h3>
            <p className="text-xs text-charcoal-400 mb-4">Revenue breakdown</p>
            <div className="space-y-3">
              {categoryPerformance.map((c) => (
                <div key={c.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-white font-medium">{c.name}</span>
                    <span className="font-mono text-construction-400">₹{(c.revenue / 1000).toFixed(0)}k ({c.value}%)</span>
                  </div>
                  <div className="w-full bg-charcoal-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-construction-500 h-full rounded-full" style={{ width: `${c.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

