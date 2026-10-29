'use client';

import React from 'react';
import { AppShell } from '@/components/common/AppShell';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useDemoStore } from '@/stores/useDemoStore';
import { Truck, MapPin, Phone, User, Calendar } from 'lucide-react';

export default function BusinessDeliveriesPage() {
  const { activeBusinessId, businesses, deliveryAssignments } = useDemoStore();
  const business = businesses.find((b) => b.id === activeBusinessId) || businesses[0];
  const dispatches = deliveryAssignments.filter((d) => d.businessId === business.id);

  return (
    <AppShell
      appType="business"
      title={`${business.name} — Outbound Dispatches`}
      subtitle="Track vehicles arriving at yard, material loadout sign-offs, and job-site transit."
    >
      <div className="space-y-4">
        {dispatches.length > 0 ? (
          dispatches.map((asn) => (
            <div key={asn.id} className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-800 space-y-3 shadow-card">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-construction-400">{asn.orderNumber}</span>
                <StatusBadge status={asn.status} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-charcoal-300">
                <div>
                  <p className="font-semibold text-white">{asn.customerName}</p>
                  <p className="text-[11px] text-charcoal-400 font-mono">
                    Destination: {asn.dropoffAddress.locality}, {asn.dropoffAddress.city}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-purple-400">
                    Carrier: {asn.partnerName || 'Awaiting Driver Acceptance'}
                  </p>
                  <p className="text-[11px] text-charcoal-400 font-mono">
                    Weight: {asn.totalWeightTons} Tonnes &bull; Compensation: ₹{asn.compensationAmount}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 rounded-xl bg-charcoal-900 border border-charcoal-800 text-center text-xs text-charcoal-400">
            No active dispatches. Mark an accepted order &quot;Ready for Dispatch&quot; to schedule haulage.
          </div>
        )}
      </div>
    </AppShell>
  );
}

