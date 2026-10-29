'use client';

import React from 'react';
import { AppShell } from '@/components/common/AppShell';
import { Smartphone, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function ArchitectureMobilePage() {
  return (
    <AppShell
      appType="architecture"
      title="Expo React Native Mobile Suite Specification"
      subtitle="Dedicated native applications for Business Suppliers, Contractors, and Fleet Drivers."
    >
      <div className="space-y-6 text-xs text-charcoal-300">
        {/* Separation of Concerns */}
        <div className="p-5 rounded-xl bg-charcoal-900 border border-charcoal-800 space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Architectural Boundaries & Separation from Web 3D
          </h3>
          <p className="leading-relaxed">
            The web prototype features Three.js WebGL scenes for marketing presentation. In contrast, the three mobile
            applications are engineered purely in <strong className="text-white">Expo React Native</strong> with
            zero browser-specific DOM dependencies. This delivers 60fps native UI responsiveness, minimal battery drain,
            and complete reliability in harsh outdoor construction yard environments.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-charcoal-850 border border-charcoal-800 space-y-2">
              <span className="font-mono text-amber-400 font-bold text-xs block">1. PavePort Business</span>
              <p className="text-[11px] text-charcoal-400">
                Yard manager handheld app. Features barcode / QR inventory audit scanning, instant quotation push notifications,
                and physical dispatch bay sign-offs.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-charcoal-850 border border-charcoal-800 space-y-2">
              <span className="font-mono text-blue-400 font-bold text-xs block">2. PavePort Customer</span>
              <p className="text-[11px] text-charcoal-400">
                Contractor on-site procurement app. Features geo-located supplier discovery, quick re-orders, digital
                purchase order approvals, and delivery OTP display.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-charcoal-850 border border-charcoal-800 space-y-2">
              <span className="font-mono text-purple-400 font-bold text-xs block">3. PavePort Delivery</span>
              <p className="text-[11px] text-charcoal-400">
                Driver haulage terminal. Engineered with high-contrast sunlight visibility tokens, extra-large touch targets,
                offline state persistence, and one-tap OTP verification.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Technical Stack */}
        <div className="p-5 rounded-xl bg-charcoal-900 border border-charcoal-800 space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Shared Mobile Technology Stack
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-lg bg-charcoal-850 border border-charcoal-800">
              <span className="font-bold text-white block">Expo SDK 52</span>
              <span className="text-[10px] text-charcoal-400">Continuous Native Tooling</span>
            </div>
            <div className="p-3 rounded-lg bg-charcoal-850 border border-charcoal-800">
              <span className="font-bold text-white block">NativeWind 4</span>
              <span className="text-[10px] text-charcoal-400">Tailwind Native Styling</span>
            </div>
            <div className="p-3 rounded-lg bg-charcoal-850 border border-charcoal-800">
              <span className="font-bold text-white block">Zustand & MMKV</span>
              <span className="text-[10px] text-charcoal-400">Sub-millisecond Offline State</span>
            </div>
            <div className="p-3 rounded-lg bg-charcoal-850 border border-charcoal-800">
              <span className="font-bold text-white block">Expo Haptics</span>
              <span className="text-[10px] text-charcoal-400">Tactile Driver Feedback</span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

