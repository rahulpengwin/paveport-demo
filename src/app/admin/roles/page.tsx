'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/common/AppShell';
import { useDemoStore } from '@/stores/useDemoStore';
import { ALL_PERMISSIONS, ROLE_DEFINITIONS, hasPermission } from '@/lib/permissions/rbac';
import { UserRole } from '@/types';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Users,
  Key,
  Info,
  Check,
} from 'lucide-react';

export default function AdminRolesPage() {
  const { currentRole, setCurrentRole } = useDemoStore();
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);

  const roles = Object.values(ROLE_DEFINITIONS);

  const categories = Array.from(new Set(ALL_PERMISSIONS.map((p) => p.category)));

  return (
    <AppShell
      appType="admin"
      title="Role-Based Access Control (RBAC) Matrix"
      subtitle="Granular security model enforcing tenant isolation, operational authority, and audit boundaries."
    >
      <div className="space-y-6">
        {/* Role Switcher Test Bar */}
        <div className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Key className="w-4 h-4 text-construction-400" />
              <span>Current Active Demonstration Persona:</span>
              <span className="px-2 py-0.5 rounded bg-construction-500/10 border border-construction-500/30 text-construction-400 font-mono text-xs">
                {currentRole}
              </span>
            </h3>
            <p className="text-xs text-charcoal-400">
              Select another role below to immediately test menu hiding, action locking, and route permission checks.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setSelectedRole(r.id);
                  setCurrentRole(r.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition flex items-center space-x-1.5 ${
                  currentRole === r.id
                    ? 'bg-construction-500 text-charcoal-950 font-bold shadow-sm'
                    : 'bg-charcoal-800 border border-charcoal-700 text-charcoal-300 hover:text-white hover:bg-charcoal-700'
                }`}
              >
                {currentRole === r.id && <Check className="w-3.5 h-3.5" />}
                <span>{r.id}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((r) => (
            <div
              key={r.id}
              onClick={() => {
                setSelectedRole(r.id);
                setCurrentRole(r.id);
              }}
              className={`p-4 rounded-xl border cursor-pointer transition ${
                currentRole === r.id
                  ? 'bg-charcoal-850 border-construction-500 shadow-md ring-1 ring-construction-500/30'
                  : 'bg-charcoal-900 border-charcoal-800 hover:border-charcoal-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-construction-400">{r.id}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-charcoal-800 text-charcoal-400">
                  {r.permissions.length} perms
                </span>
              </div>
              <h4 className="text-sm font-bold text-white">{r.name}</h4>
              <p className="text-xs text-charcoal-400 mt-1 leading-relaxed">{r.description}</p>
            </div>
          ))}
        </div>

        {/* Detailed Permission Matrix Table */}
        <div className="bg-charcoal-900 border border-charcoal-800 rounded-xl overflow-hidden shadow-card">
          <div className="p-4 border-b border-charcoal-800 flex items-center justify-between bg-charcoal-850">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Full Authority Matrix</h3>
              <p className="text-xs text-charcoal-400">Permission scopes across administrative and operational roles</p>
            </div>
            <span className="text-xs font-mono text-construction-400 bg-charcoal-800 px-2.5 py-1 rounded">
              23 Defined Scopes
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-charcoal-900 border-b border-charcoal-800 text-charcoal-400 font-mono text-[10px] uppercase">
                <tr>
                  <th className="py-3 px-4 w-64">Permission / Scope</th>
                  <th className="py-3 px-4">Category</th>
                  {roles.map((r) => (
                    <th key={r.id} className="py-3 px-2 text-center font-mono">
                      <span className={`block truncate max-w-[70px] ${currentRole === r.id ? 'text-construction-400 font-bold' : ''}`}>
                        {r.id.split('_')[0]}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-800/60 font-mono">
                {ALL_PERMISSIONS.map((perm) => (
                  <tr key={perm.key} className="hover:bg-charcoal-800/40 transition">
                    <td className="py-2.5 px-4 font-sans">
                      <p className="font-semibold text-white">{perm.name}</p>
                      <p className="text-[10px] text-charcoal-400 font-mono">{perm.key}</p>
                    </td>
                    <td className="py-2.5 px-4 font-sans text-charcoal-400 text-[11px]">{perm.category}</td>

                    {roles.map((r) => {
                      const allowed = hasPermission(r.id, perm.key);
                      return (
                        <td key={r.id} className="py-2.5 px-2 text-center">
                          {allowed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                          ) : (
                            <span className="text-charcoal-700">&bull;</span>
                          )}
                        </td>
                      );
                    })}
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

