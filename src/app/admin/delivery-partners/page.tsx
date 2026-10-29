'use client';

import React from 'react';
import { AppShell } from '@/components/common/AppShell';
import { useDemoStore } from '@/stores/useDemoStore';
import { Truck, Star, Phone, ShieldCheck, MapPin, CheckCircle2 } from 'lucide-react';

export default function AdminDeliveryPartnersPage() {
  const { deliveryPartners, toggleDeliveryPartnerOnline } = useDemoStore();

  return (
    <AppShell
      appType="admin"
      title="Heavy Logistics & Delivery Fleet Oversight"
      subtitle="Monitor verified haulage drivers, vehicle tonnage capacity (Tata Ace, Flatbeds, Tippers), and fulfillment SLAs."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {deliveryPartners.map((dp) => (
            <div key={dp.id} className="p-5 rounded-xl bg-charcoal-900 border border-charcoal-800 space-y-4 shadow-card">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">{dp.name}</h3>
                  <span className="text-xs text-construction-400 font-mono font-semibold block mt-0.5">
                    {dp.vehicleType.replace('_', ' ')} &bull; {dp.capacityTonnes} Tonnes
                  </span>
                </div>
                <button
                  onClick={() => toggleDeliveryPartnerOnline(dp.id)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border transition ${
                    dp.isOnline
                      ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                      : 'bg-charcoal-800 text-charcoal-400 border-charcoal-700'
                  }`}
                >
                  {dp.isOnline ? 'ONLINE' : 'OFFLINE'}
                </button>
              </div>

              <div className="space-y-1.5 text-xs text-charcoal-300">
                <p className="font-mono text-white text-[11px] font-semibold">{dp.vehicleNumber}</p>
                <p className="flex items-center text-charcoal-400">
                  <Phone className="w-3.5 h-3.5 mr-2 text-charcoal-500" />
                  {dp.phone}
                </p>
                <p className="text-[10px] text-charcoal-500 font-mono">
                  License: {dp.licenseNumber} &bull; Zones: {dp.serviceZones.join(', ')}
                </p>
              </div>

              <div className="pt-3 border-t border-charcoal-800 grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div>
                  <span className="text-[10px] text-charcoal-400 block">Rating</span>
                  <span className="font-bold text-amber-400">{dp.rating} ★</span>
                </div>
                <div>
                  <span className="text-[10px] text-charcoal-400 block">Trips</span>
                  <span className="font-bold text-white">{dp.completedTrips}</span>
                </div>
                <div>
                  <span className="text-[10px] text-charcoal-400 block">Today ₹</span>
                  <span className="font-bold text-emerald-400">₹{dp.earningsToday}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

