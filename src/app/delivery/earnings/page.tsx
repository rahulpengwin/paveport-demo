'use client';

import React from 'react';
import { AppShell } from '@/components/common/AppShell';
import { useDemoStore } from '@/stores/useDemoStore';
import { TrendingUp, DollarSign, Wallet, Calendar, ArrowRight } from 'lucide-react';

export default function DeliveryEarningsPage() {
  const { activeDeliveryPartnerId, deliveryPartners } = useDemoStore();
  const driver = deliveryPartners.find((d) => d.id === activeDeliveryPartnerId) || deliveryPartners[0];

  const breakdown = [
    { day: 'Today', trips: driver.todayTrips, amount: driver.earningsToday },
    { day: 'Yesterday', trips: 4, amount: 3200 },
    { day: '27 Oct 2026', trips: 3, amount: 2450 },
    { day: '26 Oct 2026', trips: 5, amount: 4100 },
  ];

  return (
    <AppShell
      appType="delivery"
      title="Driver Haulage Earnings & Payout Ledger"
      subtitle="Automated daily clearing of transport fees and fuel compensation."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-800">
            <span className="text-[10px] font-mono uppercase text-charcoal-400">Today&apos;s Earned Compensation</span>
            <p className="text-2xl font-bold text-emerald-400 mt-1 font-mono">
              ₹{driver.earningsToday.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-charcoal-400 mt-0.5">{driver.todayTrips} trips completed</p>
          </div>

          <div className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-800">
            <span className="text-[10px] font-mono uppercase text-charcoal-400">Total Lifetime Haulage</span>
            <p className="text-2xl font-bold text-white mt-1 font-mono">
              ₹{(driver.completedTrips * 820).toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-charcoal-400 mt-0.5">{driver.completedTrips} all-time deliveries</p>
          </div>

          <div className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-800">
            <span className="text-[10px] font-mono uppercase text-charcoal-400">Settlement Cycle</span>
            <p className="text-2xl font-bold text-construction-400 mt-1 font-mono">T+1 Daily</p>
            <p className="text-xs text-charcoal-400 mt-0.5">Direct to Bank / UPI</p>
          </div>
        </div>

        <div className="bg-charcoal-900 border border-charcoal-800 rounded-xl overflow-hidden shadow-card">
          <div className="p-4 border-b border-charcoal-800 bg-charcoal-850">
            <h3 className="text-sm font-bold text-white">Recent Daily Payout History</h3>
          </div>
          <div className="divide-y divide-charcoal-800 text-xs">
            {breakdown.map((b) => (
              <div key={b.day} className="p-4 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">{b.day}</span>
                  <span className="text-[11px] text-charcoal-400 font-mono">{b.trips} Haulage Trips</span>
                </div>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  ₹{b.amount.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

