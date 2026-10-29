'use client';

import React from 'react';
import { AppShell } from '@/components/common/AppShell';
import { Server, CheckCircle2, Code2, Zap, ShieldCheck } from 'lucide-react';

export default function ArchitectureBackendPage() {
  return (
    <AppShell
      appType="architecture"
      title="Production Go Backend Architecture"
      subtitle="High-throughput modular monolith built with Go 1.23, Chi router, pgx/v5, and Redis asynq."
    >
      <div className="space-y-6 text-xs text-charcoal-300">
        {/* Core Principles */}
        <div className="p-5 rounded-xl bg-charcoal-900 border border-charcoal-800 space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Architectural Philosophy & Package Structure
          </h3>
          <p className="leading-relaxed">
            The target production backend avoids bloated microservice overhead by employing a maintainable{' '}
            <strong className="text-white">Modular Monolith</strong> in Go. Internal domain boundaries (Catalog,
            Quotations, Orders, Logistics, Identity) communicate via strongly-typed Go service interfaces and database
            transactions, with zero distributed network hops.
          </p>

          <div className="p-3.5 rounded-lg bg-charcoal-950 border border-charcoal-800 font-mono text-[11px] text-construction-300">
            <pre>
{`cmd/
  api/            # Application entrypoint, graceful signal traps, HTTP server setup
  worker/         # Asynchronous task processor (SMS, push, PDF invoice generation)
internal/
  platform/       # Database pools (pgxpool), Redis client, structured zerolog
  middleware/     # Auth JWT interceptor, RBAC validator, rate limiter, request correlation ID
  modules/
    identity/     # Authentication, RBAC authority, user & business registration
    catalog/      # Materials, categories, units of measure, wholesale pricing
    inventory/    # Physical stock ledgers, atomic reservation locks (SELECT FOR UPDATE)
    quotations/   # Commercial estimates, validity calculators, quote-to-order transformation
    orders/       # Purchase orders, state machines, payment webhook reconciliation
    logistics/    # Haulage job dispatching, carrier proximity match, OTP sign-off verification`}
            </pre>
          </div>
        </div>

        {/* Selected Production Go Libraries */}
        <div className="p-5 rounded-xl bg-charcoal-900 border border-charcoal-800 space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Selected Libraries & Rationale
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-charcoal-850 border border-charcoal-800 space-y-1">
              <span className="font-mono text-construction-400 font-bold text-xs">go-chi/chi/v5</span>
              <p className="text-charcoal-400">
                Lightweight, 100% idiomatic HTTP router with zero external dependencies and composable sub-routers.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-charcoal-850 border border-charcoal-800 space-y-1">
              <span className="font-mono text-construction-400 font-bold text-xs">jackc/pgx/v5</span>
              <p className="text-charcoal-400">
                Pure Go PostgreSQL driver with native connection pooling, binary protocol support, and high performance.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-charcoal-850 border border-charcoal-800 space-y-1">
              <span className="font-mono text-construction-400 font-bold text-xs">hibiken/asynq</span>
              <p className="text-charcoal-400">
                Redis-backed distributed task queue supporting delayed execution, retries, and high-priority dispatches.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-charcoal-850 border border-charcoal-800 space-y-1">
              <span className="font-mono text-construction-400 font-bold text-xs">rs/zerolog</span>
              <p className="text-charcoal-400">
                Zero-allocation JSON structured logging with automatic caller tracing and contextual audit fields.
              </p>
            </div>
          </div>
        </div>

        {/* Standard REST API Error Format */}
        <div className="p-5 rounded-xl bg-charcoal-900 border border-charcoal-800 space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Deterministic Error Envelope & Idempotency
          </h3>
          <p className="leading-relaxed">
            All endpoints adhere to RFC 7807 Problem Details. Critical mutations (e.g.{' '}
            <code className="text-construction-400">POST /api/v1/orders</code>) accept an{' '}
            <code className="text-construction-400">Idempotency-Key</code> HTTP header cached in Redis for 24 hours to
            guarantee that retried mobile network requests never duplicate purchase orders or stock deductions.
          </p>

          <div className="p-3 rounded-lg bg-charcoal-950 border border-charcoal-800 font-mono text-[11px] text-charcoal-300">
            <pre>
{`{
  "type": "https://api.paveport.in/v1/errors/INSUFFICIENT_STOCK",
  "title": "Insufficient Available Material Stock",
  "status": 409,
  "detail": "Requested 100 bags of UltraTech OPC 53, but only 45 units available.",
  "instance": "/api/v1/quotations/quote-1001/accept",
  "timestamp": "2026-10-29T21:00:00Z"
}`}
            </pre>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

