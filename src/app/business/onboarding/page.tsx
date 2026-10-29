'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/common/AppShell';
import { useDemoStore } from '@/stores/useDemoStore';
import {
  Building2,
  CheckCircle2,
  FileText,
  Clock,
  MapPin,
  ShieldCheck,
  Upload,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

export default function BusinessOnboardingPage() {
  const { businesses, activeBusinessId } = useDemoStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const business = businesses.find((b) => b.id === activeBusinessId) || businesses[0];

  const steps = [
    { num: 1, title: 'Business Info' },
    { num: 2, title: 'Owner & Contact' },
    { num: 3, title: 'Yard Address' },
    { num: 4, title: 'Material Categories' },
    { num: 5, title: 'Coverage Pincodes' },
    { num: 6, title: 'Operating Hours' },
    { num: 7, title: 'Legal Documents' },
    { num: 8, title: 'Verification Status' },
  ];

  return (
    <AppShell
      appType="business"
      title="Store Registration & Statutory Onboarding"
      subtitle="Complete multi-step verified vendor enrollment with GSTIN compliance and BBMP trade licenses."
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Mobile Step Indicator & Progress */}
        <div className="bg-charcoal-900 border border-charcoal-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-[11px] text-construction-400 font-bold uppercase tracking-wider">
              Step {currentStep} of 8
            </span>
            <span className="font-bold text-white text-xs">{steps[currentStep - 1].title}</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-charcoal-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-construction-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 8) * 100}%` }}
            />
          </div>

          {/* Step Pill Indicators */}
          <div className="flex items-center justify-between gap-1 pt-1">
            {steps.map((s) => (
              <button
                key={s.num}
                onClick={() => setCurrentStep(s.num)}
                title={s.title}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  currentStep === s.num
                    ? 'bg-construction-400 h-2'
                    : s.num < currentStep
                    ? 'bg-emerald-400'
                    : 'bg-charcoal-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Content Card */}
        <div className="bg-charcoal-900 border border-charcoal-800 rounded-xl p-6 shadow-card space-y-4">
          {currentStep === 1 && (
            <div className="space-y-3 text-xs">
              <h3 className="text-base font-bold text-white">Step 1: Registered Entity Information</h3>
              <p className="text-charcoal-400">Official legal entity name and corporate registration identification.</p>
              <div>
                <label className="block font-semibold text-charcoal-300 mb-1">Business Trade Name</label>
                <input
                  type="text"
                  defaultValue={business.name}
                  className="w-full p-2.5 rounded-lg bg-charcoal-800 border border-charcoal-700 text-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-charcoal-300 mb-1">GSTIN Number</label>
                <input
                  type="text"
                  defaultValue={business.registrationNumber}
                  className="w-full p-2.5 rounded-lg bg-charcoal-800 border border-charcoal-700 text-white font-mono"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-3 text-xs">
              <h3 className="text-base font-bold text-white">Step 2: Proprietor / Owner Contact</h3>
              <div>
                <label className="block font-semibold text-charcoal-300 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  defaultValue={business.ownerName}
                  className="w-full p-2.5 rounded-lg bg-charcoal-800 border border-charcoal-700 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal-300 mb-1">Mobile Phone (OTP verification)</label>
                  <input
                    type="text"
                    defaultValue={business.ownerPhone}
                    className="w-full p-2.5 rounded-lg bg-charcoal-800 border border-charcoal-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal-300 mb-1">Official Email Address</label>
                  <input
                    type="email"
                    defaultValue={business.ownerEmail}
                    className="w-full p-2.5 rounded-lg bg-charcoal-800 border border-charcoal-700 text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-3 text-xs">
              <h3 className="text-base font-bold text-white">Step 3: Yard Address & GPS Coordinates</h3>
              <div>
                <label className="block font-semibold text-charcoal-300 mb-1">Street Address</label>
                <input
                  type="text"
                  defaultValue={business.address.street}
                  className="w-full p-2.5 rounded-lg bg-charcoal-800 border border-charcoal-700 text-white"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal-300 mb-1">Locality</label>
                  <input
                    type="text"
                    defaultValue={business.address.locality}
                    className="w-full p-2.5 rounded-lg bg-charcoal-800 border border-charcoal-700 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal-300 mb-1">City</label>
                  <input
                    type="text"
                    defaultValue={business.address.city}
                    className="w-full p-2.5 rounded-lg bg-charcoal-800 border border-charcoal-700 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal-300 mb-1">Postal Pincode</label>
                  <input
                    type="text"
                    defaultValue={business.address.pincode}
                    className="w-full p-2.5 rounded-lg bg-charcoal-800 border border-charcoal-700 text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep >= 4 && currentStep <= 6 && (
            <div className="space-y-3 text-xs">
              <h3 className="text-base font-bold text-white">Configuration Parameters</h3>
              <p className="text-charcoal-300">
                Serviceable Pincodes: <span className="font-mono text-construction-400 font-bold">{business.serviceablePincodes.join(', ')}</span>
              </p>
              <p className="text-charcoal-300">
                Operating Schedule: <span className="font-mono text-white font-bold">{business.operatingHours}</span>
              </p>
            </div>
          )}

          {currentStep === 7 && (
            <div className="space-y-4 text-xs">
              <h3 className="text-base font-bold text-white">Step 7: Upload Statutory Trade Documents</h3>
              <div className="space-y-2">
                {business.documents.map((d) => (
                  <div
                    key={d.id}
                    className="p-3 rounded-lg bg-charcoal-850 border border-charcoal-800 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-construction-400" />
                      <div>
                        <p className="font-bold text-white">{d.documentName}</p>
                        <p className="font-mono text-[10px] text-charcoal-400">Doc #: {d.documentNumber}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                      ATTACHED SAMPLE
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 8 && (
            <div className="space-y-4 text-xs text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">Verification Status: {business.verificationStatus}</h3>
              <p className="text-charcoal-400 max-w-md mx-auto">
                {business.verificationNotes ||
                  'Your store profile and legal documentation have been verified. You have full trading access on PavePort.'}
              </p>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-charcoal-800 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-3.5 py-1.5 rounded-lg border border-charcoal-700 text-charcoal-300 hover:text-white disabled:opacity-40 text-xs flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              onClick={() => setCurrentStep(Math.min(8, currentStep + 1))}
              disabled={currentStep === 8}
              className="px-4 py-1.5 rounded-lg bg-construction-500 hover:bg-construction-400 text-charcoal-950 font-bold text-xs disabled:opacity-40 flex items-center space-x-1"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

