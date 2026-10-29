'use client';

import React from 'react';
import { AppShell } from '@/components/common/AppShell';
import { useDemoStore } from '@/stores/useDemoStore';
import { User, MapPin, Building, Phone, Mail, FileText, ShoppingBag } from 'lucide-react';

export default function CustomerProfilePage() {
  const { customers, activeCustomerId } = useDemoStore();
  const customer = customers.find((c) => c.id === activeCustomerId) || customers[0];

  return (
    <AppShell
      appType="customer"
      title="Contractor Account & Job Sites"
      subtitle="Manage corporate billing information, delivery job site addresses, and GSTIN registration."
    >
      <div className="max-w-2xl bg-charcoal-900 border border-charcoal-800 rounded-xl p-6 shadow-card space-y-6 text-xs">
        <div className="flex items-start justify-between border-b border-charcoal-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-construction-500/10 border border-construction-500/30 flex items-center justify-center text-construction-400 font-bold text-lg font-mono">
              {customer.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{customer.name}</h3>
              {customer.companyName && (
                <p className="text-xs text-construction-400 font-medium">{customer.companyName}</p>
              )}
              {customer.gstin && (
                <p className="text-[10px] text-charcoal-400 font-mono mt-0.5">GSTIN: {customer.gstin}</p>
              )}
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800">
            {customer.status}
          </span>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Contact Details</h4>
          <p className="flex items-center text-charcoal-300">
            <Phone className="w-4 h-4 mr-2 text-charcoal-500" />
            {customer.phone}
          </p>
          <p className="flex items-center text-charcoal-300">
            <Mail className="w-4 h-4 mr-2 text-charcoal-500" />
            {customer.email}
          </p>
        </div>

        <div className="space-y-3 pt-3 border-t border-charcoal-800">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Configured Site Delivery Addresses
          </h4>
          <div className="space-y-2">
            {customer.addresses.map((addr, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-charcoal-850 border border-charcoal-800 flex items-start space-x-2"
              >
                <MapPin className="w-4 h-4 text-construction-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">
                    {addr.locality} — Site #{idx + 1}
                  </span>
                  <span className="text-charcoal-400 text-[11px]">
                    {addr.street}, {addr.city} ({addr.pincode})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

