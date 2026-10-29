'use client';

import React from 'react';
import { AppShell } from '@/components/common/AppShell';
import { KpiCard } from '@/components/common/KpiCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useDemoStore } from '@/stores/useDemoStore';
import Link from 'next/link';
import {
  Truck,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Phone,
} from 'lucide-react';

export default function DeliveryOverviewPage() {
  const {
    activeDeliveryPartnerId,
    deliveryPartners,
    deliveryAssignments,
    toggleDeliveryPartnerOnline,
    setDemoStep,
  } = useDemoStore();

  const driver = deliveryPartners.find((d) => d.id === activeDeliveryPartnerId) || deliveryPartners[0];
  const availableJobs = deliveryAssignments.filter((a) => a.status === 'AVAILABLE');
  const activeTrip = deliveryAssignments.find(
    (a) => a.partnerId === driver.id && (a.status === 'ACCEPTED' || a.status === 'PICKED_UP' || a.status === 'IN_TRANSIT')
  );

  return (
    <AppShell
      appType="delivery"
      title="Driver Terminal & Fleet Haulage"
      subtitle={`${driver.name} • ${driver.vehicleNumber} • Capacity: ${driver.capacityTonnes} Tonnes`}
      action={
        <button
          onClick={() => toggleDeliveryPartnerOnline(driver.id)}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center space-x-2 border shadow-sm ${
            driver.isOnline
              ? 'bg-emerald-500 hover:bg-emerald-400 text-charcoal-950 border-emerald-400'
              : 'bg-charcoal-800 hover:bg-charcoal-700 text-charcoal-300 border-charcoal-700'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${driver.isOnline ? 'bg-charcoal-950 animate-ping' : 'bg-charcoal-500'}`} />
          <span>{driver.isOnline ? 'ONLINE & READY FOR LOADS' : 'GO ONLINE'}</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Step 7 Demo Guidance Banner */}
        <div className="p-4 rounded-xl bg-construction-950/40 border border-construction-500/30 text-xs text-construction-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-4 h-4 text-construction-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white font-bold block mb-0.5">Demo Milestone Step 7:</strong>
              <span>
                Acting as driver <strong>{driver.name}</strong> ({driver.vehicleType}), inspect available haulage assignments in your zone and click <strong>Accept Delivery</strong>!
              </span>
            </div>
          </div>
          <Link
            href="/delivery/available-jobs"
            className="px-3.5 py-1.5 rounded-lg bg-construction-500 hover:bg-construction-400 text-charcoal-950 font-bold text-xs shrink-0 transition flex items-center space-x-1"
          >
            <span>View Available Jobs ({availableJobs.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Driver KPIs - Mobile 2x2 Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <KpiCard
            title="Today's Earnings"
            value={`₹${driver.earningsToday.toLocaleString('en-IN')}`}
            subtitle="Credited to wallet"
            icon={TrendingUp}
            accentColor="emerald"
          />

          <KpiCard
            title="Available Jobs"
            value={availableJobs.length}
            subtitle="Nearby corridors"
            icon={Truck}
            accentColor="amber"
          />

          <KpiCard
            title="Today's Loads"
            value={`${driver.todayTrips} Loads`}
            subtitle={`${driver.completedTrips} all-time safe`}
            icon={CheckCircle2}
            accentColor="blue"
          />

          <KpiCard
            title="Safety Rating"
            value={`${driver.rating} ★`}
            subtitle="Verified rating"
            icon={Clock}
            accentColor="charcoal"
          />
        </div>

        {/* Active Trip Banner if Driver has an in-progress assignment */}
        {activeTrip ? (
          <div className="p-4 rounded-2xl bg-charcoal-900 border border-purple-500/50 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                <span className="text-[10px] font-mono font-bold text-purple-400 uppercase">
                  Active In-Progress Load
                </span>
              </div>
              <StatusBadge status={activeTrip.status} size="sm" />
            </div>

            <div className="space-y-1.5 text-xs bg-charcoal-850 p-3 rounded-xl border border-charcoal-800">
              <div>
                <span className="text-[9px] text-charcoal-400 font-mono uppercase block">Pickup Yard</span>
                <h4 className="text-xs font-bold text-white">{activeTrip.businessName}</h4>
                <p className="text-charcoal-400 text-[10px] truncate">{activeTrip.itemsSummary}</p>
              </div>

              <div className="pt-1.5 border-t border-charcoal-800">
                <span className="text-[9px] text-charcoal-400 font-mono uppercase block">Delivery Site</span>
                <h4 className="text-xs font-bold text-white">{activeTrip.customerName}</h4>
                <p className="text-charcoal-400 text-[10px]">
                  {activeTrip.dropoffAddress.locality}, {activeTrip.dropoffAddress.city}
                </p>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white">
                Payout: ₹{activeTrip.compensationAmount}
              </span>
              <Link
                href="/delivery/active-delivery"
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition flex items-center space-x-1"
              >
                <span>Console & OTP</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800 text-center space-y-2.5">
            <Truck className="w-8 h-8 text-charcoal-500 mx-auto" />
            <h4 className="text-xs font-bold text-white">No Active Haulage Assignment</h4>
            <p className="text-[11px] text-charcoal-400 max-w-xs mx-auto">
              You are online. Check available loads board to claim jobs waiting at local yards.
            </p>
            <Link
              href="/delivery/available-jobs"
              className="inline-flex items-center space-x-1 px-3.5 py-1.5 rounded-xl bg-construction-500 hover:bg-construction-400 text-charcoal-950 font-bold text-xs transition shadow-sm"
            >
              <span>Browse Jobs ({availableJobs.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </AppShell>
  );
}

