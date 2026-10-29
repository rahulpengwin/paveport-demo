'use client';

import React from 'react';
import { AppShell } from '@/components/common/AppShell';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useDemoStore } from '@/stores/useDemoStore';
import { FileText, Eye, Clock, Building2, User } from 'lucide-react';

export default function AdminQuotationsPage() {
  const { quotations } = useDemoStore();

  return (
    <AppShell
      appType="admin"
      title="Platform Commercial Quotations Oversight"
      subtitle="Supervise high-volume material bids, contractor estimate conversions, and supplier pricing validity."
    >
      <div className="space-y-6">
        <div className="bg-charcoal-900 border border-charcoal-800 rounded-xl overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-charcoal-850 border-b border-charcoal-800 text-charcoal-400 font-mono text-[10px] uppercase">
                <tr>
                  <th className="py-3 px-4">Quote #</th>
                  <th className="py-3 px-4">Contractor</th>
                  <th className="py-3 px-4">Yard Supplier</th>
                  <th className="py-3 px-4">Estimated Total</th>
                  <th className="py-3 px-4">Validity</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-800">
                {quotations.map((q) => (
                  <tr key={q.id} className="hover:bg-charcoal-800/40 transition">
                    <td className="py-3 px-4 font-mono font-bold text-construction-400">{q.quotationNumber}</td>
                    <td className="py-3 px-4 text-white font-medium">{q.customerName}</td>
                    <td className="py-3 px-4 text-charcoal-300">{q.businessName}</td>
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      ₹{q.totalEstimatedAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 font-mono text-charcoal-400 text-[11px]">
                      {new Date(q.validUntil).toLocaleDateString()} ({q.validityDays}d)
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={q.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

