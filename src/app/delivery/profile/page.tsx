'use client';

import React from 'react';
import { AppShell } from '@/components/common/AppShell';
import { useDemoStore } from '@/stores/useDemoStore';
import { Truck, Star, Phone, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

export default function DeliveryProfilePage() {
  const { activeDeliveryPartnerId, deliveryPartners } = useDemoStore();
  const driver = deliveryPartners.find((d) => d.id === activeDeliveryPartnerId) || deliveryPartners[0];

  return (
    <AppShell
      appType="delivery"
      title="Driver Fleet Credentials & Vehicle Specs"
      subtitle="Heavy commercial vehicle verification, commercial driver permit, and assigned service corridors."
    >
      <div className="max-w-2xl bg-charcoal-900 border border-charcoal-800 rounded-xl p-6 shadow-card space-y-6 text-xs">
        <div className="flex items-start justify-between border-b border-charcoal-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-lg font-mono">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{driver.name}</h3>
              <p className="text-xs text-construction-400 font-mono mt-0.5">{driver.vehicleNumber}</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800">
            {driver.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-charcoal-850 border border-charcoal-800 space-y-1">
            <span className="text-[10px] text-charcoal-400 uppercase font-mono">Vehicle Class</span>
            <p className="font-bold text-white text-xs">{driver.vehicleType.replace('_', ' ')}</p>
            <p className="text-[10px] text-charcoal-400 font-mono">Payload: {driver.capacityTonnes} Metric Tonnes</p>
          </div>

          <div className="p-3 rounded-lg bg-charcoal-850 border border-charcoal-800 space-y-1">
            <span className="text-[10px] text-charcoal-400 uppercase font-mono">Driver License</span>
            <p className="font-bold text-white text-xs font-mono">{driver.licenseNumber}</p>
            <p className="text-[10px] text-emerald-400 font-mono">Heavy Goods Vehicle Verified</p>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-charcoal-800">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Assigned Service Pincodes</h4>
          <div className="flex flex-wrap gap-2">
            {driver.serviceZones.map((z) => (
              <span key={z} className="px-2.5 py-1 rounded bg-charcoal-800 border border-charcoal-700 text-construction-300 font-mono text-xs">
                Zone {z}
              </span>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

