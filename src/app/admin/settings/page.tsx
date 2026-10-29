'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/common/AppShell';
import { Settings, Save, CheckCircle2, ShieldCheck, DollarSign } from 'lucide-react';

export default function AdminSettingsPage() {
  const [platformFeePercent, setPlatformFeePercent] = useState('2.5');
  const [standardGstRate, setStandardGstRate] = useState('18');
  const [baseDeliveryRadiusKm, setBaseDeliveryRadiusKm] = useState('15');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AppShell
      appType="admin"
      title="Platform Operations & Commercial Settings"
      subtitle="Configure platform marketplace commission rates, statutory GST parameters, and logistics baseline rates."
    >
      <div className="max-w-2xl bg-charcoal-900 border border-charcoal-800 rounded-xl p-6 shadow-card space-y-6">
        {saved && (
          <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Operational configuration parameters successfully updated in demo context.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-charcoal-300 font-semibold mb-1">
              Marketplace Commission Fee (%)
            </label>
            <input
              type="text"
              value={platformFeePercent}
              onChange={(e) => setPlatformFeePercent(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-charcoal-800 border border-charcoal-700 text-white font-mono focus:outline-none focus:border-construction-500"
            />
            <p className="text-[11px] text-charcoal-500 mt-1">Platform rake on confirmed material settlements</p>
          </div>

          <div>
            <label className="block text-charcoal-300 font-semibold mb-1">
              Standard GST Tax Calculation Rate (%)
            </label>
            <input
              type="text"
              value={standardGstRate}
              onChange={(e) => setStandardGstRate(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-charcoal-800 border border-charcoal-700 text-white font-mono focus:outline-none focus:border-construction-500"
            />
            <p className="text-[11px] text-charcoal-500 mt-1">
              Statutory Indian GST applied to cement, steel rebar, and aggregate estimates
            </p>
          </div>

          <div>
            <label className="block text-charcoal-300 font-semibold mb-1">
              Standard Base Haulage Zone Radius (Kilometers)
            </label>
            <input
              type="text"
              value={baseDeliveryRadiusKm}
              onChange={(e) => setBaseDeliveryRadiusKm(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-charcoal-800 border border-charcoal-700 text-white font-mono focus:outline-none focus:border-construction-500"
            />
            <p className="text-[11px] text-charcoal-500 mt-1">Distance baseline before secondary toll mileage kicks in</p>
          </div>

          <div className="pt-4 border-t border-charcoal-800 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-construction-500 hover:bg-construction-400 text-charcoal-950 font-bold transition shadow-sm flex items-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save System Parameters</span>
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}

