'use client';

import React from 'react';
import { AppShell } from '@/components/common/AppShell';
import { Cloud, Server, Database, CheckCircle2, GitBranch, ShieldCheck } from 'lucide-react';

export default function ArchitectureDevopsPage() {
  return (
    <AppShell
      appType="architecture"
      title="DevOps, Cloud Topology & CI/CD Pipelines"
      subtitle="Production deployment specifications using Docker, AWS ECS Fargate, Neon, and GitHub Actions."
    >
      <div className="space-y-6 text-xs text-charcoal-300">
        {/* Local Docker Compose */}
        <div className="p-5 rounded-xl bg-charcoal-900 border border-charcoal-800 space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Local Development Environment (Docker Compose)
          </h3>
          <p className="leading-relaxed">
            Local development mirrors production services using containerized PostgreSQL, Redis, and MinIO (S3 mock).
          </p>

          <div className="p-3.5 rounded-lg bg-charcoal-950 border border-charcoal-800 font-mono text-[11px] text-construction-300">
            <pre>
{`version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: paveport_dev
      POSTGRES_USER: paveport
      POSTGRES_PASSWORD: dev_secret_password
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7.2-alpine
    ports:
      - "6379:6379"

  api:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    ports:
      - "8080:8080"
    environment:
      DATABASE_URL: "postgres://paveport:dev_secret_password@postgres:5432/paveport_dev?sslmode=disable"
      REDIS_URL: "redis://redis:6379"
    depends_on:
      - postgres
      - redis`}
            </pre>
          </div>
        </div>

        {/* AWS Production Topology */}
        <div className="p-5 rounded-xl bg-charcoal-900 border border-charcoal-800 space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Target AWS Production Infrastructure
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-charcoal-850 border border-charcoal-800 space-y-1">
              <span className="font-mono text-construction-400 font-bold block">Compute: AWS ECS Fargate</span>
              <p className="text-charcoal-400">
                Serverless Linux containers running the Go API behind an Application Load Balancer (ALB) across multiple
                availability zones.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-charcoal-850 border border-charcoal-800 space-y-1">
              <span className="font-mono text-construction-400 font-bold block">Database: Neon PostgreSQL</span>
              <p className="text-charcoal-400">
                Managed serverless PostgreSQL with automated storage scaling, connection pooling, and continuous point-in-time
                backups.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-charcoal-850 border border-charcoal-800 space-y-1">
              <span className="font-mono text-construction-400 font-bold block">Edge: Cloudflare WAF & DNS</span>
              <p className="text-charcoal-400">
                Global edge network terminating TLS 1.3, mitigating Layer 3/4/7 DDoS attacks, and caching static assets.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-charcoal-850 border border-charcoal-800 space-y-1">
              <span className="font-mono text-construction-400 font-bold block">Storage: AWS S3 + CloudFront</span>
              <p className="text-charcoal-400">
                Encrypted object storage for commercial PDF invoices, vendor registration permits, and material imagery.
              </p>
            </div>
          </div>
        </div>

        {/* CI/CD Pipeline */}
        <div className="p-5 rounded-xl bg-charcoal-900 border border-charcoal-800 space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Continuous Integration & Deployment (GitHub Actions)
          </h3>
          <p className="leading-relaxed">
            Every pull request triggers automated Go tests, golangci-lint, TypeScript strict check, Next.js production build,
            and Docker security vulnerability scanning with Trivy before canary deployment to staging.
          </p>
        </div>
      </div>
    </AppShell>
  );
}

