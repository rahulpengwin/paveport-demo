'use client';

import React from 'react';
import { AppShell } from '@/components/common/AppShell';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useDemoStore } from '@/stores/useDemoStore';
import Link from 'next/link';
import { Package, Clock, ArrowRight, MapPin, Truck } from 'lucide-react';

export default function CustomerOrdersPage() {
  const { orders } = useDemoStore();

  return (
    <AppShell
      appType="customer"
      title="Track Active Construction Material Orders"
      subtitle="Visual fulfillment timelines, carrier assignment, and simulated OTP sign-off."
    >
      <div className="space-y-3">
        {orders.map((o) => (
          <div
            key={o.id}
            className="p-4 rounded-2xl bg-charcoal-900 border border-charcoal-800 hover:border-charcoal-700 transition shadow-card space-y-3"
          >
            <div className="flex items-center justify-between border-b border-charcoal-800 pb-2.5">
              <div>
                <span className="font-mono text-sm font-bold text-construction-400">{o.orderNumber}</span>
                <span className="block text-[10px] font-mono text-charcoal-500">
                  {new Date(o.createdAt).toLocaleDateString()} &bull; ₹{o.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <StatusBadge status={o.status} size="sm" />
            </div>

            <div className="text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">{o.businessName}</span>
                <span className="text-[10px] text-purple-400 font-mono">
                  {o.deliveryPartnerName || 'Awaiting Driver'}
                </span>
              </div>
              <p className="text-[11px] text-charcoal-400 flex items-center">
                <MapPin className="w-3 h-3 mr-1 text-construction-400 shrink-0" />
                {o.deliveryAddress.locality}, {o.deliveryAddress.city}
              </p>
            </div>

            <div className="pt-2 border-t border-charcoal-800 flex items-center justify-between text-xs font-mono">
              <span className="text-charcoal-400 text-[11px] truncate max-w-[170px]">
                {o.items[0]?.productName}
              </span>

              <Link
                href={`/customer/orders/${o.id}`}
                className="px-3 py-1.5 rounded-xl bg-charcoal-800 hover:bg-construction-500 hover:text-charcoal-950 text-white font-semibold text-xs transition border border-charcoal-700 flex items-center space-x-1 shrink-0"
              >
                <span>Track Route</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

