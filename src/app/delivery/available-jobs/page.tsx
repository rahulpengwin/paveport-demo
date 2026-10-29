'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/common/AppShell';
import { useDemoStore } from '@/stores/useDemoStore';
import {
  Truck,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function DeliveryAvailableJobsPage() {
  const router = useRouter();
  const {
    deliveryAssignments,
    activeDeliveryPartnerId,
    deliveryPartners,
    acceptDeliveryJob,
    setDemoStep,
  } = useDemoStore();

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const driver = deliveryPartners.find((d) => d.id === activeDeliveryPartnerId) || deliveryPartners[0];
  const availableJobs = deliveryAssignments.filter((a) => a.status === 'AVAILABLE');

  const handleAcceptJob = (assignmentId: string, orderNumber: string) => {
    const success = acceptDeliveryJob(assignmentId, driver.id);
    if (success) {
      setToastMsg(`Accepted haulage assignment for order ${orderNumber}! Proceeding to yard pickup.`);
      setTimeout(() => {
        setDemoStep(8);
        router.push('/delivery/active-delivery');
      }, 1500);
    } else {
      alert('This job has already been accepted by another fleet carrier!');
    }
  };

  return (
    <AppShell
      appType="delivery"
      title="Available Material Haulage Assignments"
      subtitle={`Live loads within ${driver.serviceZones.join(', ')} corridors ready for immediate yard pickup.`}
    >
      <div className="space-y-6">
        {toastMsg && (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between shadow-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold">{toastMsg}</span>
            </div>
            <span className="text-xs font-mono text-emerald-400">Opening active trip console...</span>
          </div>
        )}

        {/* Demo Hint Banner for Step 7 */}
        <div className="p-4 rounded-xl bg-construction-950/40 border border-construction-500/30 text-xs text-construction-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-4 h-4 text-construction-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white font-bold block mb-0.5">Demo Milestone Step 7:</strong>
              <span>
                Select an available load below and click <strong>Accept Delivery Assignment</strong> to claim the haulage contract!
              </span>
            </div>
          </div>
        </div>

        {/* Available Jobs Mobile Feed */}
        <div className="space-y-3">
          {availableJobs.length > 0 ? (
            availableJobs.map((job) => (
              <div
                key={job.id}
                className="p-4 rounded-2xl bg-charcoal-900 border border-charcoal-800 hover:border-construction-500/60 transition shadow-card space-y-3"
              >
                <div className="flex items-center justify-between border-b border-charcoal-800 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm font-bold text-construction-400">{job.orderNumber}</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-950/60 text-amber-400 border border-amber-800">
                      READY AT YARD
                    </span>
                  </div>
                  <span className="text-emerald-400 font-bold font-mono text-sm">
                    ₹{job.compensationAmount} Payout
                  </span>
                </div>

                {/* Pickup & Destination */}
                <div className="p-3 rounded-xl bg-charcoal-850 border border-charcoal-800 space-y-2 text-xs">
                  <div className="flex items-start space-x-2">
                    <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <span className="text-[9px] text-charcoal-400 uppercase font-mono block">Pickup Yard</span>
                      <span className="font-semibold text-white block truncate">{job.businessName}</span>
                      <p className="text-[10px] text-charcoal-400 truncate">{job.pickupAddress.street}, {job.pickupAddress.locality}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 pt-2 border-t border-charcoal-800/80">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <span className="text-[9px] text-charcoal-400 uppercase font-mono block">Delivery Site</span>
                      <span className="font-semibold text-white block truncate">{job.customerName}</span>
                      <p className="text-[10px] text-charcoal-400 truncate">{job.dropoffAddress.locality}, {job.dropoffAddress.city}</p>
                    </div>
                  </div>
                </div>

                {/* Cargo Details */}
                <div className="text-xs space-y-1">
                  <span className="text-[9px] text-charcoal-400 uppercase font-mono block">Cargo Manifest</span>
                  <p className="font-bold text-white text-xs">{job.itemsSummary}</p>
                  <p className="text-[10px] text-construction-400 font-mono">
                    Weight: {job.totalWeightTons} Tonnes &bull; Haul: {job.estimatedDistanceKm} km
                  </p>
                </div>

                {/* Accept Button */}
                <button
                  onClick={() => handleAcceptJob(job.id, job.orderNumber)}
                  className="w-full py-2.5 px-4 rounded-xl bg-construction-500 hover:bg-construction-400 active:scale-[0.98] text-charcoal-950 font-bold text-xs transition shadow-amber flex items-center justify-center space-x-2"
                >
                  <Truck className="w-4 h-4" />
                  <span>Accept Delivery Assignment (₹{job.compensationAmount})</span>
                </button>
              </div>
            ))
          ) : (
            <div className="p-12 rounded-2xl bg-charcoal-900 border border-charcoal-800 text-center space-y-3">
              <Truck className="w-12 h-12 text-charcoal-500 mx-auto" />
              <h4 className="text-base font-bold text-white">No New Available Jobs Right Now</h4>
              <p className="text-xs text-charcoal-400 max-w-sm mx-auto">
                All scheduled yard loads are currently claimed. When a supplier marks an order &quot;Ready for Dispatch&quot;, it
                will appear here immediately.
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

