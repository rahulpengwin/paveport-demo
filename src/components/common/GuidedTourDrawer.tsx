'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDemoStore, DEMO_WORKFLOW_STEPS } from '@/stores/useDemoStore';
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Store,
  ShoppingCart,
  Truck,
  RotateCcw,
} from 'lucide-react';

export const GuidedTourDrawer: React.FC = () => {
  const router = useRouter();
  const {
    guidedTourOpen,
    toggleGuidedTour,
    currentDemoStep,
    setDemoStep,
    advanceDemoStep,
    resetDemoData,
  } = useDemoStore();

  if (!guidedTourOpen) return null;

  const currentStep = DEMO_WORKFLOW_STEPS.find((s) => s.stepNumber === currentDemoStep) || DEMO_WORKFLOW_STEPS[0];

  const getActorIcon = (actor: string) => {
    switch (actor) {
      case 'ADMIN':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'BUSINESS':
        return <Store className="w-4 h-4 text-amber-400" />;
      case 'CUSTOMER':
        return <ShoppingCart className="w-4 h-4 text-blue-400" />;
      case 'DELIVERY':
        return <Truck className="w-4 h-4 text-purple-400" />;
      default:
        return <HelpCircle className="w-4 h-4" />;
    }
  };

  const handleJumpToStep = (stepNumber: number) => {
    setDemoStep(stepNumber);
    const step = DEMO_WORKFLOW_STEPS.find((s) => s.stepNumber === stepNumber);
    if (step) {
      router.push(step.route);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-charcoal-900 border-l border-charcoal-700 shadow-2xl flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-charcoal-800 flex items-center justify-between bg-charcoal-950">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-construction-500/10 border border-construction-500/30 text-construction-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Interactive Guided Demo</h2>
            <p className="text-[11px] text-charcoal-400">9-Step Synchronized Multi-App Journey</p>
          </div>
        </div>

        <button
          onClick={toggleGuidedTour}
          className="p-1 rounded-lg text-charcoal-400 hover:text-white hover:bg-charcoal-800 transition"
          aria-label="Close Tour"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="px-4 py-2 bg-charcoal-850 border-b border-charcoal-800 flex items-center justify-between text-xs">
        <span className="text-charcoal-300 font-mono text-[11px]">
          Step {currentDemoStep} of {DEMO_WORKFLOW_STEPS.length}
        </span>
        <div className="w-40 bg-charcoal-700 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-construction-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${(currentDemoStep / DEMO_WORKFLOW_STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Active Step Highlight Card */}
      <div className="p-5 overflow-y-auto flex-1 space-y-5">
        <div className="p-4 rounded-xl bg-charcoal-800/80 border border-charcoal-700 space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-charcoal-900 border border-charcoal-700 text-charcoal-200">
              {getActorIcon(currentStep.actor)}
              <span>{currentStep.actor} APP</span>
            </span>
            <span className="text-[11px] text-construction-400 font-mono font-semibold">
              Step #{currentStep.stepNumber}
            </span>
          </div>

          <h3 className="text-base font-bold text-white tracking-tight">{currentStep.title}</h3>

          <p className="text-xs text-charcoal-300 leading-relaxed">{currentStep.description}</p>

          <div className="p-3 rounded-lg bg-construction-950/40 border border-construction-500/20 text-xs text-construction-200">
            <strong className="text-construction-400 block mb-1">What to do next:</strong>
            {currentStep.actionHint}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <Link
              href={currentStep.route}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-construction-500 hover:bg-construction-400 text-charcoal-950 font-bold text-xs transition shadow-sm"
            >
              <span>Take Me to Screen</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={advanceDemoStep}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-charcoal-600 hover:bg-charcoal-700 text-xs text-white font-medium transition"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Step-by-Step Overview List */}
        <div>
          <h4 className="text-xs font-bold text-charcoal-400 uppercase tracking-wider mb-2">
            Complete Journey Stepper
          </h4>
          <div className="space-y-1.5">
            {DEMO_WORKFLOW_STEPS.map((s) => {
              const isCurrent = s.stepNumber === currentDemoStep;
              const isDone = s.stepNumber < currentDemoStep;

              return (
                <button
                  key={s.stepNumber}
                  onClick={() => handleJumpToStep(s.stepNumber)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs flex items-center justify-between transition border ${
                    isCurrent
                      ? 'bg-charcoal-800 border-construction-500/60 text-white font-medium'
                      : isDone
                      ? 'bg-charcoal-950/40 border-charcoal-800 text-charcoal-400 hover:bg-charcoal-800'
                      : 'border-transparent text-charcoal-400 hover:bg-charcoal-800/50'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono ${
                        isCurrent
                          ? 'bg-construction-500 text-charcoal-950'
                          : isDone
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-charcoal-800 text-charcoal-400'
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-3 h-3" /> : s.stepNumber}
                    </span>
                    <span className="truncate max-w-[240px]">{s.title}</span>
                  </div>

                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-charcoal-900 border border-charcoal-800 text-charcoal-400">
                    {s.actor}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="p-4 border-t border-charcoal-800 bg-charcoal-950 flex items-center justify-between">
        <button
          onClick={() => setDemoStep(Math.max(1, currentDemoStep - 1))}
          disabled={currentDemoStep === 1}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-charcoal-700 text-xs text-charcoal-300 hover:text-white disabled:opacity-40 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        <button
          onClick={resetDemoData}
          className="flex items-center space-x-1 text-xs text-charcoal-400 hover:text-amber-400 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo</span>
        </button>

        <button
          onClick={advanceDemoStep}
          disabled={currentDemoStep === DEMO_WORKFLOW_STEPS.length}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-construction-500 hover:bg-construction-400 text-charcoal-950 font-bold text-xs disabled:opacity-40 transition"
        >
          <span>Next Step</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

