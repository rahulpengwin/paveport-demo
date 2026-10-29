'use client';

import React from 'react';
import { AppShell } from '@/components/common/AppShell';
import { useDemoStore } from '@/stores/useDemoStore';
import Link from 'next/link';
import { Building2, MapPin, Star, ShieldCheck, ArrowRight } from 'lucide-react';

export default function CustomerStoresPage() {
  const { businesses } = useDemoStore();
  const approved = businesses.filter((b) => b.verificationStatus === 'APPROVED');

  return (
    <AppShell
      appType="customer"
      title="Verified Construction Supply Yards"
      subtitle="Compare certified building material suppliers, warehouse inventory, and delivery radius."
    >
      <div className="space-y-3">
        {approved.map((b) => (
          <div
            key={b.id}
            className="p-4 rounded-2xl bg-charcoal-900 border border-charcoal-800 hover:border-charcoal-700 transition shadow-card space-y-3"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">{b.name}</h3>
                  <p className="text-[11px] text-charcoal-400 flex items-center mt-0.5">
                    <MapPin className="w-3 h-3 mr-1 text-charcoal-500" />
                    {b.address.locality}, {b.address.city}
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800 shrink-0">
                  VERIFIED
                </span>
              </div>

              <div className="flex items-center space-x-2 text-[11px] font-mono text-charcoal-300 mt-2.5 pt-2 border-t border-charcoal-800">
                <span className="text-amber-400 font-bold flex items-center">
                  <Star className="w-3 h-3 mr-1 fill-amber-400" />
                  {b.rating}
                </span>
                <span className="text-charcoal-500">&bull;</span>
                <span>{b.estimatedDeliveryHours} delivery</span>
                <span className="text-charcoal-500">&bull;</span>
                <span className="text-charcoal-400">Min: ₹{b.minOrderValue.toLocaleString('en-IN')}</span>
              </div>

              <div className="mt-2 flex flex-wrap gap-1">
                {b.categories.map((c) => (
                  <span key={c} className="px-1.5 py-0.5 rounded bg-charcoal-800 text-[9px] text-charcoal-300 font-mono">
                    {c.replace('cat-', '')}
                  </span>
                ))}
              </div>
            </div>

            <Link
              href={`/customer/stores/${b.id}`}
              className="w-full py-2 px-3 rounded-xl bg-construction-500 hover:bg-construction-400 active:scale-[0.98] text-charcoal-950 font-bold text-xs transition flex items-center justify-center space-x-1 shadow-sm"
            >
              <span>View Materials & Request Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

