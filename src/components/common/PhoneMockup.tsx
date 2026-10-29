'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDemoStore } from '@/stores/useDemoStore';
import {
  Smartphone,
  Maximize2,
  Minimize2,
  Wifi,
  Battery,
  Signal,
  RotateCw,
  ExternalLink,
  ChevronLeft,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface PhoneMockupProps {
  appType: 'business' | 'customer' | 'delivery';
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  navItems: Array<{
    label: string;
    href: string;
    icon: React.ElementType;
    badge?: string | number;
  }>;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  appType,
  children,
  title,
  subtitle,
  action,
  navItems,
}) => {
  const pathname = usePathname();
  const { currentRole, currentDemoStep, advanceDemoStep } = useDemoStore();
  const [deviceFinish, setDeviceFinish] = useState<'titanium' | 'black' | 'amber'>('black');
  const [viewMode, setViewMode] = useState<'mockup' | 'expanded'>('mockup');
  const [currentTime, setCurrentTime] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      setCurrentTime(`${formattedHours}:${formattedMinutes}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  const appMeta = {
    business: {
      badge: 'PavePort Business',
      tagline: 'Handheld Yard ERP & Inventory Scanner',
      accentColor: 'text-amber-400',
      accentBg: 'bg-amber-500',
      activePersona: 'Venkatesh Murthy (Sri Lakshmi Cement)',
      role: 'BUSINESS_OWNER',
    },
    customer: {
      badge: 'PavePort Customer',
      tagline: 'Mobile Procurement & Job-Site Delivery Sign-Off',
      accentColor: 'text-blue-400',
      accentBg: 'bg-blue-500',
      activePersona: 'Ramesh Kumar (InfraBuild Constructions)',
      role: 'CUSTOMER',
    },
    delivery: {
      badge: 'PavePort Delivery',
      tagline: 'In-Cab Haulage Terminal & OTP Verification',
      accentColor: 'text-purple-400',
      accentBg: 'bg-purple-500',
      activePersona: 'Murugan Selvam (Tata Ace 1.25T)',
      role: 'DELIVERY_PARTNER',
    },
  }[appType];

  const finishStyles = {
    black: {
      chassis: 'bg-gradient-to-b from-[#202227] via-[#0d0f12] to-[#181a1f] border-[#363b44]',
      rim: 'ring-[#262a30]',
      shadow: 'shadow-[0_30px_90px_-15px_rgba(0,0,0,0.95),0_0_40px_rgba(0,0,0,0.9)]',
      metalHighlight: 'border-t-[#4c535f] border-b-[#14161a]',
    },
    titanium: {
      chassis: 'bg-gradient-to-b from-[#404349] via-[#24272c] to-[#35393f] border-[#555b65]',
      rim: 'ring-[#5f6672]',
      shadow: 'shadow-[0_30px_90px_-15px_rgba(0,0,0,0.95),0_0_40px_rgba(148,163,184,0.2)]',
      metalHighlight: 'border-t-[#788190] border-b-[#1e2024]',
    },
    amber: {
      chassis: 'bg-gradient-to-b from-[#3a2610] via-[#1a1107] to-[#2d1e0d] border-[#853b0e]',
      rim: 'ring-[#9a4511]',
      shadow: 'shadow-[0_30px_90px_-15px_rgba(0,0,0,0.95),0_0_45px_rgba(245,158,11,0.25)]',
      metalHighlight: 'border-t-[#b45309] border-b-[#1c0f05]',
    },
  }[deviceFinish];

  if (viewMode === 'expanded') {
    return (
      <div className="min-h-screen bg-charcoal-950 text-slate-100 p-4 sm:p-8">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex items-center justify-between bg-charcoal-900 border border-charcoal-800 p-4 rounded-xl">
            <div>
              <span className={`text-xs font-mono font-bold uppercase ${appMeta.accentColor}`}>{appMeta.badge}</span>
              <h2 className="text-sm font-bold text-white">Full-Width Preview Mode</h2>
            </div>
            <button
              onClick={() => setViewMode('mockup')}
              className="px-3.5 py-1.5 rounded-lg bg-construction-500 hover:bg-construction-400 text-charcoal-950 font-bold text-xs flex items-center space-x-1.5 transition"
            >
              <Smartphone className="w-4 h-4" />
              <span>Return to In-Hand Phone Mockup</span>
            </button>
          </div>
          <div className="bg-charcoal-900/60 border border-charcoal-800 rounded-2xl p-6">{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-charcoal-900/80 via-charcoal-950 to-charcoal-950 py-6 sm:py-10 px-2 sm:px-6 flex items-center justify-center">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
        {/* Left Side: Presentation Companion Panel on Desktop */}
        <div className="hidden lg:flex flex-col justify-between w-80 space-y-6 shrink-0 text-xs">
          {/* App Header Card */}
          <div className="p-5 rounded-2xl bg-charcoal-900 border border-charcoal-800 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-mono font-bold uppercase tracking-wider ${appMeta.accentColor}`}>
                {appMeta.badge}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <h2 className="text-lg font-bold text-white tracking-tight leading-snug">
              Real Mobile App In-Hand View
            </h2>

            <p className="text-charcoal-300 text-xs leading-relaxed">{appMeta.tagline}</p>

            <div className="pt-2 border-t border-charcoal-800 text-[11px] space-y-1">
              <span className="text-charcoal-400 block font-mono">Active In-App Persona:</span>
              <span className="font-semibold text-white block">{appMeta.activePersona}</span>
            </div>
          </div>

          {/* Quick Screen Navigator */}
          <div className="p-5 rounded-2xl bg-charcoal-900 border border-charcoal-800 space-y-3 shadow-xl">
            <h4 className="text-[11px] font-bold text-charcoal-400 uppercase tracking-wider font-mono">
              In-App Screen Navigation
            </h4>
            <div className="space-y-1">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                      active
                        ? 'bg-construction-500/10 text-construction-400 border border-construction-500/30 font-semibold'
                        : 'text-charcoal-400 hover:text-white hover:bg-charcoal-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <item.icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </div>
                    {Boolean(item.badge) && (
                      <span className="px-1.5 py-0.2 rounded-full bg-construction-500 text-charcoal-950 font-mono text-[10px] font-bold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Device Chassis & Presentation Controls */}
          <div className="p-5 rounded-2xl bg-charcoal-900 border border-charcoal-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-charcoal-400 uppercase tracking-wider font-mono">
                Device Finish
              </span>
              <div className="flex items-center space-x-1.5">
                {[
                  { id: 'black', color: 'bg-charcoal-900 border-charcoal-600', label: 'Space Black' },
                  { id: 'titanium', color: 'bg-slate-500 border-slate-400', label: 'Natural Titanium' },
                  { id: 'amber', color: 'bg-amber-600 border-amber-400', label: 'Safety Amber' },
                ].map((f) => (
                  <button
                    key={f.id}
                    title={f.label}
                    onClick={() => setDeviceFinish(f.id as any)}
                    className={`w-4 h-4 rounded-full border transition-transform ${f.color} ${
                      deviceFinish === f.id ? 'scale-125 ring-2 ring-construction-400' : 'opacity-70 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={() => setViewMode('expanded')}
              className="w-full py-2 px-3 rounded-xl border border-charcoal-700 hover:bg-charcoal-800 text-charcoal-300 hover:text-white transition flex items-center justify-center space-x-2 text-xs font-medium"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Expand to Full-Width</span>
            </button>
          </div>
        </div>

        {/* Center: The Photorealistic Smartphone Mockup */}
        <div className="relative group">
          {/* Antenna Bands on side frame */}
          <div className="hidden sm:block absolute -left-[12px] top-20 w-[3px] h-1.5 bg-[#454a54] rounded-sm" />
          <div className="hidden sm:block absolute -left-[12px] bottom-24 w-[3px] h-1.5 bg-[#454a54] rounded-sm" />
          <div className="hidden sm:block absolute -right-[12px] top-20 w-[3px] h-1.5 bg-[#454a54] rounded-sm" />
          <div className="hidden sm:block absolute -right-[12px] bottom-24 w-[3px] h-1.5 bg-[#454a54] rounded-sm" />

          {/* Physical Side Buttons on phone body */}
          <div className="hidden sm:block absolute -left-[14px] top-28 w-[4px] h-9 bg-charcoal-700 rounded-l-sm" />
          <div className="hidden sm:block absolute -left-[14px] top-40 w-[4px] h-12 bg-charcoal-700 rounded-l-sm" />
          <div className="hidden sm:block absolute -left-[14px] top-56 w-[4px] h-12 bg-charcoal-700 rounded-l-sm" />
          <div className="hidden sm:block absolute -right-[14px] top-36 w-[4px] h-16 bg-charcoal-700 rounded-r-sm" />

          {/* Smartphone Outer Chassis */}
          <div
            className={`w-[360px] sm:w-[395px] h-[780px] sm:h-[825px] p-[10px] rounded-[50px] border-[3px] ring-1 transition-all duration-300 ${finishStyles.chassis} ${finishStyles.rim} ${finishStyles.shadow} ${finishStyles.metalHighlight} flex flex-col relative select-none`}
          >
            {/* Top Ear Speaker Grille */}
            <div className="w-12 h-1 bg-charcoal-600/90 rounded-full mx-auto -mt-0.5 mb-1 shrink-0 z-40" />

            {/* Inner Screen Glass with rounded display borders */}
            <div className="w-full h-full rounded-[42px] overflow-hidden bg-charcoal-950 flex flex-col border border-charcoal-800/60 relative">
              {/* Subtle Screen Reflection Glare */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.015] to-white/[0.04] rounded-[42px] z-20" />
              {/* Top Sensor Notch / Dynamic Island & Native Status Bar */}
              <div className="pt-2 px-6 pb-1 bg-charcoal-950 shrink-0 z-30 select-none">
                {/* Dynamic Island Pill */}
                <div className="w-24 h-6 bg-black rounded-full mx-auto mb-1 flex items-center justify-between px-2.5 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-[#171c26] border border-[#2b3342]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-black flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0a1a36]" />
                  </div>
                </div>

                {/* Status Bar: Time & Telemetry */}
                <div className="flex items-center justify-between text-[11px] font-mono text-white font-semibold px-1">
                  <span>{currentTime}</span>
                  <div className="flex items-center space-x-1.5 text-charcoal-300">
                    <Signal className="w-3 h-3 text-white" />
                    <span className="text-[9px] font-bold text-white">5G</span>
                    <Wifi className="w-3 h-3 text-white" />
                    <div className="flex items-center space-x-0.5">
                      <div className="w-4 h-2.5 rounded-sm border border-white/70 p-[1px] flex items-center">
                        <div className="w-full h-full bg-emerald-400 rounded-2px" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* In-App Mobile Top App Bar */}
              <div className="px-4 py-2 bg-charcoal-950/90 backdrop-blur-md border-b border-charcoal-800/80 flex items-center justify-between shrink-0 z-20">
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${appMeta.accentBg}`} />
                  <span className="text-xs font-bold text-white tracking-tight">{appMeta.badge}</span>
                </div>
                {action && <div className="scale-90 origin-right">{action}</div>}
              </div>

              {/* Scrollable Mobile Page Body (Inside Phone) */}
              <div
                className="flex-1 overflow-y-auto px-4 py-4 space-y-4 overscroll-contain text-xs"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                {/* Page Title & Subtitle inside mobile screen */}
                {(title || subtitle) && (
                  <div className="space-y-0.5 pb-1">
                    {title && <h1 className="text-base font-bold text-white tracking-tight">{title}</h1>}
                    {subtitle && <p className="text-[11px] text-charcoal-400 leading-normal">{subtitle}</p>}
                  </div>
                )}

                {/* The Mobile Page Contents */}
                {children}
              </div>

              {/* In-Phone Native Bottom Tab Navigation Bar */}
              <div className="px-2 py-2 bg-charcoal-900/95 backdrop-blur-md border-t border-charcoal-800/80 shrink-0 z-30">
                <div className="flex items-center justify-around">
                  {navItems.slice(0, 5).map((item) => {
                    const active =
                      pathname === item.href ||
                      (item.href !== '/customer/home' &&
                        item.href !== '/business/overview' &&
                        item.href !== '/delivery/overview' &&
                        pathname.startsWith(item.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex flex-col items-center space-y-0.5 text-[9px] py-1 px-2 rounded-xl transition-transform active:scale-90 relative ${
                          active
                            ? 'text-construction-400 font-bold'
                            : 'text-charcoal-400 hover:text-white'
                        }`}
                      >
                        <item.icon className={`w-5 h-5 ${active ? 'text-construction-400' : 'text-charcoal-400'}`} />
                        <span className="truncate max-w-[56px] tracking-tight">{item.label.split(' ')[0]}</span>

                        {Boolean(item.badge) && (
                          <span className="absolute top-0 right-1 w-3.5 h-3.5 rounded-full bg-construction-500 text-charcoal-950 font-bold text-[8px] flex items-center justify-center font-mono">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>

                {/* iOS Home Indicator Swipe Bar */}
                <div className="w-28 h-1 bg-charcoal-500/70 rounded-full mx-auto mt-2" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side / Mobile Responsive Quick Switcher Pills for Tablets & Presenters */}
        <div className="flex lg:hidden flex-wrap items-center justify-center gap-2 max-w-sm text-xs">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                pathname === item.href
                  ? 'bg-construction-500 text-charcoal-950 border-construction-400'
                  : 'bg-charcoal-900 border-charcoal-700 text-charcoal-300'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
