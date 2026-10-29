'use client';

import React from 'react';
import Link from 'next/link';
import { HeroConstructionScene } from '@/components/3d/HeroConstructionScene';
import { useDemoStore } from '@/stores/useDemoStore';
import {
  ShieldAlert,
  Store,
  ShoppingCart,
  Truck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Layers,
  Package,
  TrendingUp,
  MapPin,
  Clock,
  FileText,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function LandingPage() {
  const { toggleGuidedTour, businesses, products, orders, deliveryPartners } = useDemoStore();

  const totalGmv = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  const productCards = [
    {
      title: 'Admin Portal',
      subtitle: 'Central Platform Control Plane',
      description: 'Multi-tenant oversight, vendor KYC verification, dispute resolution, location management, and granular RBAC.',
      icon: ShieldAlert,
      href: '/admin/overview',
      roleBadge: 'SUPER_ADMIN',
      badgeColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-800',
      previewMetrics: [
        { label: 'Suppliers', val: `${businesses.length} Active` },
        { label: 'Approvals', val: `${businesses.filter((b) => b.verificationStatus === 'PENDING').length} Pending` },
        { label: 'Platform GMV', val: `₹${(totalGmv / 1000).toFixed(1)}k` },
      ],
      features: ['Vendor KYC Approval', 'Permission Matrix', 'Dispute Resolution', 'Audit Trail'],
      cta: 'Launch Admin Portal',
    },
    {
      title: 'Business Owner App',
      subtitle: 'Construction Store & Yard ERP',
      description: 'Digitize yard inventory, manage multi-unit pricing (Tonnes, Bags, cft), formulate commercial quotes, and schedule dispatches.',
      icon: Store,
      href: '/business/overview',
      roleBadge: 'BUSINESS_OWNER',
      badgeColor: 'text-amber-400 bg-amber-950/40 border-amber-800',
      previewMetrics: [
        { label: 'Store', val: 'Sri Lakshmi' },
        { label: 'Catalog', val: `${products.filter((p) => p.businessId === 'biz-lakshmi').length} SKUs` },
        { label: 'Rating', val: '4.85 ★' },
      ],
      features: ['Real-time Stock Ledger', 'Quotation Engine', 'MOQ & Grade Specs', 'Dispatch Handshake'],
      cta: 'Launch Business App',
    },
    {
      title: 'Customer Commerce App',
      subtitle: 'B2B & B2C Material Procurement',
      description: 'Discover nearby verified yards, compare certified grades (OPC 53, Fe 550D), create multi-ton carts, and request firm quotes.',
      icon: ShoppingCart,
      href: '/customer/home',
      roleBadge: 'CUSTOMER',
      badgeColor: 'text-blue-400 bg-blue-950/40 border-blue-800',
      previewMetrics: [
        { label: 'Discovery', val: 'Bengaluru Urban' },
        { label: 'Cart Status', val: 'Multi-Supplier' },
        { label: 'Tracking', val: 'Visual Timeline' },
      ],
      features: ['Location-aware Discovery', 'Grade Comparison', 'Formal Bulk Quotes', 'Job-site OTP Verification'],
      cta: 'Launch Customer App',
    },
    {
      title: 'Delivery Partner App',
      subtitle: 'Heavy Material Haulage & Dispatch',
      description: 'Mobile-first driver terminal for Tata Ace, flatbed trucks, and tippers. On-demand assignments, navigation notes, and digital proof-of-delivery.',
      icon: Truck,
      href: '/delivery/overview',
      roleBadge: 'DELIVERY_PARTNER',
      badgeColor: 'text-purple-400 bg-purple-950/40 border-purple-800',
      previewMetrics: [
        { label: 'Active Fleet', val: `${deliveryPartners.filter((d) => d.isOnline).length} Online` },
        { label: 'Vehicle', val: 'Tata Ace 1.25T' },
        { label: 'Payout SLA', val: 'Daily Settlement' },
      ],
      features: ['Job Dispatch Radar', 'Load Weight Tonnage', 'Site Access Notes', 'Simulated Secure OTP'],
      cta: 'Launch Delivery App',
    },
  ];

  const materialCategories = [
    { name: 'Cement & Binders', desc: 'OPC 53, PPC 50kg Bags', metric: '₹370 - ₹390 / bag', icon: Package },
    { name: 'TMT Steel & Rebar', desc: 'Fe 550D Earthquake Rebar', metric: '₹68,500 / Tonne', icon: ShieldCheck },
    { name: 'M-Sand & P-Sand', desc: 'VSI Double-washed fine aggregate', metric: '₹1,850 / Tonne', icon: Layers },
    { name: 'Coarse Aggregates', desc: '10mm, 20mm Blue Granite', metric: '₹1,650 / Tonne', icon: Layers },
    { name: 'AAC Blocks & Bricks', desc: 'Thermal insulated 600x200mm', metric: '₹64 / piece', icon: Package },
    { name: 'Plumbing & Drainage', desc: 'CPVC & SWR Pipes 3m length', metric: 'Direct Yard Price', icon: Zap },
  ];

  const lifecycleStages = [
    { num: '01', title: 'Location Discovery', desc: 'Contractor sets delivery pincode & discovers approved yards.' },
    { num: '02', title: 'Quotation Request', desc: 'Submit bulk material spec (e.g. 100 bags cement + 2T steel).' },
    { num: '03', title: 'Supplier Pricing', desc: 'Yard responds with volume discounts, transport fee, and GST.' },
    { num: '04', title: 'Quote Acceptance', desc: 'Contractor accepts quote, generating a live purchase order.' },
    { num: '05', title: 'Warehouse Packing', desc: 'Supplier confirms availability, packs materials, marks ready.' },
    { num: '06', title: 'Fleet Assignment', desc: 'Tata Ace or Flatbed driver accepts haulage job nearby.' },
    { num: '07', title: 'Transit & ETA', desc: 'Real-time transit updates with customer site access notes.' },
    { num: '08', title: 'OTP Sign-Off', desc: 'Customer verifies materials and shares OTP for verified drop.' },
  ];

  return (
    <div className="bg-charcoal-950 text-slate-100 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-charcoal-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-construction-950/25 via-charcoal-950/80 to-charcoal-950 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-construction-500/10 border border-construction-500/30 text-construction-400 text-xs font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Construction Material Ecosystem</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                Everything You Need to Build.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-construction-400 via-amber-500 to-industrial-orange">
                  Delivered.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-charcoal-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Discover trusted construction suppliers, compare material prices, request formal commercial quotations,
                and manage every heavy haulage delivery from one connected platform.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={toggleGuidedTour}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-construction-500 to-amber-600 hover:from-construction-400 hover:to-amber-500 text-charcoal-950 font-bold text-sm transition shadow-amber flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Explore Interactive Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <Link
                  href="/architecture/overview"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 border border-charcoal-700 text-white font-semibold text-sm transition flex items-center justify-center space-x-2"
                >
                  <Layers className="w-4 h-4 text-charcoal-400" />
                  <span>View Platform Architecture</span>
                </Link>
              </div>

              {/* Trust & Spec Highlights */}
              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-charcoal-800/80 max-w-md mx-auto lg:mx-0 text-left">
                <div>
                  <p className="text-xl font-bold text-white font-mono">4 Apps</p>
                  <p className="text-[11px] text-charcoal-400 uppercase tracking-wider">Synchronized</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-construction-400 font-mono">100%</p>
                  <p className="text-[11px] text-charcoal-400 uppercase tracking-wider">Shared Domain</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-emerald-400 font-mono">₹ Minor</p>
                  <p className="text-[11px] text-charcoal-400 uppercase tracking-wider">Safe Decimals</p>
                </div>
              </div>
            </div>

            {/* Right 3D Visualizer */}
            <div className="lg:col-span-6 relative">
              <div className="rounded-2xl border border-charcoal-700/80 bg-charcoal-900/60 p-2 shadow-2xl backdrop-blur-sm">
                <HeroConstructionScene />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Four Interconnected Products Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-widest text-construction-400 font-semibold">
            Integrated Experience
          </span>
          <h2 className="text-3xl font-bold text-white tracking-tight mt-2">
            One Web Application. Four Tailored Products.
          </h2>
          <p className="text-sm text-charcoal-400 mt-3 leading-relaxed">
            Experience how platform administrators, building material suppliers, general contractors, and logistics
            drivers interact in real time with shared domain state.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {productCards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-charcoal-800 bg-charcoal-900/80 hover:border-charcoal-700 p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-xl group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-charcoal-800 border border-charcoal-700 text-construction-400 group-hover:scale-105 transition-transform">
                    <card.icon className="w-6 h-6" />
                  </div>
                  <span className={`px-2.5 py-1 rounded-full border text-xs font-mono font-bold ${card.badgeColor}`}>
                    {card.roleBadge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white tracking-tight">{card.title}</h3>
                <p className="text-xs text-construction-400 font-medium mt-0.5">{card.subtitle}</p>
                <p className="text-xs text-charcoal-300 mt-3 leading-relaxed">{card.description}</p>

                {/* Key Metrics Preview */}
                <div className="grid grid-cols-3 gap-2 py-4 my-4 border-y border-charcoal-800 bg-charcoal-950/40 rounded-lg px-3">
                  {card.previewMetrics.map((m) => (
                    <div key={m.label}>
                      <span className="text-[10px] text-charcoal-400 uppercase tracking-wider block font-mono">
                        {m.label}
                      </span>
                      <span className="text-xs font-bold text-white mt-0.5 block">{m.val}</span>
                    </div>
                  ))}
                </div>

                {/* Features Pills */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {card.features.map((f) => (
                    <div key={f} className="flex items-center text-xs text-charcoal-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-construction-500 mr-1.5 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href={card.href}
                className="w-full py-2.5 px-4 rounded-xl bg-charcoal-800 hover:bg-construction-500 hover:text-charcoal-950 text-white font-semibold text-xs transition flex items-center justify-center space-x-2 border border-charcoal-700 hover:border-construction-400"
              >
                <span>{card.cta}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Visual End-to-End Order Lifecycle Flow */}
      <section className="py-16 bg-charcoal-900/40 border-y border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-construction-400 font-semibold">
              Operational Traceability
            </span>
            <h2 className="text-3xl font-bold text-white tracking-tight mt-2">
              The Synchronized Order & Haulage Lifecycle
            </h2>
            <p className="text-sm text-charcoal-400 mt-2">
              From site quote formulation to yard loadout and verified delivery completion.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {lifecycleStages.map((stage) => (
              <div
                key={stage.num}
                className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-800 hover:border-charcoal-700 transition"
              >
                <span className="text-2xl font-black font-mono text-construction-500/40">{stage.num}</span>
                <h4 className="text-sm font-bold text-white mt-1">{stage.title}</h4>
                <p className="text-xs text-charcoal-400 mt-1.5 leading-relaxed">{stage.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Material Categories Catalog Showcase */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-construction-400 font-semibold">
              Verified Building Materials
            </span>
            <h2 className="text-3xl font-bold text-white tracking-tight mt-2">
              Standardized Specifications & Wholesale Units
            </h2>
            <p className="text-sm text-charcoal-400 mt-1">
              Cement bags, metric tonnes of steel, cubic feet of sand, and pallets of blocks.
            </p>
          </div>
          <Link
            href="/customer/products"
            className="mt-4 md:mt-0 text-xs font-semibold text-construction-400 hover:text-construction-300 inline-flex items-center space-x-1"
          >
            <span>Browse Full Marketplace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {materialCategories.map((c) => (
            <div
              key={c.name}
              className="p-5 rounded-xl border border-charcoal-800 bg-charcoal-900/60 hover:border-charcoal-700 transition flex items-start space-x-4"
            >
              <div className="p-2.5 rounded-lg bg-construction-500/10 border border-construction-500/20 text-construction-400 shrink-0">
                <c.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white">{c.name}</h4>
                <p className="text-xs text-charcoal-400 mt-0.5">{c.desc}</p>
                <span className="inline-block mt-2 px-2 py-0.5 rounded bg-charcoal-800 text-[11px] font-mono font-semibold text-construction-400">
                  {c.metric}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Demo Launch Banner */}
      <section className="py-16 bg-gradient-to-r from-construction-950 via-charcoal-900 to-charcoal-950 border-t border-charcoal-800">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-construction-500/20 border border-construction-500/40 text-construction-300 text-xs font-mono font-semibold">
            <Sparkles className="w-4 h-4 text-construction-400" />
            <span>Ready for Client Presentation</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Step Inside the Complete PavePort Ecosystem
          </h2>

          <p className="text-sm sm:text-base text-charcoal-300 max-w-2xl mx-auto leading-relaxed">
            Follow the guided tour to approve a supplier, list materials, receive an estimate, dispatch a truck, and
            verify delivery at the building site.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/demo/guide"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-construction-500 hover:bg-construction-400 text-charcoal-950 font-bold text-sm transition shadow-amber flex items-center justify-center space-x-2"
            >
              <span>Start 9-Step Guided Demo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/architecture/overview"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 border border-charcoal-600 text-white font-semibold text-sm transition"
            >
              <span>Explore Technical Architecture</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-charcoal-800 bg-charcoal-950 py-12 text-xs text-charcoal-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-6 h-6 rounded bg-construction-500 flex items-center justify-center text-charcoal-950 font-black font-mono text-sm">
                P
              </div>
              <span className="font-bold text-white text-base">PavePort</span>
            </div>
            <p className="text-charcoal-400 text-[11px] leading-relaxed">
              Construction material commerce, inventory digital ledger, bulk quotation formulation, and heavy haulage
              fulfillment platform.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Applications</h5>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link href="/admin/overview" className="hover:text-white transition">Admin Portal</Link></li>
              <li><Link href="/business/overview" className="hover:text-white transition">Business Owner App</Link></li>
              <li><Link href="/customer/home" className="hover:text-white transition">Customer Marketplace</Link></li>
              <li><Link href="/delivery/overview" className="hover:text-white transition">Delivery Fleet App</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Architecture</h5>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link href="/architecture/overview" className="hover:text-white transition">C4 System Blueprint</Link></li>
              <li><Link href="/architecture/backend" className="hover:text-white transition">Go REST API Spec</Link></li>
              <li><Link href="/architecture/database" className="hover:text-white transition">PostgreSQL DDL & Schema</Link></li>
              <li><Link href="/architecture/mobile" className="hover:text-white transition">Expo React Native Spec</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Demo Controls</h5>
            <p className="text-[11px] leading-relaxed mb-3">
              All 4 applications operate with shared in-memory and persisted storage simulating REST v1 endpoints.
            </p>
            <button
              onClick={toggleGuidedTour}
              className="px-3 py-1.5 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 text-construction-400 font-semibold text-[11px] border border-charcoal-700"
            >
              Open Tour Controller
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-charcoal-900 flex flex-col sm:flex-row items-center justify-between text-[11px]">
          <p>&copy; 2026 PavePort Technologies Inc. All rights reserved.</p>
          <p className="font-mono text-charcoal-500">Prototype Build 1.0.0 &bull; Ready for Presentation</p>
        </div>
      </footer>
    </div>
  );
}

