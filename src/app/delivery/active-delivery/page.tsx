'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/common/AppShell';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useDemoStore } from '@/stores/useDemoStore';
import {
  Truck,
  CheckCircle2,
  MapPin,
  Building2,
  Phone,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Key,
} from 'lucide-react';

export default function DeliveryActiveDeliveryPage() {
  const router = useRouter();
  const {
    activeDeliveryPartnerId,
    deliveryPartners,
    deliveryAssignments,
    orders,
    confirmDeliveryPickup,
    markDeliveryInTransit,
    completeDelivery,
    reportDeliveryException,
    setDemoStep,
  } = useDemoStore();

  const driver = deliveryPartners.find((d) => d.id === activeDeliveryPartnerId) || deliveryPartners[0];

  // Find active assignment for this partner
  const assignment = deliveryAssignments.find(
    (a) =>
      a.partnerId === driver.id &&
      (a.status === 'ACCEPTED' || a.status === 'PICKED_UP' || a.status === 'IN_TRANSIT')
  );

  const order = assignment ? orders.find((o) => o.id === assignment.orderId) : null;

  const [enteredOtp, setEnteredOtp] = useState('');
  const [exceptionModalOpen, setExceptionModalOpen] = useState(false);
  const [exceptionReason, setExceptionReason] = useState('Customer site gate locked; waiting for security guard.');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleConfirmPickup = () => {
    if (!assignment) return;
    confirmDeliveryPickup(assignment.id);
  };

  const handleStartTransit = () => {
    if (!assignment) return;
    markDeliveryInTransit(assignment.id);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignment) return;

    setErrorMsg(null);
    const result = completeDelivery(assignment.id, enteredOtp.trim());
    if (result.success) {
      setSuccessMsg(result.message);
    } else {
      setErrorMsg(result.message);
    }
  };

  const handleReportException = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignment) return;
    reportDeliveryException(assignment.id, exceptionReason);
    setExceptionModalOpen(false);
    alert('Operational exception logged and flagged to logistics dispatch.');
  };

  return (
    <AppShell
      appType="delivery"
      title="Active Haulage Console & Site Verification"
      subtitle="Execute yard loading verification, in-transit telemetry, and OTP-secured drop-off."
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Success completion card */}
        {successMsg && (
          <div className="p-8 rounded-2xl bg-charcoal-900 border border-emerald-500/50 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Delivery Completed & Verified!</h3>
            <p className="text-xs text-charcoal-300 max-w-md mx-auto">{successMsg}</p>
            <div className="p-3 rounded-lg bg-charcoal-850 border border-charcoal-800 text-xs font-mono text-emerald-400 inline-block">
              + ₹{assignment?.compensationAmount} Credited to Driver Wallet
            </div>
            <div className="pt-2 flex justify-center space-x-3">
              <button
                onClick={() => {
                  setDemoStep(9);
                  router.push('/admin/overview');
                }}
                className="px-6 py-3 rounded-xl bg-construction-500 hover:bg-construction-400 text-charcoal-950 font-bold text-xs transition shadow-amber flex items-center space-x-2"
              >
                <span>Continue to Step 9 (View Admin Analytics)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {!successMsg && assignment && (
          <>
            {/* Step 8 Guidance */}
            <div className="p-4 rounded-xl bg-construction-950/40 border border-construction-500/30 text-xs text-construction-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start space-x-3">
                <Sparkles className="w-4 h-4 text-construction-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white font-bold block mb-0.5">Demo Milestone Step 8:</strong>
                  <span>
                    Advance the trip milestones: <strong>Confirm Pickup</strong> &bull; <strong>Mark In-Transit</strong> &bull; Then enter demo customer OTP <strong className="font-mono text-white underline">4829</strong> to complete verified drop-off!
                  </span>
                </div>
              </div>
            </div>

            {/* Main Assignment Mobile Card */}
            <div className="p-4 rounded-2xl bg-charcoal-900 border border-charcoal-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-charcoal-800 pb-2.5">
                <div>
                  <span className="text-[9px] font-mono uppercase text-charcoal-400 block">Haulage Assignment</span>
                  <h3 className="text-base font-bold text-white font-mono">{assignment.orderNumber}</h3>
                </div>
                <StatusBadge status={assignment.status} size="sm" />
              </div>

              {/* Progress Milestones Controls - Mobile Stack */}
              <div className="space-y-2">
                <button
                  onClick={handleConfirmPickup}
                  disabled={assignment.status === 'PICKED_UP' || assignment.status === 'IN_TRANSIT'}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 border active:scale-[0.98] ${
                    assignment.status === 'PICKED_UP' || assignment.status === 'IN_TRANSIT'
                      ? 'bg-emerald-950/40 border-emerald-800 text-emerald-400'
                      : 'bg-charcoal-800 hover:bg-charcoal-700 text-white border-charcoal-700'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>
                    {assignment.status === 'PICKED_UP' || assignment.status === 'IN_TRANSIT'
                      ? '✓ Confirmed Yard Pickup'
                      : '1. Confirm Yard Pickup'}
                  </span>
                </button>

                <button
                  onClick={handleStartTransit}
                  disabled={assignment.status === 'IN_TRANSIT'}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 border active:scale-[0.98] ${
                    assignment.status === 'IN_TRANSIT'
                      ? 'bg-purple-950/40 border-purple-800 text-purple-400 animate-pulse'
                      : 'bg-charcoal-800 hover:bg-charcoal-700 text-white border-charcoal-700'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>
                    {assignment.status === 'IN_TRANSIT' ? '✓ Currently In-Transit to Site' : '2. Start Transit to Site'}
                  </span>
                </button>
              </div>

              {/* Trip Addresses */}
              <div className="space-y-2 text-xs bg-charcoal-850 p-3 rounded-xl border border-charcoal-800">
                <div className="space-y-0.5">
                  <span className="text-[9px] text-charcoal-400 font-mono uppercase block">Origin Yard</span>
                  <span className="font-semibold text-white block">{assignment.businessName}</span>
                  <p className="text-charcoal-400 text-[10px]">
                    {assignment.pickupAddress.street}, {assignment.pickupAddress.locality}
                  </p>
                </div>

                <div className="space-y-0.5 pt-2 border-t border-charcoal-800/80">
                  <span className="text-[9px] text-charcoal-400 font-mono uppercase block">Site Destination</span>
                  <span className="font-semibold text-white block">{assignment.customerName}</span>
                  <p className="text-charcoal-400 text-[10px]">
                    {assignment.dropoffAddress.locality}, {assignment.dropoffAddress.city}
                  </p>
                  <p className="text-construction-400 font-mono text-[10px] pt-0.5">
                    Customer Phone: {assignment.customerPhone}
                  </p>
                </div>
              </div>

              {/* Material Payload */}
              <div className="p-3 rounded-xl bg-charcoal-850 border border-charcoal-800 text-xs">
                <span className="text-[9px] text-charcoal-400 uppercase font-mono block mb-0.5">Cargo Manifest</span>
                <p className="font-bold text-white text-xs">{assignment.itemsSummary}</p>
                <p className="text-charcoal-400 text-[10px] font-mono mt-0.5">
                  Weight: {assignment.totalWeightTons} Tonnes &bull; Compensation: ₹{assignment.compensationAmount}
                </p>
              </div>

              {/* OTP Proof of Delivery Form - Mobile Big Touch Inputs */}
              <div className="p-4 rounded-xl bg-charcoal-950 border border-construction-500/40 space-y-2.5">
                <div className="flex items-center space-x-2">
                  <Key className="w-4 h-4 text-construction-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Site Verification (OTP)
                  </h4>
                </div>

                <p className="text-[11px] text-charcoal-300">
                  Ask site supervisor for the 4-digit code (e.g. <strong className="text-white font-mono">4829</strong>) before unloading.
                </p>

                {errorMsg && (
                  <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="space-y-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 4829"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-white font-mono font-bold tracking-widest text-center text-lg focus:outline-none focus:border-construction-500"
                  />

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-construction-500 hover:bg-construction-400 active:scale-[0.98] text-charcoal-950 font-bold text-xs transition shadow-amber flex items-center justify-center space-x-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify OTP & Complete Delivery</span>
                  </button>
                </form>
              </div>

              {/* Exception Action */}
              <div className="pt-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => setExceptionModalOpen(true)}
                  className="text-[11px] text-charcoal-400 hover:text-rose-400 font-mono flex items-center space-x-1"
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span>Report Operational Exception</span>
                </button>
              </div>
            </div>
          </>
        )}

        {!successMsg && !assignment && (
          <div className="p-12 rounded-2xl bg-charcoal-900 border border-charcoal-800 text-center space-y-3">
            <Truck className="w-12 h-12 text-charcoal-500 mx-auto" />
            <h4 className="text-base font-bold text-white">No Active Haulage Assignment Claimed</h4>
            <p className="text-xs text-charcoal-400 max-w-sm mx-auto">
              Browse available yard jobs and click &quot;Accept Delivery&quot; to begin your loading run.
            </p>
            <button
              onClick={() => router.push('/delivery/available-jobs')}
              className="px-4 py-2 rounded-lg bg-construction-500 hover:bg-construction-400 text-charcoal-950 font-bold text-xs transition shadow-sm inline-flex items-center space-x-1"
            >
              <span>View Available Jobs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Exception Reporting Modal */}
        {exceptionModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-charcoal-900 border border-charcoal-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-charcoal-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center space-x-2 text-rose-400">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Report Delivery Exception</span>
                </h3>
                <button onClick={() => setExceptionModalOpen(false)} className="text-charcoal-400 hover:text-white">
                  &times;
                </button>
              </div>

              <form onSubmit={handleReportException} className="space-y-3 text-xs">
                <div>
                  <label className="block text-charcoal-300 font-semibold mb-1">Exception Category</label>
                  <select
                    value={exceptionReason}
                    onChange={(e) => setExceptionReason(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-charcoal-800 border border-charcoal-700 text-white focus:outline-none focus:border-construction-500"
                  >
                    <option value="Customer site gate locked; waiting for security guard.">
                      Customer Site Gate Locked
                    </option>
                    <option value="Narrow road obstruction; unable to maneuver flatbed.">
                      Narrow Road Clearance Obstruction
                    </option>
                    <option value="Rainstorm / wet weather; waiting under tarp.">Severe Monsoon Weather Delay</option>
                    <option value="Material inspection dispute by site contractor.">Material Dispute at Site</option>
                  </select>
                </div>

                <div className="pt-3 border-t border-charcoal-800 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setExceptionModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-charcoal-400 hover:bg-charcoal-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold transition shadow-sm"
                  >
                    Log Exception
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

