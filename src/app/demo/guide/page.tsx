'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDemoStore, DEMO_WORKFLOW_STEPS } from '@/stores/useDemoStore';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Store,
  ShoppingCart,
  Truck,
  CheckCircle2,
  RotateCcw,
  ExternalLink,
  Layers,
  ChevronRight,
} from 'lucide-react';

export default function DemoGuidePage() {
  const router = useRouter();
  const { currentDemoStep, setDemoStep, resetDemoData, currentRole } = useDemoStore();

  const currentStep = DEMO_WORKFLOW_STEPS.find((s) => s.stepNumber === currentDemoStep) || DEMO_WORKFLOW_STEPS[0];

  const handleLaunchStep = (stepNumber: number) => {
    setDemoStep(stepNumber);
    const step = DEMO_WORKFLOW_STEPS.find((s) => s.stepNumber === stepNumber);
    if (step) {
      router.push(step.route);
    }
  };

  const getActorBadge = (actor: string) => {
    switch (actor) {
      case 'ADMIN':
        return <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800">ADMIN PORTAL</span>;
      case 'BUSINESS':
        return <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-950/60 text-amber-400 border border-amber-800">BUSINESS APP</span>;
      case 'CUSTOMER':
        return <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-blue-950/60 text-blue-400 border border-blue-800">CUSTOMER APP</span>;
      case 'DELIVERY':
        return <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-purple-950/60 text-purple-400 border border-purple-800">DELIVERY APP</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-construction-500/10 border border-construction-500/30 text-construction-400 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Multi-App Demonstration Guide</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Client Presentation Walkthrough
          </h1>
          <p className="text-sm text-charcoal-300 max-w-2xl mx-auto leading-relaxed">
            This guided roadmap demonstrates how PavePort’s four products interact across an authentic construction
            material procurement and fulfillment lifecycle.
          </p>
        </div>

        {/* Current Active Step Banner */}
        <div className="rounded-2xl border border-construction-500/40 bg-gradient-to-r from-construction-950/40 via-charcoal-900 to-charcoal-900 p-6 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center space-x-3">
                <span className="text-xs font-mono font-bold text-construction-400 uppercase tracking-wider">
                  Active Milestone #{currentStep.stepNumber} of {DEMO_WORKFLOW_STEPS.length}
                </span>
                {getActorBadge(currentStep.actor)}
              </div>

              <h2 className="text-2xl font-bold text-white tracking-tight">{currentStep.title}</h2>
              <p className="text-xs sm:text-sm text-charcoal-300 leading-relaxed">{currentStep.description}</p>

              <div className="p-3 rounded-xl bg-charcoal-950/80 border border-charcoal-800 text-xs text-construction-300 flex items-start space-x-2">
                <Sparkles className="w-4 h-4 text-construction-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block mb-0.5">Recommended Presenter Action:</span>
                  {currentStep.actionHint}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
              <button
                onClick={() => handleLaunchStep(currentStep.stepNumber)}
                className="px-6 py-3 rounded-xl bg-construction-500 hover:bg-construction-400 text-charcoal-950 font-bold text-sm transition shadow-amber flex items-center justify-center space-x-2"
              >
                <span>Go to Screen</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={resetDemoData}
                className="px-4 py-2.5 rounded-xl border border-charcoal-700 hover:bg-charcoal-800 text-charcoal-300 text-xs font-semibold flex items-center justify-center space-x-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Demo State</span>
              </button>
            </div>
          </div>
        </div>

        {/* Step-by-Step Interactive Map */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-charcoal-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              The 9-Step End-to-End Workflow Map
            </h3>
            <span className="text-xs text-charcoal-400 font-mono">Click any step to switch actor & jump</span>
          </div>

          <div className="space-y-3">
            {DEMO_WORKFLOW_STEPS.map((step) => {
              const isCurrent = step.stepNumber === currentDemoStep;
              const isCompleted = step.stepNumber < currentDemoStep;

              return (
                <div
                  key={step.stepNumber}
                  onClick={() => handleLaunchStep(step.stepNumber)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isCurrent
                      ? 'bg-charcoal-850 border-construction-500 shadow-md ring-1 ring-construction-500/30'
                      : 'bg-charcoal-900 border-charcoal-800 hover:border-charcoal-700 hover:bg-charcoal-850/50'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 ${
                        isCurrent
                          ? 'bg-construction-500 text-charcoal-950'
                          : isCompleted
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-charcoal-800 text-charcoal-400'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : step.stepNumber}
                    </span>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-white tracking-tight">{step.title}</h4>
                        {getActorBadge(step.actor)}
                      </div>
                      <p className="text-xs text-charcoal-300 leading-relaxed">{step.description}</p>
                      <p className="text-[11px] text-charcoal-400 font-mono mt-1">Route: {step.route}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                    <span className="text-xs text-construction-400 font-semibold group-hover:underline flex items-center">
                      Launch <ChevronRight className="w-4 h-4 ml-0.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Technical Architecture Quick Link */}
        <div className="p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">Need to inspect the production technical architecture?</h4>
            <p className="text-xs text-charcoal-400">
              Review Go REST v1 API designs, Neon PostgreSQL DDL schemas, Redis queues, and Expo React Native mobile specs.
            </p>
          </div>
          <Link
            href="/architecture/overview"
            className="px-4 py-2 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 border border-charcoal-700 text-white font-semibold text-xs transition shrink-0 flex items-center space-x-2"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Architecture Docs</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

