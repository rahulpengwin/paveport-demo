'use client';

import React from 'react';
import { AppShell } from '@/components/common/AppShell';
import Link from 'next/link';
import {
  Layers,
  Server,
  Database,
  Smartphone,
  ShieldAlert,
  Settings,
  ArrowRight,
  Cpu,
  Cloud,
  CheckCircle2,
} from 'lucide-react';

export default function ArchitectureOverviewPage() {
  const sections = [
    {
      title: 'Production Go Backend',
      desc: 'Modular REST API under /api/v1, structured logging, OpenAPI specs, and Redis asynchronous worker queues.',
      href: '/architecture/backend',
      icon: Server,
      tag: 'Go 1.23 • REST • Redis',
    },
    {
      title: 'PostgreSQL Database & Neon DDL',
      desc: 'Multi-tenant schema, ACID transaction boundaries, and SELECT FOR UPDATE locking for stock and dispatch.',
      href: '/architecture/database',
      icon: Database,
      tag: 'PostgreSQL 16 • Neon • ACID',
    },
    {
      title: 'Expo React Native Mobile Suite',
      desc: 'Mobile architecture for Business, Customer, and Delivery apps with offline caching and NativeWind.',
      href: '/architecture/mobile',
      icon: Smartphone,
      tag: 'Expo SDK • iOS & Android',
    },
    {
      title: 'Security, Tenancy & RBAC Model',
      desc: 'Server-side permission enforcement, cryptographic audit trails, Argon2id hashing, and tenant isolation.',
      href: '/architecture/security',
      icon: ShieldAlert,
      tag: 'RBAC • WAF • Tenant Isolation',
    },
    {
      title: 'DevOps, Docker & AWS Cloud',
      desc: 'Docker Compose, AWS ECS Fargate, Cloudflare edge proxy, S3 object storage, and GitHub Actions CI/CD.',
      href: '/architecture/devops',
      icon: Cloud,
      tag: 'AWS • Docker • Cloudflare',
    },
  ];

  return (
    <AppShell
      appType="architecture"
      title="PavePort Production Architecture Blueprint"
      subtitle="Honest technical specifications detailing the evolution from this interactive prototype to production enterprise SaaS."
    >
      <div className="space-y-8">
        {/* System Context Blueprint Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-charcoal-900 via-charcoal-850 to-charcoal-900 border border-charcoal-800 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
            <Layers className="w-4 h-4" />
            <span>C4 Model — System Context & Data Flow Topology</span>
          </div>

          <h3 className="text-xl font-bold text-white tracking-tight">
            Distributed Multi-Tier SaaS Architecture
          </h3>

          <p className="text-xs text-charcoal-300 leading-relaxed max-w-3xl">
            PavePort decouples frontend customer and operator interfaces from an enterprise Go backend. While this
            prototype runs an in-memory synchronized simulation layer with persistent local state, the production platform
            executes on containerized Go services backed by Neon PostgreSQL, ElastiCache Redis, and S3-compatible asset
            storage.
          </p>

          {/* ASCII / Schematic Topology Diagram */}
          <div className="p-4 rounded-xl bg-charcoal-950 border border-charcoal-800 font-mono text-[11px] text-charcoal-300 overflow-x-auto leading-relaxed">
            <pre className="text-construction-400">
{`+-----------------------------------------------------------------------------------------+
|                                    EDGE TIER (Cloudflare)                               |
|                     DDoS Shield • SSL Termination • Web Application Firewall (WAF)      |
+-----------------------------------------------------------------------------------------+
       |                                      |                                   |
       v                                      v                                   v
+------------------+                 +------------------+                +------------------+
| Next.js Web App  |                 | Expo Mobile Apps |                 | Webhook Gateways |
| Admin & Business |                 | Customer & Fleet |                 | Banks & Carriers |
+------------------+                 +------------------+                +------------------+
       |                                      |                                   |
       +--------------------+-----------------+-----------------------------------+
                            |  HTTPS / TLS 1.3 (Bearer JWT)
                            v
+-----------------------------------------------------------------------------------------+
|                        APPLICATION TIER: Production Go API Service                      |
|            Routing (Chi/Fiber) • RBAC Interceptors • Domain Services • DTO Validation   |
+-----------------------------------------------------------------------------------------+
             |                                    |                          |
     gRPC / SQL Pools                             | Jobs Queue               | Pre-signed URLs
             v                                    v                          v
+-------------------------+             +-------------------+      +----------------------+
| Neon PostgreSQL 16      |             | Redis 7.2         |      | AWS S3 Object Store  |
| Primary / Replica Pools |             | Caching & Asynq   |      | Invoices & Documents |
| Strict ACID & Locks     |             | Notification Jobs |      | Geo-redundant Store  |
+-------------------------+             +-------------------+      +----------------------+`}
            </pre>
          </div>
        </div>

        {/* Deep Dive Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((s) => (
            <Link
              key={s.title}
              href={s.href}
              className="p-5 rounded-xl bg-charcoal-900 border border-charcoal-800 hover:border-construction-500/60 transition shadow-card flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-lg bg-charcoal-800 border border-charcoal-700 text-construction-400 group-hover:scale-105 transition-transform">
                    <s.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-charcoal-400 bg-charcoal-800 px-2 py-0.5 rounded">
                    {s.tag}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white tracking-tight group-hover:text-construction-400 transition">
                  {s.title}
                </h4>
                <p className="text-xs text-charcoal-300 mt-2 leading-relaxed">{s.desc}</p>
              </div>

              <div className="pt-2 border-t border-charcoal-800/80 flex items-center text-xs text-construction-400 font-semibold group-hover:underline">
                <span>Inspect Technical Specification</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

