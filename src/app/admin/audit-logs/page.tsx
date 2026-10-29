'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/common/AppShell';
import { useDemoStore } from '@/stores/useDemoStore';
import { History, Search, ShieldAlert, Key, Filter } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const { auditLogs } = useDemoStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = auditLogs.filter(
    (l) =>
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.targetType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppShell
      appType="admin"
      title="Tamper-Evident Administrative Audit Log"
      subtitle="Immutable cryptographic log recording actor identity, role scope, operation payload, target entity, and exact timestamp."
    >
      <div className="space-y-6">
        {/* Search */}
        <div className="bg-charcoal-900 border border-charcoal-800 rounded-xl p-4 flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search audit action, actor, or details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-charcoal-800 border border-charcoal-700 text-xs text-white placeholder-charcoal-400 focus:outline-none focus:border-construction-500"
            />
          </div>
          <span className="text-xs font-mono text-charcoal-400">{filtered.length} Recorded Events</span>
        </div>

        {/* Audit Log Table */}
        <div className="bg-charcoal-900 border border-charcoal-800 rounded-xl overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-charcoal-850 border-b border-charcoal-800 text-charcoal-400 font-mono text-[10px] uppercase">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor & Role</th>
                  <th className="py-3 px-4">Action Type</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-4">Operational Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-800 font-mono text-[11px]">
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-charcoal-800/40 transition">
                    <td className="py-3 px-4 text-charcoal-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-white font-bold block">{log.actorName}</span>
                      <span className="text-[10px] text-construction-400">{log.actorRole}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-charcoal-800 text-construction-300 font-bold border border-charcoal-700">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-charcoal-300">
                      {log.targetType}: <span className="text-white">{log.targetId}</span>
                    </td>
                    <td className="py-3 px-4 font-sans text-charcoal-300 text-xs">{log.details}</td>
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

