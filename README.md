# PavePort — Construction Material Commerce & Delivery Operations Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL_3D-orange?style=flat&logo=three.js)](https://threejs.org/)
[![Zustand](https://img.shields.io/badge/State-Zustand_Synchronized-brown)](https://github.com/pmndrs/zustand)
[![Tests](https://img.shields.io/badge/Tests-Vitest_Passing-brightgreen?style=flat&logo=vitest)](https://vitest.dev/)

PavePort is a modern digital commerce, quotation formulate engine, inventory digital ledger, order management, and heavy haulage delivery operations platform designed for the construction material ecosystem.

This repository hosts a client-presentable demonstration prototype inside **one unified Next.js web application** that integrates four interconnected products with shared domain models, persistent state, deterministic Indian construction market seed data, and a 9-step synchronized cross-application workflow.

---

## 1. Executive Summary & Implemented Products

PavePort integrates four purpose-built application shells with a persistent cross-app header, persona switcher, and interactive guided tour:

1. **Admin Portal (`/admin/*`)** — The central operations control plane:
   - Live KPI executive dashboard (GMV, registered yards, in-transit fleet, inventory alerts).
   - Vendor onboarding KYC approval (GSTIN REG-06 and Municipal trade licenses inspection & activation).
   - Platform-wide order and commercial quotation oversight.
   - Granular Role-Based Access Control (RBAC) permission matrix with 23 operational scopes and real-time role switching.
   - Comprehensive audit logging and financial CSV export.

2. **Business Owner App (`/business/*`)** — Supplier & material yard ERP:
   - Multi-step vendor enrollment checklist and operating schedule configuration.
   - Material catalog management supporting construction-specific units (Bags 50kg, Metric Tonnes, Cubic Feet, Bundles).
   - Real-time stock ledger with atomic reservation holds during pending fulfillment.
   - Commercial quotation formulation engine (discounting unit rates, adding freight fees, and calculating statutory 18% GST).
   - Purchase order acceptance, staging, and dispatch broadcasting to haulage drivers.

3. **Customer App (`/customer/*`)** — B2B contractor & retail homebuilder commerce:
   - Geo-located supplier discovery across Bengaluru Urban corridors.
   - Wholesale material search and certified grade comparison (OPC 53, Fe 550D rebar, VSI M-sand).
   - Cart checkout with simulated payment and single-supplier dispatch constraints.
   - Commercial bulk quotation submission, counter-quote review, and 1-click **Accept Quotation** converting bids into binding purchase orders.
   - Visual 8-stage fulfillment timeline and schematic corridor haulage map with secure customer delivery OTP.

4. **Delivery Partner App (`/delivery/*`)** — Heavy material logistics terminal:
   - Mobile-first driver interface designed for outdoor readability and large touch targets.
   - Available haulage job radar displaying cargo tonnage, pickup yard, site drop-off, and guaranteed driver payouts.
   - Single-acceptance atomic lock preventing duplicate claims across fleet drivers.
   - Digital proof-of-delivery verifying the customer's 4-digit site OTP (e.g. `4829`) and crediting driver earnings.
   - Operational exception reporting (site gate locked, narrow access clearance, weather delays).

5. **Brand Presentation & Interactive 3D Experience (`/`)**:
   - Three.js WebGL hero featuring a stylized architectural concrete slab, structural columns, Fe550D rebar reinforcement cage, palletized UltraTech cement bags, animated yellow tower crane, and material transport lorry.
   - Interactive mouse parallax, soft studio drop shadows, ambient dust particles, and graceful fallback for low-spec/reduced-motion environments.

---

## 2. Application Routes & Demo Entry Points

| Product | Entry Route | Key Sub-Routes |
| :--- | :--- | :--- |
| **Presentation & Launch** | `/` | `/demo`, `/demo/guide` |
| **Admin Portal** | `/admin/overview` | `/admin/businesses`, `/admin/orders`, `/admin/roles`, `/admin/inventory`, `/admin/reports`, `/admin/audit-logs` |
| **Business Owner App** | `/business/overview` | `/business/products`, `/business/inventory`, `/business/quotations`, `/business/orders`, `/business/onboarding` |
| **Customer App** | `/customer/home` | `/customer/stores`, `/customer/stores/biz-lakshmi`, `/customer/products`, `/customer/cart`, `/customer/quotations`, `/customer/orders` |
| **Delivery Partner App**| `/delivery/overview` | `/delivery/available-jobs`, `/delivery/active-delivery`, `/delivery/history`, `/delivery/earnings`, `/delivery/profile` |
| **Technical Blueprint** | `/architecture/overview`| `/architecture/backend`, `/architecture/database`, `/architecture/mobile`, `/architecture/security`, `/architecture/devops` |

---

## 3. Setup and Run Instructions

### Prerequisites
- Node.js `v20+` or `v24+`
- npm `v10+`

### Installation
```bash
# Clone or navigate to the workspace
cd Paveport2-designs

# Install dependencies
npm install

# Run unit tests
npm test

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build Verification
```bash
# Run TypeScript type-checking
npx tsc --noEmit

# Compile production bundle
npm run build

# Start production server
npm run start
```

---

## 4. The 9-Step Cross-Application Synchronized Demo Workflow

To experience how all 4 products update the same shared domain state in real-time, click **Guided Tour** in the top navigation bar or navigate to `/demo/guide`:

1. **Step 1 (Admin Portal — `/admin/businesses`)**: Review pending supplier **DecoRock Precast, Pavers & AAC Blocks**, inspect submitted GSTIN and municipal trade licenses, and click **Review KYC & Approve**.
2. **Step 2 (Business App — `/business/products`)**: Switch to **Sri Lakshmi Cement & Building Supplies** to inspect wholesale catalog rates (UltraTech Super Cement @ ₹385/bag) and available physical yard stock.
3. **Step 3 (Customer App — `/customer/stores/biz-lakshmi`)**: As contractor **Ramesh Kumar (InfraBuild)**, discover Sri Lakshmi Cement, add 100 bags to cart, and click **Request Bulk Quote (100x)**.
4. **Step 4 (Business App — `/business/quotations`)**: The yard receives Quote `#PV-QT-2026-0042`. Click **Formulate Quote & Submit**, discount rate to ₹380/bag, add ₹1,200 transport fee + 18% GST, and transmit the official quote.
5. **Step 5 (Customer App — `/customer/quotations`)**: The customer reviews the official quote breakdown (Total ₹46,040). Click **Accept Quotation & Generate Order**, converting the bid into Purchase Order `#PV-ORD-2026-8003` and reserving warehouse stock!
6. **Step 6 (Business App — `/business/orders`)**: The warehouse supervisor clicks **Accept Order**, packs materials, and clicks **Mark Ready for Dispatch** to broadcast the load to fleet drivers.
7. **Step 7 (Delivery App — `/delivery/available-jobs`)**: Driver **Murugan Selvam (Tata Ace 1.25T)** sees the job alert with a ₹1,020 payout. Click **Accept Delivery Assignment** to claim the load.
8. **Step 8 (Delivery App — `/delivery/active-delivery`)**: Driver clicks **Confirm Yard Pickup**, transitions to **In-Transit**, and enters the customer's site OTP (**`4829`**) to verify proof-of-delivery.
9. **Step 9 (Admin Portal — `/admin/overview`)**: Platform executive view updates platform GMV, marks the order delivered, records driver compensation, and documents every step in the tamper-evident audit trail!

*Note: At any time during the presentation, clicking **Reset Demo** in the top banner restores the seed data.*

---

## 5. Automated Tests Performed & Results

Comprehensive automated test suites cover domain logic, RBAC, inventory reservation locks, quotation acceptance, and delivery completion:

```
 RUN  v3.2.7 H:/Paveport2-designs

 ✓ tests/unit/domain.test.ts (7 tests) 12ms
   ✓ PavePort Domain State & RBAC Logic > RBAC & Permissions > SUPER_ADMIN possesses full administrative scopes
   ✓ PavePort Domain State & RBAC Logic > RBAC & Permissions > CUSTOMER role cannot approve businesses or manage roles
   ✓ PavePort Domain State & RBAC Logic > RBAC & Permissions > BUSINESS_VERIFICATION_ADMIN can approve businesses but cannot dispatch deliveries
   ✓ PavePort Domain State & RBAC Logic > Business Approval & Catalog Lifecycle > approves a pending business and generates audit log
   ✓ PavePort Domain State & RBAC Logic > Business Approval & Catalog Lifecycle > creates new product and manages inventory adjustments
   ✓ PavePort Domain State & RBAC Logic > Quotation & Order Lifecycle > customer requests quote, business responds, customer accepts and order is created
   ✓ PavePort Domain State & RBAC Logic > Delivery Haulage & OTP Verification > business stages dispatch, driver accepts, and completes delivery with valid OTP

 Test Files  1 passed (1)
      Tests  7 passed (7)
```

- **TypeScript Compilation:** Strict type-checking via `npx tsc --noEmit` passed with 0 errors.
- **Production Build:** Next.js 15 App Router production compilation (`npm run build`) succeeded across all 49 static and dynamic routes.

---

## 6. Production Architecture & Migration Blueprint

The complete target architecture is documented in `/architecture/*`:

- **Backend:** Go 1.23 modular monolith using `go-chi/chi/v5` router, `jackc/pgx/v5` connection pool, `rs/zerolog` JSON logging, and `hibiken/asynq` Redis background job workers.
- **Database:** Serverless PostgreSQL 16 hosted on Neon. Features integer minor units (`BIGINT` paise) to prevent floating-point rounding errors, `SELECT FOR UPDATE` row locks to prevent stock overselling and duplicate driver claims, and PostgreSQL Row-Level Security (RLS) for tenant isolation.
- **Mobile Suite:** Expo React Native (SDK 52), NativeWind, Zustand, and MMKV for sub-millisecond offline cache. 3D WebGL renderers are strictly isolated from the native bundle.
- **Infrastructure:** AWS ECS Fargate serverless containers, Application Load Balancers, Cloudflare WAF & DDoS mitigation, AWS S3 object storage with SSE-KMS encryption, and GitHub Actions CI/CD.

