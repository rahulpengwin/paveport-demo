'use client';

import React from 'react';
import { AppShell } from '@/components/common/AppShell';
import { KpiCard } from '@/components/common/KpiCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useDemoStore } from '@/stores/useDemoStore';
import Link from 'next/link';
import {
  Building2,
  Users,
  Truck,
  Package,
  TrendingUp,
  FileText,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
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
} from 'recharts';

export default function AdminOverviewPage() {
  const { businesses, customers, deliveryPartners, orders, quotations, products, auditLogs } = useDemoStore();

  const totalBusinesses = businesses.length;
  const pendingApprovals = businesses.filter((b) => b.verificationStatus === 'PENDING').length;
  const activeCustomers = customers.filter((c) => c.status === 'ACTIVE').length;
  const activeDrivers = deliveryPartners.filter((d) => d.isOnline).length;
  const totalOrders = orders.length;
  const totalGmv = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingQuotes = quotations.filter((q) => q.status === 'SUBMITTED').length;
  const inTransitOrders = orders.filter((o) => o.status === 'IN_TRANSIT').length;
  const lowStockCount = products.filter((p) => p.availableStock <= p.lowStockThreshold).length;

  // Chart data
  const revenueChartData = [
    { day: 'Mon', revenue: 42000, orders: 4 },
    { day: 'Tue', revenue: 86000, orders: 7 },
    { day: 'Wed', revenue: 64000, orders: 5 },
    { day: 'Thu', revenue: 112000, orders: 9 },
    { day: 'Fri', revenue: 94000, orders: 8 },
    { day: 'Sat', revenue: 138000, orders: 12 },
    { day: 'Sun', revenue: Math.max(30000, totalGmv / 3), orders: totalOrders },
  ];

  const categoryDistribution = [
    { category: 'Cement', volume: 48 },
    { category: 'Steel', volume: 28 },
    { category: 'M-Sand', volume: 18 },
    { category: 'Aggregates', volume: 12 },
    { category: 'AAC Blocks', volume: 8 },
  ];

  return (
    <AppShell
      appType="admin"
      title="Platform Operations Overview"
      subtitle="Centralized management of registered businesses, contractor orders, and logistics dispatch."
      action={
        <div className="flex items-center space-x-2">
          <Link
            href="/admin/businesses"
            className="px-3.5 py-1.5 rounded-lg bg-construction-500 hover:bg-construction-400 text-charcoal-950 font-bold text-xs transition flex items-center space-x-1.5 shadow-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Review Applications ({pendingApprovals})</span>
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Total Registered Businesses"
            value={totalBusinesses}
            subtitle={`${pendingApprovals} pending verification`}
            icon={Building2}
            accentColor="amber"
            trend={{ value: '+12% this month', isPositive: true }}
          />

          <KpiCard
            title="Gross Merchandise Value"
            value={`₹${totalGmv.toLocaleString('en-IN')}`}
            subtitle="Commercial volume through platform"
            icon={TrendingUp}
            accentColor="emerald"
            trend={{ value: '+24.8% QoQ', isPositive: true }}
          />

          <KpiCard
            title="Total Orders Placed"
            value={totalOrders}
            subtitle={`${inTransitOrders} currently in transit`}
            icon={Package}
            accentColor="blue"
            trend={{ value: '+18% weekly', isPositive: true }}
          />

          <KpiCard
            title="Fleet Logistics Active"
            value={`${activeDrivers} / ${deliveryPartners.length}`}
            subtitle="Tata Ace, Flatbeds, Tippers online"
            icon={Truck}
            accentColor="charcoal"
          />
        </div>

        {/* Secondary Metric Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-charcoal-900 border border-charcoal-800 rounded-xl p-4">
          <div>
            <p className="text-[11px] font-mono uppercase text-charcoal-400">Pending Quotes</p>
            <p className="text-lg font-bold text-white mt-0.5">{pendingQuotes} requests</p>
          </div>
          <div>
            <p className="text-[11px] font-mono uppercase text-charcoal-400">Active Contractors</p>
            <p className="text-lg font-bold text-white mt-0.5">{activeCustomers} accounts</p>
          </div>
          <div>
            <p className="text-[11px] font-mono uppercase text-charcoal-400">Inventory Alerts</p>
            <p className={`text-lg font-bold mt-0.5 ${lowStockCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {lowStockCount} items below MOQ
            </p>
          </div>
          <div>
            <p className="text-[11px] font-mono uppercase text-charcoal-400">Delayed Deliveries</p>
            <p className="text-lg font-bold text-emerald-400 mt-0.5">0 incidents (100% SLA)</p>
          </div>
        </div>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Revenue Trend */}
          <div className="lg:col-span-8 bg-charcoal-900 border border-charcoal-800 rounded-xl p-5 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">Platform Sales Volume (INR)</h3>
                <p className="text-xs text-charcoal-400">Daily gross turnover and completed deliveries</p>
              </div>
              <span className="text-xs font-mono text-construction-400 font-semibold bg-construction-500/10 px-2 py-0.5 rounded border border-construction-500/20">
                Live Seed Data
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222931" />
                  <XAxis dataKey="day" stroke="#606F80" fontSize={11} />
                  <YAxis stroke="#606F80" fontSize={11} tickFormatter={(val) => `₹${val / 1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#171C22', borderColor: '#323C47', borderRadius: '8px' }}
                    labelStyle={{ color: '#F8FAFC' }}
                    formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="lg:col-span-4 bg-charcoal-900 border border-charcoal-800 rounded-xl p-5 shadow-card">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-white tracking-tight">Demand by Material</h3>
              <p className="text-xs text-charcoal-400">Order share across top categories</p>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryDistribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#222931" />
                  <XAxis type="number" stroke="#606F80" fontSize={10} />
                  <YAxis dataKey="category" type="category" stroke="#606F80" fontSize={11} width={80} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#171C22', borderColor: '#323C47', borderRadius: '8px' }}
                    labelStyle={{ color: '#F8FAFC' }}
                  />
                  <Bar dataKey="volume" fill="#D97706" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Orders & Actionable Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Orders Table */}
          <div className="lg:col-span-7 bg-charcoal-900 border border-charcoal-800 rounded-xl p-5 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">Recent Construction Orders</h3>
              <Link href="/admin/orders" className="text-xs text-construction-400 hover:underline flex items-center">
                <span>View all</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-charcoal-800 text-charcoal-400 font-mono text-[10px] uppercase">
                    <th className="pb-2">Order #</th>
                    <th className="pb-2">Customer</th>
                    <th className="pb-2">Supplier</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal-800/60">
                  {orders.slice(0, 4).map((o) => (
                    <tr key={o.id} className="hover:bg-charcoal-800/40">
                      <td className="py-2.5 font-mono text-construction-400 font-semibold">{o.orderNumber}</td>
                      <td className="py-2.5 text-white">{o.customerName.split(' ')[0]}</td>
                      <td className="py-2.5 text-charcoal-300">{o.businessName}</td>
                      <td className="py-2.5 font-mono font-bold text-white">₹{o.totalAmount.toLocaleString('en-IN')}</td>
                      <td className="py-2.5">
                        <StatusBadge status={o.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit Activity Stream */}
          <div className="lg:col-span-5 bg-charcoal-900 border border-charcoal-800 rounded-xl p-5 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">Recent Audit Events</h3>
              <Link href="/admin/audit-logs" className="text-xs text-construction-400 hover:underline flex items-center">
                <span>Audit trail</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>

            <div className="space-y-3">
              {auditLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="p-2.5 rounded-lg bg-charcoal-850 border border-charcoal-800 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] text-construction-400 font-bold uppercase">{log.action}</span>
                    <span className="text-[10px] text-charcoal-400 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-charcoal-300 text-[11px] leading-relaxed">{log.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

