'use client';

import React from 'react';
import { AppShell } from '@/components/common/AppShell';
import { useDemoStore } from '@/stores/useDemoStore';
import { Users, Building, Phone, Mail, MapPin, ShoppingBag } from 'lucide-react';

export default function AdminCustomersPage() {
  const { customers } = useDemoStore();

  return (
    <AppShell
      appType="admin"
      title="Contractor & Customer Directory"
      subtitle="Manage registered construction developers, individual home builders, credit terms, and delivery addresses."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {customers.map((c) => (
            <div key={c.id} className="p-5 rounded-xl bg-charcoal-900 border border-charcoal-800 space-y-4 shadow-card">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">{c.name}</h3>
                  {c.companyName && (
                    <p className="text-xs text-construction-400 font-medium mt-0.5">{c.companyName}</p>
                  )}
                  {c.gstin && <p className="text-[10px] text-charcoal-400 font-mono">GSTIN: {c.gstin}</p>}
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                  {c.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-charcoal-300">
                <p className="flex items-center text-charcoal-300">
                  <Phone className="w-3.5 h-3.5 mr-2 text-charcoal-500" />
                  {c.phone}
                </p>
                <p className="flex items-center text-charcoal-300">
                  <Mail className="w-3.5 h-3.5 mr-2 text-charcoal-500" />
                  {c.email}
                </p>
                <p className="flex items-start text-charcoal-300">
                  <MapPin className="w-3.5 h-3.5 mr-2 text-charcoal-500 shrink-0 mt-0.5" />
                  <span>
                    {c.defaultAddress.street}, {c.defaultAddress.locality}, {c.defaultAddress.city} -{' '}
                    {c.defaultAddress.pincode}
                  </span>
                </p>
              </div>

              <div className="pt-3 border-t border-charcoal-800 flex items-center justify-between text-xs font-mono">
                <span className="text-charcoal-400">Total Procurement:</span>
                <span className="font-bold text-white">₹{c.totalSpent.toLocaleString('en-IN')} ({c.totalOrders} orders)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

