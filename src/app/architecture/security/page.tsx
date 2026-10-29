'use client';

import React from 'react';
import { AppShell } from '@/components/common/AppShell';
import { ShieldAlert, Lock, Key, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ArchitectureSecurityPage() {
  return (
    <AppShell
      appType="architecture"
      title="Security, Multi-Tenancy & Authorization Model"
      subtitle="Server-side RBAC enforcement, strict tenant data isolation, and cryptographic audit trails."
    >
      <div className="space-y-6 text-xs text-charcoal-300">
        {/* Core Authorization Guarantee */}
        <div className="p-5 rounded-xl bg-charcoal-900 border border-charcoal-800 space-y-3">
          <div className="flex items-center space-x-2 text-rose-400 font-bold font-mono">
            <ShieldAlert className="w-4 h-4" />
            <span>CRITICAL ARCHITECTURAL BOUNDARY: SERVER-ENFORCED RBAC</span>
          </div>

          <p className="leading-relaxed">
            In this demonstration prototype, Zustand client state reflects the selected role to provide an interactive
            presentation switcher. However, <strong className="text-white">in production, client roles and frontend state are never trusted for authorization</strong>.
            The Go API enforces every permission and tenant boundary independently through signed JWT claims and SQL
            parameterization.
          </p>

          <div className="p-3.5 rounded-lg bg-charcoal-950 border border-charcoal-800 text-[11px] font-mono text-charcoal-300">
            <pre className="text-emerald-400">
{`// Production Go Middleware: EnforcePermission
func RequirePermission(perm string) gin.HandlerFunc {
    return func(c *gin.Context) {
        claims := c.MustGet("claims").(*JWTClaims)
        if !claims.HasPermission(perm) {
            c.AbortWithStatusJSON(403, gin.H{
                "error": "FORBIDDEN",
                "required_scope": perm,
                "actor_id": claims.Subject,
            })
            return
        }
        c.Next()
    }
}`}
            </pre>
          </div>
        </div>

        {/* Tenant Isolation Strategy */}
        <div className="p-5 rounded-xl bg-charcoal-900 border border-charcoal-800 space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Multi-Tenant Data Isolation Strategy
          </h3>
          <p className="leading-relaxed">
            Construction material suppliers maintain proprietary commercial pricing, inventory ledgers, and profit
            margins. PavePort enforces multi-tenant row isolation using two complementary security layers:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-charcoal-850 border border-charcoal-800 space-y-2">
              <span className="font-mono text-construction-400 font-bold block">1. Application Scoping</span>
              <p className="text-charcoal-400">
                Every business repository query explicitly filters by <code className="text-white font-mono">WHERE business_id = $tenant_id</code> extracted
                securely from the authenticated token context.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-charcoal-850 border border-charcoal-800 space-y-2">
              <span className="font-mono text-construction-400 font-bold block">2. PostgreSQL Row-Level Security (RLS)</span>
              <p className="text-charcoal-400">
                PostgreSQL database sessions set <code className="text-white font-mono">app.current_tenant_id</code>, enabling
                database-level RLS policies that block cross-tenant leakage even in the event of an application SQL bug.
              </p>
            </div>
          </div>
        </div>

        {/* Cryptographic Standards */}
        <div className="p-5 rounded-xl bg-charcoal-900 border border-charcoal-800 space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Cryptographic & Authentication Standards
          </h3>
          <ul className="space-y-1.5 list-disc list-inside text-charcoal-400">
            <li><strong className="text-white">Password Hashing:</strong> Argon2id (m=65536, t=3, p=4) with unique salts.</li>
            <li><strong className="text-white">Session Tokens:</strong> Short-lived Ed25519-signed JWTs (15 min) + Redis refresh tokens.</li>
            <li><strong className="text-white">OTP Verification:</strong> Cryptographically random 4-digit codes hashed with HMAC-SHA256 and rate-limited to 3 attempts.</li>
            <li><strong className="text-white">Sensitive Documents:</strong> S3 server-side encryption (SSE-KMS) with pre-signed ephemeral URLs (5 min expiry).</li>
          </ul>
        </div>
      </div>
    </AppShell>
  );
}

