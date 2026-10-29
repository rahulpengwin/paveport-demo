'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/common/AppShell';
import { useDemoStore } from '@/stores/useDemoStore';
import { Settings, Save, CheckCircle2 } from 'lucide-react';

export default function BusinessSettingsPage() {
  const { activeBusinessId, businesses } = useDemoStore();
  const business = businesses.find((b) => b.id === activeBusinessId) || businesses[0];
  const [minOrder, setMinOrder] = useState(business.minOrderValue.toString());
  const [hours, setHours] = useState(business.operatingHours);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AppShell
      appType="business"
      title={`${business.name} — Yard Configuration`}
      subtitle="Operating hours, minimum order restrictions, and notification webhooks."
    >
      <div className="max-w-xl bg-charcoal-900 border border-charcoal-800 rounded-xl p-6 shadow-card space-y-4 text-xs">
        {saved && (
          <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Yard settings successfully updated!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-charcoal-300 font-semibold mb-1">Minimum Commercial Order Value (₹)</label>
            <input
              type="number"
              value={minOrder}
              onChange={(e) => setMinOrder(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-charcoal-800 border border-charcoal-700 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-charcoal-300 font-semibold mb-1">Yard Operating Hours</label>
            <input
              type="text"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-charcoal-800 border border-charcoal-700 text-white"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-construction-500 hover:bg-construction-400 text-charcoal-950 font-bold transition shadow-sm flex items-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Yard Settings</span>
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}

