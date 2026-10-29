'use client';

import React from 'react';
import { AppShell } from '@/components/common/AppShell';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useDemoStore } from '@/stores/useDemoStore';
import { CheckCircle2, History, MapPin, Truck } from 'lucide-react';

export default function DeliveryHistoryPage() {
  const { deliveryAssignments, activeDeliveryPartnerId, deliveryPartners } = useDemoStore();
  const driver = deliveryPartners.find((d) => d.id === activeDeliveryPartnerId) || deliveryPartners[0];
  const history = deliveryAssignments.filter(
    (a) => a.partnerId === driver.id || a.status === 'COMPLETED'
  );

  return (
    <AppShell
      appType="delivery"
      title="Haulage Trip History & Verification Logs"
      subtitle="Complete delivery receipts, verified OTP sign-offs, and driver compensation statements."
    >
      <div className="space-y-4">
        {history.map((h) => (
          <div
            key={h.id}
            className="p-5 rounded-xl bg-charcoal-900 border border-charcoal-800 space-y-3 shadow-card"
          >
            <div className="flex items-center justify-between border-b border-charcoal-800 pb-2">
              <span className="font-mono text-sm font-bold text-construction-400">{h.orderNumber}</span>
              <StatusBadge status={h.status} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-charcoal-300">
              <div>
                <p className="font-semibold text-white">{h.customerName}</p>
                <p className="text-[11px] text-charcoal-400">{h.dropoffAddress.locality}, {h.dropoffAddress.city}</p>
                <p className="text-[11px] text-charcoal-500 font-mono mt-1">Cargo: {h.itemsSummary}</p>
              </div>

              <div className="text-right sm:text-right">
                <span className="font-mono font-bold text-emerald-400 text-sm block">
                  + ₹{h.compensationAmount} Payout
                </span>
                <span className="text-[10px] text-charcoal-500 font-mono">
                  {h.estimatedDistanceKm} km haul &bull; {h.totalWeightTons} Tonnes
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

