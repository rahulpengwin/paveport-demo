'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDemoStore } from '@/stores/useDemoStore';
import { UserRole } from '@/types';
import {
  ShieldAlert,
  Store,
  HardHat,
  Truck,
  RotateCcw,
  Sparkles,
  Layers,
  ChevronDown,
  Bell,
  CheckCircle2,
  ExternalLink,
  Info,
} from 'lucide-react';

export const DemoHeader: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const {
    currentRole,
    setCurrentRole,
    currentDemoStep,
    toggleGuidedTour,
    resetDemoData,
    notifications,
    markNotificationRead,
  } = useDemoStore();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const appNavItems = [
    { label: 'Platform Demo', href: '/', icon: HardHat, exact: true },
    { label: 'Admin Portal', href: '/admin/overview', icon: ShieldAlert, prefix: '/admin' },
    { label: 'Business App', href: '/business/overview', icon: Store, prefix: '/business' },
    { label: 'Customer App', href: '/customer/home', icon: Layers, prefix: '/customer' },
    { label: 'Delivery App', href: '/delivery/overview', icon: Truck, prefix: '/delivery' },
    { label: 'Architecture', href: '/architecture/overview', icon: Layers, prefix: '/architecture' },
  ];

  const adminRoles: { role: UserRole; label: string }[] = [
    { role: 'SUPER_ADMIN', label: 'Super Admin (All Access)' },
    { role: 'OPERATIONS_ADMIN', label: 'Operations Admin' },
    { role: 'BUSINESS_VERIFICATION_ADMIN', label: 'Business Verification Admin' },
    { role: 'CATALOG_MANAGER', label: 'Catalog Manager' },
    { role: 'LOGISTICS_MANAGER', label: 'Logistics Manager' },
    { role: 'CUSTOMER_SUPPORT_AGENT', label: 'Support Agent' },
    { role: 'FINANCE_VIEWER', label: 'Finance & Compliance Viewer' },
    { role: 'BUSINESS_OWNER', label: 'Business Owner (Sri Lakshmi Cement)' },
    { role: 'CUSTOMER', label: 'Customer (Ramesh Kumar - InfraBuild)' },
    { role: 'DELIVERY_PARTNER', label: 'Delivery Partner (Murugan - Tata Ace)' },
  ];

  const handleRoleSelect = (role: UserRole) => {
    setCurrentRole(role);
    setRoleDropdownOpen(false);

    // Contextual auto-navigation if relevant
    if (role === 'BUSINESS_OWNER' && !pathname.startsWith('/business')) {
      router.push('/business/overview');
    } else if (role === 'CUSTOMER' && !pathname.startsWith('/customer')) {
      router.push('/customer/home');
    } else if (role === 'DELIVERY_PARTNER' && !pathname.startsWith('/delivery')) {
      router.push('/delivery/overview');
    } else if (role.includes('ADMIN') && !pathname.startsWith('/admin')) {
      router.push('/admin/overview');
    }
  };

  const handleReset = () => {
    resetDemoData();
    setResetConfirmOpen(false);
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 bg-charcoal-950/95 backdrop-blur-md border-b border-charcoal-800 text-slate-100">
      {/* Top Demo Bar */}
      <div className="bg-gradient-to-r from-construction-600 via-amber-600 to-industrial-orange px-4 py-1 text-xs font-medium text-white flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-2">
          <span className="px-1.5 py-0.5 rounded bg-black/30 font-mono text-[10px] tracking-wider uppercase font-bold">
            Interactive Client Demo
          </span>
          <span className="hidden sm:inline text-amber-50">
            One Web App, Four Synchronized Products &bull; Shared Domain &bull; Deterministic Seed
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={toggleGuidedTour}
            className="flex items-center space-x-1.5 bg-black/35 hover:bg-black/50 px-2.5 py-0.5 rounded text-white text-xs font-semibold transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Guided Tour (Step {currentDemoStep}/9)</span>
          </button>

          <button
            onClick={() => setResetConfirmOpen(true)}
            title="Reset all demo state to original seed"
            className="flex items-center space-x-1 bg-black/30 hover:bg-black/50 px-2 py-0.5 rounded text-amber-100 hover:text-white transition text-xs"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden md:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-construction-500 to-amber-600 flex items-center justify-center font-black text-charcoal-950 font-mono text-lg shadow-amber">
              P
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-amber-400 transition">
                Pave<span className="text-construction-500">Port</span>
              </span>
              <span className="hidden lg:inline-block ml-2 text-[10px] text-charcoal-400 font-mono uppercase tracking-widest border border-charcoal-800 px-1.5 py-0.2 rounded">
                v1.0 prototype
              </span>
            </div>
          </Link>

          {/* App Switcher Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            {appNavItems.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.prefix || item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                    active
                      ? 'bg-charcoal-800 text-construction-400 border border-charcoal-700 shadow-sm'
                      : 'text-charcoal-300 hover:bg-charcoal-900 hover:text-white'
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Tools: Role Switcher & Notifications */}
        <div className="flex items-center space-x-3">
          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center space-x-2 bg-charcoal-900 border border-charcoal-700 hover:border-charcoal-600 px-3 py-1.5 rounded-lg text-xs text-charcoal-200 transition"
            >
              <span className="text-charcoal-400 hidden sm:inline">Role:</span>
              <span className="font-bold text-construction-400">
                {currentRole.replace(/_/g, ' ')}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-charcoal-400" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-charcoal-900 border border-charcoal-700 rounded-xl shadow-2xl py-2 z-50">
                <div className="px-3 py-1.5 border-b border-charcoal-800">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400">
                    Switch Demo Persona / RBAC Role
                  </p>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-charcoal-800/50">
                  {adminRoles.map((r) => (
                    <button
                      key={r.role}
                      onClick={() => handleRoleSelect(r.role)}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-charcoal-800 transition flex items-center justify-between ${
                        currentRole === r.role ? 'bg-charcoal-800/80 text-construction-400 font-bold' : 'text-charcoal-300'
                      }`}
                    >
                      <span>{r.label}</span>
                      {currentRole === r.role && <CheckCircle2 className="w-3.5 h-3.5 text-construction-500" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Center */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 rounded-lg bg-charcoal-900 border border-charcoal-800 hover:border-charcoal-700 text-charcoal-300 hover:text-white transition"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-construction-500 text-charcoal-950 font-bold text-[10px] flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-charcoal-900 border border-charcoal-700 rounded-xl shadow-2xl py-2 z-50">
                <div className="px-3 py-1.5 border-b border-charcoal-800 flex items-center justify-between">
                  <p className="text-xs font-bold text-white">Live Event Notifications</p>
                  <span className="text-[10px] text-charcoal-400 font-mono">{notifications.length} events</span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-charcoal-800">
                  {notifications.slice(0, 6).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-3 text-xs hover:bg-charcoal-800 cursor-pointer transition ${
                        !n.read ? 'bg-charcoal-850' : 'opacity-70'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-white">{n.title}</span>
                        <span className="text-[10px] text-charcoal-400 font-mono">
                          {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-charcoal-300 text-[11px] leading-relaxed">{n.message}</p>
                      {n.actionUrl && (
                        <Link
                          href={n.actionUrl}
                          className="mt-1.5 inline-flex items-center text-[11px] text-construction-400 hover:underline"
                        >
                          View details <ExternalLink className="w-2.5 h-2.5 ml-1" />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Demo Reset */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-charcoal-900 border border-charcoal-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-start space-x-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Reset Demo Data?</h3>
                <p className="mt-1 text-xs text-charcoal-300 leading-relaxed">
                  This will reset all newly created orders, quotations, products, and approvals back to the initial
                  deterministic seed dataset.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg text-charcoal-300 hover:bg-charcoal-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-construction-500 hover:bg-construction-400 text-charcoal-950 transition shadow-sm"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

