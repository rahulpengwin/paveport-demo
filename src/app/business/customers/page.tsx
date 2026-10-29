'use client';

import React from 'react';
import { AppShell } from '@/components/common/AppShell';
import { useDemoStore } from '@/stores/useDemoStore';
import { Users, Phone, MapPin } from 'lucide-react';

export default function BusinessCustomersPage() {
  const { customers } = useDemoStore();

  return (
    <AppShell
      appType="business"
      title="Contractor Client Accounts"
      subtitle="Builders, project managers, and civil contractors with active trade accounts."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {customers.map((c) => (
          <div key={c.id} className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-800 space-y-2 text-xs">
            <h4 className="font-bold text-white text-sm">{c.name}</h4>
            {c.companyName && <p className="text-construction-400 font-medium">{c.companyName}</p>}
            <p className="text-charcoal-400 font-mono">{c.phone} &bull; {c.email}</p>
            <p className="text-charcoal-400">{c.defaultAddress.locality}, {c.defaultAddress.city}</p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

