'use client';

import React from 'react';
import { AppShell } from '@/components/common/AppShell';
import { useDemoStore } from '@/stores/useDemoStore';
import { MapPin, CheckCircle, Clock } from 'lucide-react';

export default function AdminLocationsPage() {
  const { locations, toggleLocationStatus } = useDemoStore();

  return (
    <AppShell
      appType="admin"
      title="Regional Coverage & Service Pincodes"
      subtitle="Configure geographic delivery zones, active supplier coverage areas, and regional expansion boundaries."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((loc) => (
            <div key={loc.id} className="p-5 rounded-xl bg-charcoal-900 border border-charcoal-800 space-y-4 shadow-card">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">{loc.city}</h3>
                  <p className="text-xs text-charcoal-400">
                    {loc.district}, {loc.state}
                  </p>
                </div>
                <button
                  onClick={() => toggleLocationStatus(loc.id)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border transition ${
                    loc.status === 'ACTIVE'
                      ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                      : 'bg-amber-950/60 text-amber-400 border-amber-800'
                  }`}
                >
                  {loc.status}
                </button>
              </div>

              <div className="p-3 rounded-lg bg-charcoal-850 border border-charcoal-800 flex items-center justify-between font-mono text-xs">
                <span className="text-charcoal-400">Pincode:</span>
                <span className="font-bold text-construction-400">{loc.pincode}</span>
              </div>

              <div className="pt-2 border-t border-charcoal-800 flex items-center justify-between text-xs font-mono">
                <span className="text-charcoal-400">{loc.activeBusinessesCount} Yards</span>
                <span className="text-charcoal-400">{loc.activeDeliveryPartnersCount} Trucks</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

